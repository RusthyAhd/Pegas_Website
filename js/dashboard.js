/* ==========================================================================
   PEGAS DASHBOARD & BOC FLEX WALLET - JAVASCRIPT CONTROLLER
   Handles View Routing, 4-PIN Security Auth, WebRTC Camera Scanner & Wallet
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let enteredPin = [];
    const CORRECT_PIN = '1234';
    let targetDestination = null; // 'scanner' or 'wallet'
    let mediaStream = null;
    let isTorchOn = false;
    let walletBalance = 248500.00;
    let isBalanceHidden = false;

    // DOM Elements - Views
    const dashboardHomeView = document.getElementById('dashboard-home-view');
    const scannerView = document.getElementById('scanner-view');
    const walletView = document.getElementById('wallet-view');
    const viewContainers = [dashboardHomeView, scannerView, walletView];

    // DOM Elements - PIN Modal
    const pinModalOverlay = document.getElementById('pin-modal-overlay');
    const pinCardContainer = document.querySelector('.pin-card-container');
    const pinDots = document.querySelectorAll('.pin-dot');
    const pinModalClose = document.getElementById('pin-modal-close');
    const pinModalSubtitle = document.getElementById('pin-modal-subtitle');
    const keypadButtons = document.querySelectorAll('.keypad-btn');

    // DOM Elements - Scanner View
    const cameraVideo = document.getElementById('camera-video');
    const btnSimulateScan = document.getElementById('btn-simulate-scan');
    const btnToggleTorch = document.getElementById('btn-toggle-torch');
    const btnBackScanner = document.getElementById('btn-back-scanner');

    // DOM Elements - Wallet View
    const balanceDisplay = document.getElementById('balance-display-text');
    const btnToggleBalance = document.getElementById('btn-toggle-balance');
    const btnBackWallet = document.getElementById('btn-back-wallet');
    const btnQuickTopup = document.getElementById('btn-quick-topup');
    const btnQuickSend = document.getElementById('btn-quick-send');
    const txList = document.getElementById('tx-list');

    // ==========================================
    // 1. VIEW ROUTING MANAGER
    // ==========================================
    function showView(viewElement) {
        viewContainers.forEach(view => {
            if (view) {
                view.classList.remove('active');
                view.style.display = 'none';
            }
        });

        if (viewElement) {
            viewElement.style.display = 'block';
            // Trigger animation frame for CSS opacity transition
            requestAnimationFrame(() => {
                viewElement.classList.add('active');
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Camera control based on view
        if (viewElement === scannerView) {
            startCamera();
        } else {
            stopCamera();
        }
    }

    // Exported function for card buttons
    window.handleCardClick = function(actionType) {
        if (actionType === 'register') {
            window.location.href = 'register.html';
        } else if (actionType === 'buy') {
            openPinModal('scanner', 'Scan & Purchase Authorization');
        } else if (actionType === 'wallet') {
            openPinModal('wallet', 'FlutterHub Wallet Security Check');
        }
    };

    // Back Buttons
    if (btnBackScanner) {
        btnBackScanner.addEventListener('click', () => showView(dashboardHomeView));
    }
    if (btnBackWallet) {
        btnBackWallet.addEventListener('click', () => showView(dashboardHomeView));
    }

    // ==========================================
    // 2. 4-PIN AUTHORIZATION MODAL LOGIC
    // ==========================================
    function openPinModal(destination, titleText) {
        targetDestination = destination;
        enteredPin = [];
        updatePinDots();
        if (pinModalSubtitle) {
            pinModalSubtitle.textContent = titleText || 'Enter your 4-digit security PIN';
        }
        if (pinCardContainer) {
            pinCardContainer.classList.remove('shake');
        }
        if (pinModalOverlay) {
            pinModalOverlay.classList.add('active');
        }
    }

    function closePinModal() {
        if (pinModalOverlay) {
            pinModalOverlay.classList.remove('active');
        }
        enteredPin = [];
        updatePinDots();
    }

    if (pinModalClose) {
        pinModalClose.addEventListener('click', closePinModal);
    }
    if (pinModalOverlay) {
        pinModalOverlay.addEventListener('click', (e) => {
            if (e.target === pinModalOverlay) closePinModal();
        });
    }

    function updatePinDots(isError = false) {
        pinDots.forEach((dot, index) => {
            dot.classList.remove('filled', 'error');
            if (isError) {
                dot.classList.add('error');
            } else if (index < enteredPin.length) {
                dot.classList.add('filled');
            }
        });
    }

    function handleKeypadInput(value) {
        if (value === 'clear') {
            enteredPin = [];
            updatePinDots();
            return;
        }
        if (value === 'back') {
            enteredPin.pop();
            updatePinDots();
            return;
        }

        if (enteredPin.length < 4 && !isNaN(value)) {
            enteredPin.push(value);
            updatePinDots();

            if (enteredPin.length === 4) {
                verifyPin();
            }
        }
    }

    function verifyPin() {
        const pinString = enteredPin.join('');
        const userRegisteredPin = localStorage.getItem('user_registered_pin');
        const isValidPin = pinString === CORRECT_PIN || (userRegisteredPin && pinString === userRegisteredPin);

        if (isValidPin) {
            // Success transition
            setTimeout(() => {
                closePinModal();
                if (targetDestination === 'scanner') {
                    showView(scannerView);
                } else if (targetDestination === 'wallet') {
                    showView(walletView);
                }
            }, 300);
        } else {
            // Error shake effect
            updatePinDots(true);
            if (pinCardContainer) {
                pinCardContainer.classList.add('shake');
            }
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
            setTimeout(() => {
                enteredPin = [];
                updatePinDots();
                if (pinCardContainer) {
                    pinCardContainer.classList.remove('shake');
                }
            }, 800);
        }
    }

    // Keypad Click Listeners
    keypadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const keyVal = btn.getAttribute('data-key');
            handleKeypadInput(keyVal);
        });
    });

    // Physical Keyboard Listener
    document.addEventListener('keydown', (e) => {
        if (!pinModalOverlay || !pinModalOverlay.classList.contains('active')) return;
        if (e.key >= '0' && e.key <= '9') {
            handleKeypadInput(e.key);
        } else if (e.key === 'Backspace') {
            handleKeypadInput('back');
        } else if (e.key === 'Escape') {
            closePinModal();
        }
    });

    // ==========================================
    // 3. WEBRTC CAMERA & QR SCANNER CONTROLLER
    // ==========================================
    async function startCamera() {
        if (!cameraVideo) return;
        try {
            const constraints = {
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            };
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraVideo.srcObject = mediaStream;
            await cameraVideo.play();
        } catch (err) {
            console.warn('Camera access unavailable or denied:', err);
            // Display graceful graphic fallback inside video container
        }
    }

    function stopCamera() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        isTorchOn = false;
    }

    if (btnToggleTorch) {
        btnToggleTorch.addEventListener('click', async () => {
            if (mediaStream) {
                const track = mediaStream.getVideoTracks()[0];
                if (track && track.getCapabilities && track.getCapabilities().torch) {
                    isTorchOn = !isTorchOn;
                    await track.applyConstraints({ advanced: [{ torch: isTorchOn }] });
                    btnToggleTorch.classList.toggle('active', isTorchOn);
                    return;
                }
            }
            alert('Flashlight toggle is supported on compatible mobile browser hardware.');
        });
    }

    if (btnSimulateScan) {
        btnSimulateScan.addEventListener('click', () => {
            const mockAmount = (Math.floor(Math.random() * 20) + 1) * 250;
            walletBalance -= mockAmount;
            updateBalanceUI();
            addTransactionItem('Pegas POS Quick Scan Purchase', -mockAmount, 'Success');

            alert(`✅ QR Scan Successful!\nPayment Authorized: LKR ${mockAmount.toLocaleString('en-US')}.00\nTransaction ID: TXN-${Math.floor(100000 + Math.random() * 900000)}`);
        });
    }

    // ==========================================
    // 4. BOC FLEX INSPIRED DIGITAL WALLET LOGIC
    // ==========================================
    function formatCurrency(val) {
        return `LKR ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function updateBalanceUI() {
        if (!balanceDisplay) return;
        if (isBalanceHidden) {
            balanceDisplay.innerHTML = '<span>LKR</span> ••••••••';
        } else {
            balanceDisplay.innerHTML = `<span>LKR</span> ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    if (btnToggleBalance) {
        btnToggleBalance.addEventListener('click', () => {
            isBalanceHidden = !isBalanceHidden;
            const eyeIcon = btnToggleBalance.querySelector('i');
            if (eyeIcon) {
                eyeIcon.className = isBalanceHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
            updateBalanceUI();
        });
    }

    // Quick Top-up Action
    if (btnQuickTopup) {
        btnQuickTopup.addEventListener('click', () => {
            const inputVal = prompt('Enter deposit amount in LKR:', '5000');
            const amount = parseFloat(inputVal);
            if (!isNaN(amount) && amount > 0) {
                walletBalance += amount;
                updateBalanceUI();
                addTransactionItem('FlutterHub Quick Deposit', amount, 'Completed');
                alert(`🎉 Deposit Successful!\nAdded ${formatCurrency(amount)} to your wallet balance.`);
            }
        });
    }

    // Quick Send Money Action
    if (btnQuickSend) {
        btnQuickSend.addEventListener('click', () => {
            const recipient = prompt('Enter recipient account/phone number:');
            if (!recipient) return;
            const inputVal = prompt('Enter amount to send in LKR:', '1000');
            const amount = parseFloat(inputVal);
            if (!isNaN(amount) && amount > 0 && amount <= walletBalance) {
                walletBalance -= amount;
                updateBalanceUI();
                addTransactionItem(`Fund Transfer to ${recipient}`, -amount, 'Completed');
                alert(`✅ Transfer Successful!\nSent ${formatCurrency(amount)} to ${recipient}.`);
            } else if (amount > walletBalance) {
                alert('⚠️ Insufficient wallet balance!');
            }
        });
    }

    function addTransactionItem(title, amount, status) {
        if (!txList) return;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const isCredit = amount > 0;
        const formattedAmt = `${isCredit ? '+' : ''}${formatCurrency(amount)}`;

        const itemHTML = `
            <div class="tx-item">
                <div class="tx-left">
                    <div class="tx-type-icon" style="color: ${isCredit ? '#10b981' : '#f43f5e'}">
                        <i class="fas ${isCredit ? 'fa-arrow-down' : 'fa-shopping-bag'}"></i>
                    </div>
                    <div class="tx-details">
                        <h4>${title}</h4>
                        <span>${dateStr} • <strong style="color:#00f2fe;">${status}</strong></span>
                    </div>
                </div>
                <div class="tx-amount ${isCredit ? 'credit' : 'debit'}">
                    ${formattedAmt}
                </div>
            </div>
        `;
        txList.insertAdjacentHTML('afterbegin', itemHTML);
    }

    // Default View Initialization
    showView(dashboardHomeView);
    updateBalanceUI();
});
