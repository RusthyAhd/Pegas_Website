/* ==========================================================================
   FLUTTERHUB WALLET - PREMIUM JAVASCRIPT CONTROLLER
   PIN Auth, Balance Management, QR Scanner, Transactions
   ========================================================================== */

import { db } from './firebase-config.js';
import {
    collection, query, where, getDocs,
    doc, getDoc, updateDoc, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------ */
    /*  STATE                                                               */
    /* ------------------------------------------------------------------ */
    let enteredPin      = [];
    let currentUser     = null;
    let currentDocId    = null;
    let walletBalance   = 0;
    let isBalanceHidden = false;

    // QR / payment state
    let html5Scanner       = null;
    let scanProcessed      = false;
    let currentPaymentShop = null;   // { id, name }

    /* ------------------------------------------------------------------ */
    /*  DOM REFS                                                            */
    /* ------------------------------------------------------------------ */

    // PIN
    const pinOverlay   = document.getElementById('pin-modal-overlay');
    const pinContainer = pinOverlay?.querySelector('.pin-container');
    const pinDots      = pinOverlay?.querySelectorAll('.pin-dot') ?? [];
    const pinClose     = document.getElementById('pin-modal-close');
    const keyBtns      = pinOverlay?.querySelectorAll('.key-btn') ?? [];
console.log('keyBtns count:', keyBtns.length);

    // Wallet
    const walletApp     = document.getElementById('wallet-app');
    const balanceAmount = document.getElementById('balance-amount');
    const btnToggleBal  = document.getElementById('btn-toggle-balance');
    const eyeIcon       = document.getElementById('eye-icon');
    const txList        = document.getElementById('tx-list');
    const dateDisplay   = document.getElementById('current-date');

    // QR Scanner modal
    const qrModal     = document.getElementById('qr-scanner-modal');
    const qrClose     = document.getElementById('qr-scanner-close');
    const btnScanQR   = document.getElementById('btn-scan-qr');
    const qrStatusMsg = document.getElementById('qr-status-msg');

    // Payment modal
    const paymentModal        = document.getElementById('payment-modal-overlay');
    const paymentClose        = document.getElementById('payment-close');
    const paymentShopLabel    = document.getElementById('payment-shop-name');
    const paymentAmountInput  = document.getElementById('payment-amount-input');
    const paymentErrorMsg     = document.getElementById('payment-error-msg');
    const btnConfirmPayment   = document.getElementById('btn-confirm-payment');

    // Receipt modal
    const receiptModal  = document.getElementById('receipt-modal-overlay');
    const btnReceiptOk  = document.getElementById('btn-receipt-ok');

    /* ------------------------------------------------------------------ */
    /*  HELPERS                                                             */
    /* ------------------------------------------------------------------ */

    // Format a number as currency
    function fmt(val) {
        return Number(val).toLocaleString('en-US', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        });
    }

    // Show a floating toast notification
    function showToast(message, type = 'error') {
        const el = document.createElement('div');
        const bg = type === 'success' ? '#28a745' : type === 'info' ? '#1a7cff' : '#dc3545';
        el.style.cssText = `
            position:fixed; top:20px; left:50%; transform:translateX(-50%);
            background:${bg}; color:#fff; padding:14px 24px;
            border-radius:10px; font-weight:600; font-size:14px;
            z-index:99999; box-shadow:0 6px 24px rgba(0,0,0,0.25);
            max-width:90vw; text-align:center; animation: fadeInUp 0.3s ease;
        `;
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }

    // Show inline error inside payment modal
    function showPaymentError(msg) {
        if (paymentErrorMsg) {
            paymentErrorMsg.textContent = msg;
            paymentErrorMsg.style.display = 'block';
        }
    }
    function clearPaymentError() {
        if (paymentErrorMsg) {
            paymentErrorMsg.textContent = '';
            paymentErrorMsg.style.display = 'none';
        }
    }

    // Set date
    if (dateDisplay) {
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    /* ------------------------------------------------------------------ */
    /*  1. PIN AUTHENTICATION                                               */
    /* ------------------------------------------------------------------ */

    function updateDots(isError) {
        pinDots.forEach((dot, i) => {
            dot.classList.remove('filled', 'error');
            if (isError) {
                dot.classList.add('error');
                dot.textContent = '✕';
            } else if (i < enteredPin.length) {
                dot.classList.add('filled');
                dot.textContent = '●';
            } else {
                dot.textContent = '';
            }
        });
    }

function handleKey(val) {
    const pinDisplay = document.getElementById('pin-entered');
    if (val === 'clear') {
        enteredPin = [];
        updateDots();
        if (pinDisplay) pinDisplay.textContent = '';
        return;
    }
    if (val === 'back') {
        enteredPin.pop();
        updateDots();
        if (pinDisplay) pinDisplay.textContent = enteredPin.join('');
        return;
    }
    if (enteredPin.length < 4 && !isNaN(val)) {
        enteredPin.push(val);
        updateDots();
        if (pinDisplay) pinDisplay.textContent = enteredPin.join('');
        if (enteredPin.length === 4) verifyPin();
    }
}

    async function verifyPin() {
        const pin      = enteredPin.join('');
        const username = (document.getElementById('pin-username-input')?.value ?? '').trim().toLowerCase();
        const subtitle = document.getElementById('pin-modal-subtitle');

        if (!username) {
            // Shake and show error without Firestore call
            if (subtitle) subtitle.innerHTML = '<span style="color:#f43f5e">Please enter your username first</span>';
            pinContainer?.classList.add('shake');
            navigator.vibrate?.(200);
            setTimeout(() => {
                enteredPin = [];
                updateDots();
                pinContainer?.classList.remove('shake');
                if (subtitle) subtitle.innerHTML = 'Enter your username &amp; 4-digit PIN';
            }, 700);
            return;
        }

        if (subtitle) subtitle.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

        try {
            // Query by username first, then verify passcode client-side
            const snap = await getDocs(
                query(collection(db, 'users'), where('username', '==', username))
            );

            const matched = snap.docs.find(d => d.data().passcode === pin);

            if (matched) {
                currentUser          = matched.data();
                currentDocId         = matched.id;
                walletBalance        = currentUser.balance || 0;

                // Save for other pages
                sessionStorage.setItem('currentDocId', currentDocId);
                sessionStorage.setItem('currentUserName', currentUser.fullName || 'Unknown User');

                const greetingName = document.querySelector('.greeting-name');
                if (greetingName && currentUser.fullName)
                    greetingName.textContent = currentUser.fullName;

                const cardHolder = document.querySelector('.card-holder-info span');
                if (cardHolder && currentUser.fullName)
                    cardHolder.textContent = currentUser.fullName.toUpperCase();

                updateBalance();
                fetchTransactions();

                setTimeout(() => {
                    pinOverlay?.classList.remove('active');
                    if (walletApp) walletApp.style.display = 'block';
                    enteredPin = [];
                    updateDots();
                    if (subtitle) subtitle.innerHTML = 'Enter your username &amp; 4-digit PIN';
                    const usernameInput = document.getElementById('pin-username-input');
                    if (usernameInput) usernameInput.value = '';
                }, 250);
            } else {
                handlePinError();
            }
        } catch (err) {
            console.error('PIN verify error:', err);
            handlePinError();
        }
    }

    function handlePinError() {
        const subtitle = document.getElementById('pin-modal-subtitle');
        if (subtitle) subtitle.innerHTML = '<span style="color:#f43f5e">Wrong username or passcode</span>';
        updateDots(true);
        pinContainer?.classList.add('shake');
        navigator.vibrate?.(200);
        setTimeout(() => {
            enteredPin = [];
            updateDots();
            pinContainer?.classList.remove('shake');
            if (subtitle) subtitle.innerHTML = 'Enter your username &amp; 4-digit PIN';
        }, 700);
    }

    // Keypad
    keyBtns.forEach(btn => {
        console.log('attaching listeners to button', btn.dataset.key);
        let lastTouch = 0;
        btn.addEventListener('touchend', e => {
            e.preventDefault();
            lastTouch = Date.now();
            console.log('touchend on', btn.dataset.key);
            handleKey(btn.dataset.key);
        }, { passive: false });
        btn.addEventListener('click', () => {
            if (Date.now() - lastTouch < 400) return;
            console.log('click on', btn.dataset.key);
            handleKey(btn.dataset.key);
        });
    });

    document.addEventListener('keydown', e => {
        if (!pinOverlay?.classList.contains('active')) return;
        if (e.key >= '0' && e.key <= '9') handleKey(e.key);
        else if (e.key === 'Backspace') handleKey('back');
        else if (e.key === 'Escape')    window.location.href = 'index.html';
    });

    pinClose?.addEventListener('click', () => window.location.href = 'index.html');

    /* ------------------------------------------------------------------ */
    /*  2. WALLET BALANCE & TRANSACTIONS                                    */
    /* ------------------------------------------------------------------ */

    function updateBalance() {
        if (!balanceAmount) return;
        balanceAmount.textContent = isBalanceHidden ? '•••••••' : fmt(walletBalance);
    }

    btnToggleBal?.addEventListener('click', () => {
        isBalanceHidden = !isBalanceHidden;
        if (eyeIcon) eyeIcon.className = isBalanceHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
        updateBalance();
    });

    async function fetchTransactions() {
        if (!txList || !currentDocId) return;
        txList.innerHTML = '<p style="text-align:center;color:#666;padding:20px;"><i class="fas fa-spinner fa-spin"></i> Loading...</p>';
        try {
            const snap = await getDocs(
                query(collection(db, 'transactions'), where('userId', '==', currentDocId))
            );

            const txs = [];
            snap.forEach(d => txs.push(d.data()));
            txs.sort((a, b) => b.timestamp - a.timestamp);

            if (txs.length === 0) {
                txList.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No transactions yet.</p>';
                return;
            }

            txList.innerHTML = '';
            txs.forEach(tx => {
                const date   = new Date(tx.timestamp).toLocaleString('en-US', {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
                const credit = tx.amount > 0;
                txList.insertAdjacentHTML('beforeend', `
                    <div class="tx-row" style="animation:fadeInUp 0.3s ease">
                        <div class="tx-icon ${credit ? 'tx-icon--credit' : 'tx-icon--debit'}">
                            <i class="fas ${credit ? 'fa-arrow-down' : 'fa-shopping-bag'}"></i>
                        </div>
                        <div class="tx-info">
                            <h4>${tx.shopName || tx.title || 'Transaction'}</h4>
                            <span>${date}</span>
                        </div>
                        <div class="tx-amount ${credit ? 'tx-credit' : 'tx-debit'}">
                            ${credit ? '+' : '-'}LKR ${fmt(Math.abs(tx.amount))}
                        </div>
                    </div>`);
            });
        } catch (e) {
            console.error('fetchTransactions error:', e);
            txList.innerHTML = '<p style="text-align:center;color:#dc3545;padding:20px;">Failed to load transactions.</p>';
        }
    }

    /* ------------------------------------------------------------------ */
    /*  3. QR SCANNER                                                       */
    /* ------------------------------------------------------------------ */

    function startScanner() {
        const readerEl = document.getElementById('qr-reader');
        if (!readerEl) return;

        scanProcessed = false;
        readerEl.innerHTML = '';
        if (qrStatusMsg) qrStatusMsg.textContent = 'Starting camera...';

        Html5Qrcode.getCameras()
            .then(cameras => {
                if (!cameras || cameras.length === 0) {
                    showToast('⚠️ No camera found on this device.', 'error');
                    return;
                }

                // Prefer back/rear camera on mobile
                const backCam = cameras.find(c => /back|rear|environment/i.test(c.label));
                const cam = backCam || cameras[cameras.length - 1];

                html5Scanner = new Html5Qrcode('qr-reader');

                html5Scanner.start(
                    cam.id,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    async (decodedText) => {
                        if (scanProcessed) return;
                        scanProcessed = true;
                        if (qrStatusMsg) qrStatusMsg.textContent = '✅ QR scanned! Verifying shop...';
                        await stopScanner();
                        qrModal?.classList.remove('active');
                        await processQRScan(decodedText.trim());
                    },
                    (errorMsg) => {
                        // scan errors are normal (frame-by-frame), ignore them
                    }
                ).then(() => {
                    if (qrStatusMsg) qrStatusMsg.textContent = 'Point camera at a shop QR code';
                }).catch(err => {
                    console.error('Camera start error:', err);
                    showToast('⚠️ Could not start camera. Please allow camera access.', 'error');
                });
            })
            .catch(err => {
                console.error('getCameras error:', err);
                showToast('⚠️ Could not access camera. Please check permissions.', 'error');
            });
    }

    async function stopScanner() {
        if (html5Scanner) {
            try {
                const state = html5Scanner.getState();
                // State 2 = SCANNING, state 3 = PAUSED
                if (state === 2 || state === 3) {
                    await html5Scanner.stop();
                }
                html5Scanner.clear();
            } catch (e) {
                console.warn('stopScanner:', e);
            }
            html5Scanner = null;
        }
    }

    /* ── Camera permission popup ──────────────────────────────────── */
    const camPermOverlay  = document.getElementById('cam-permission-overlay');
    const camPermAllow    = document.getElementById('cam-perm-allow');
    const camPermDeny     = document.getElementById('cam-perm-deny');
    const camPermRetry    = document.getElementById('cam-perm-retry');
    const camPermCancel   = document.getElementById('cam-perm-cancel');

    const camStateNormal  = document.getElementById('cam-perm-normal');
    const camStateDenied  = document.getElementById('cam-perm-denied');

    function setCamState(state) {
        camStateNormal.style.display = state === 'normal'  ? '' : 'none';
        camStateDenied.style.display = state === 'denied'  ? '' : 'none';
    }

    function showCamPermission() {
        setCamState('normal');
        camPermOverlay?.classList.add('active');
    }

    function hideCamPermission() {
        camPermOverlay?.classList.remove('active');
        setTimeout(() => setCamState('normal'), 400);
    }

    async function requestCamera() {
        // If already blocked at browser level → show guide immediately
        if (navigator.permissions) {
            let status;
            try { status = await navigator.permissions.query({ name: 'camera' }); } catch (_) {}
            if (status?.state === 'denied') { setCamState('denied'); return; }
            if (status?.state === 'granted') { hideCamPermission(); openQRScanner(); return; }
        }

        // state === 'prompt' → calling getUserMedia triggers the browser's OWN dialog
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } }
            });
            stream.getTracks().forEach(t => t.stop());
            hideCamPermission();
            openQRScanner();
        } catch (err) {
            // User tapped Block in the browser dialog
            setCamState('denied');
        }
    }

    function openQRScanner() {
        if (!qrModal) return;
        qrModal.classList.add('active');
        setTimeout(() => startScanner(), 300);
    }

    function openQR() {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'camera' }).then(status => {
                if (status.state === 'granted') {
                    openQRScanner();
                } else {
                    showCamPermission();
                }
            }).catch(() => showCamPermission());
        } else {
            showCamPermission();
        }
    }

    async function closeQR() {
        qrModal?.classList.remove('active');
        await stopScanner();
    }

    camPermAllow?.addEventListener('click',  requestCamera);
    camPermDeny?.addEventListener('click',   hideCamPermission);
    camPermRetry?.addEventListener('click',  requestCamera);
    camPermCancel?.addEventListener('click', hideCamPermission);

    btnScanQR?.addEventListener('click', openQR);
    qrClose?.addEventListener('click',   closeQR);
    qrModal?.addEventListener('click',   e => { if (e.target === qrModal) closeQR(); });


    /* ------------------------------------------------------------------ */
    /*  4. PAYMENT FLOW                                                     */
    /* ------------------------------------------------------------------ */

    async function processQRScan(scannedId) {
        if (!scannedId) {
            showToast('❌ Invalid QR code scanned.', 'error');
            return;
        }

        showToast('🔍 Looking up shop...', 'info');

        try {
            const shopSnap = await getDoc(doc(db, 'shops', scannedId));

            if (!shopSnap.exists()) {
                showToast('❌ This QR code is not linked to any registered shop.', 'error');
                return;
            }

            const shopData = shopSnap.data();
            currentPaymentShop = { id: scannedId, name: shopData.name || scannedId };

            // Populate & open payment modal
            if (paymentShopLabel)
                paymentShopLabel.textContent = `Paying to: ${currentPaymentShop.name}`;
            if (paymentAmountInput) {
                paymentAmountInput.value = '';
                paymentAmountInput.focus();
            }
            clearPaymentError();
            paymentModal?.classList.add('active');

        } catch (e) {
            console.error('processQRScan error:', e);
            showToast('❌ Error looking up shop. Check your connection and try again.', 'error');
        }
    }

    // Close payment modal — reset shop state
    paymentClose?.addEventListener('click', () => {
        paymentModal?.classList.remove('active');
        currentPaymentShop = null;
        clearPaymentError();
    });

    // Confirm payment
    btnConfirmPayment?.addEventListener('click', async () => {
        clearPaymentError();

        if (!currentDocId) {
            showPaymentError('Session expired. Please log in again.');
            return;
        }
        if (!currentPaymentShop) {
            showPaymentError('No shop selected. Please scan a QR code.');
            return;
        }

        const raw    = paymentAmountInput?.value ?? '';
        const amount = parseFloat(raw);

        if (!raw || isNaN(amount) || amount <= 0) {
            showPaymentError('Please enter a valid amount greater than 0.');
            return;
        }
        if (amount > walletBalance) {
            showPaymentError(`Insufficient balance. Your wallet has LKR ${fmt(walletBalance)}.`);
            return;
        }

        // ── Processing ──
        btnConfirmPayment.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btnConfirmPayment.disabled   = true;

        try {
            const newBalance = walletBalance - amount;
            await updateDoc(doc(db, 'users', currentDocId), { balance: newBalance });
            walletBalance = newBalance;
            updateBalance();

            const txnId = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
            const now   = Date.now();

            await addDoc(collection(db, 'transactions'), {
                userId:    currentDocId,
                userName:  currentUser?.fullName || 'Unknown User',
                shopId:    currentPaymentShop.id,
                shopName:  currentPaymentShop.name,
                amount:    -amount,
                timestamp: now,
                txnId:     txnId,
                type:      'payment'
            });

            // Close payment modal
            paymentModal?.classList.remove('active');

            // Populate receipt
            document.getElementById('receipt-shop-name').textContent = currentPaymentShop.name;
            document.getElementById('receipt-amount').textContent     = `LKR ${fmt(amount)}`;
            document.getElementById('receipt-txn-id').textContent     = txnId;
            document.getElementById('receipt-date').textContent       =
                new Date(now).toLocaleString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

            receiptModal?.classList.add('active');
            fetchTransactions();

        } catch (err) {
            console.error('Payment error:', err);
            showPaymentError('Payment failed. Please check your connection and try again.');
        } finally {
            btnConfirmPayment.innerHTML = 'Pay Now';
            btnConfirmPayment.disabled  = false;
            currentPaymentShop = null;
        }
    });

    // Close receipt
    btnReceiptOk?.addEventListener('click', () => {
        receiptModal?.classList.remove('active');
    });

    /* ------------------------------------------------------------------ */
    /*  BOTTOM NAV LOGIC                                                    */
    /* ------------------------------------------------------------------ */
    const navInStore = document.getElementById('nav-in-store');

    navInStore?.addEventListener('click', () => {
        openQR();
    });

    /* ------------------------------------------------------------------ */
    /*  INIT                                                                */
    /* ------------------------------------------------------------------ */
    updateBalance();
});
