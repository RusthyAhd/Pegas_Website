/* ==========================================================================
   FLUTTERHUB WALLET - PREMIUM JAVASCRIPT CONTROLLER
   PIN Auth, Balance Management, QR Scanner, Transactions
   ========================================================================== */

import { db } from './firebase-config.js';
import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    // ── State ──
    let enteredPin = [];
    let currentUser = null;
    let currentDocId = null;
    let walletBalance = 0;
    let isBalanceHidden = false;
    let mediaStream = null;
    let isTorchOn = false;

    // ── DOM: PIN Modal ──
    const pinOverlay    = document.getElementById('pin-modal-overlay');
    const pinContainer  = pinOverlay ? pinOverlay.querySelector('.pin-container') : null;
    const pinDots       = pinOverlay ? pinOverlay.querySelectorAll('.pin-dot') : [];
    const pinClose      = document.getElementById('pin-modal-close');
    const keyBtns       = pinOverlay ? pinOverlay.querySelectorAll('.key-btn') : [];

    // ── DOM: Wallet ──
    const walletApp     = document.getElementById('wallet-app');
    const balanceAmount = document.getElementById('balance-amount');
    const btnToggleBal  = document.getElementById('btn-toggle-balance');
    const eyeIcon       = document.getElementById('eye-icon');
    const txList        = document.getElementById('tx-list');
    const btnTopup      = document.getElementById('btn-quick-topup');
    const btnSend       = document.getElementById('btn-quick-send');
    const dateDisplay   = document.getElementById('current-date');

    // ── DOM: QR Scanner ──
    const qrModal       = document.getElementById('qr-scanner-modal');
    const qrClose       = document.getElementById('qr-scanner-close');
    const btnScanQR     = document.getElementById('btn-scan-qr');
    const cameraVideo   = document.getElementById('camera-video');
    const btnTorch      = document.getElementById('btn-toggle-torch');
    const btnMockScan   = document.getElementById('btn-simulate-scan');

    // ── Set Date ──
    if (dateDisplay) {
        const now = new Date();
        dateDisplay.textContent = now.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        });
    }


    /* ================================================================
       1. PIN AUTHENTICATION
       ================================================================ */

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
        if (val === 'clear') { enteredPin = []; updateDots(); return; }
        if (val === 'back')  { enteredPin.pop(); updateDots(); return; }

        if (enteredPin.length < 4 && !isNaN(val)) {
            enteredPin.push(val);
            updateDots();
            if (enteredPin.length === 4) verifyPin();
        }
    }

    async function verifyPin() {
        const pin = enteredPin.join('');
        const subtitle = document.getElementById('pin-modal-subtitle');
        if (subtitle) {
            subtitle.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        }
        
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("passcode", "==", pin));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Found user
                const userDoc = querySnapshot.docs[0];
                currentUser = userDoc.data();
                currentDocId = userDoc.id;
                walletBalance = currentUser.balance || 0;
                
                const greetingName = document.querySelector('.greeting-name');
                if (greetingName && currentUser.fullName) {
                    greetingName.textContent = currentUser.fullName;
                }
                const cardHolder = document.querySelector('.card-holder-info span');
                if (cardHolder && currentUser.fullName) {
                    cardHolder.textContent = currentUser.fullName.toUpperCase();
                }
                updateBalance();

                setTimeout(() => {
                    if (pinOverlay) pinOverlay.classList.remove('active');
                    if (walletApp)  walletApp.style.display = 'block';
                    enteredPin = [];
                    updateDots();
                    if (subtitle) subtitle.innerHTML = 'Enter your 4-digit PIN to unlock wallet';
                }, 250);
            } else {
                handlePinError();
            }
        } catch (err) {
            console.error("Error verifying pin:", err);
            handlePinError();
        }
    }
    
    function handlePinError() {
        const subtitle = document.getElementById('pin-modal-subtitle');
        if (subtitle) {
            subtitle.innerHTML = 'Enter your 4-digit PIN to unlock wallet';
        }
        
        updateDots(true);
        if (pinContainer) pinContainer.classList.add('shake');
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => {
            enteredPin = [];
            updateDots();
            if (pinContainer) pinContainer.classList.remove('shake');
        }, 700);
    }

    // Keypad listeners (Click + Touch for iOS iPhone)
    keyBtns.forEach(btn => {
        let lastTouchTime = 0;
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            lastTouchTime = Date.now();
            handleKey(btn.dataset.key);
        }, { passive: false });

        btn.addEventListener('click', (e) => {
            if (Date.now() - lastTouchTime < 400) return; // Prevent ghost click after touchend on iOS
            handleKey(btn.dataset.key);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', e => {
        if (!pinOverlay || !pinOverlay.classList.contains('active')) return;
        if (e.key >= '0' && e.key <= '9') handleKey(e.key);
        else if (e.key === 'Backspace') handleKey('back');
        else if (e.key === 'Escape') window.location.href = 'index.html';
    });

    // Close → go home
    if (pinClose) {
        pinClose.addEventListener('click', () => window.location.href = 'index.html');
    }


    /* ================================================================
       2. WALLET BALANCE
       ================================================================ */

    function fmt(val) {
        return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateBalance() {
        if (!balanceAmount) return;
        balanceAmount.textContent = isBalanceHidden ? '•••••••' : fmt(walletBalance);
    }

    if (btnToggleBal) {
        btnToggleBal.addEventListener('click', () => {
            isBalanceHidden = !isBalanceHidden;
            if (eyeIcon) eyeIcon.className = isBalanceHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
            updateBalance();
        });
    }

    // Top Up
    if (btnTopup) {
        btnTopup.addEventListener('click', async () => {
            const input = prompt('Enter deposit amount in LKR:', '5000');
            const amount = parseFloat(input);
            if (!isNaN(amount) && amount > 0 && currentDocId) {
                try {
                    const newBalance = walletBalance + amount;
                    await updateDoc(doc(db, "users", currentDocId), { balance: newBalance });
                    walletBalance = newBalance;
                    updateBalance();
                    addTx('FlutterHub Quick Deposit', amount);
                    alert(`🎉 Deposit Successful!\nAdded LKR ${fmt(amount)} to your wallet.`);
                } catch (e) {
                    console.error("Topup error:", e);
                    alert("Error updating balance. Please try again.");
                }
            }
        });
    }

    // Send Money
    if (btnSend) {
        btnSend.addEventListener('click', async () => {
            const to = prompt('Enter recipient account/phone:');
            if (!to) return;
            const input = prompt('Enter amount in LKR:', '1000');
            const amount = parseFloat(input);
            if (!isNaN(amount) && amount > 0 && amount <= walletBalance && currentDocId) {
                try {
                    const newBalance = walletBalance - amount;
                    await updateDoc(doc(db, "users", currentDocId), { balance: newBalance });
                    walletBalance = newBalance;
                    updateBalance();
                    addTx(`Transfer to ${to}`, -amount);
                    alert(`✅ Sent LKR ${fmt(amount)} to ${to}`);
                } catch (e) {
                    console.error("Send error:", e);
                    alert("Error updating balance. Please try again.");
                }
            } else if (amount > walletBalance) {
                alert('⚠️ Insufficient balance!');
            }
        });
    }

    function addTx(title, amount) {
        if (!txList) return;
        const now = new Date();
        const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const credit = amount > 0;
        const html = `
            <div class="tx-row" style="animation: fadeInUp 0.3s ease;">
                <div class="tx-icon ${credit ? 'tx-icon--credit' : 'tx-icon--debit'}">
                    <i class="fas ${credit ? 'fa-arrow-down' : 'fa-shopping-bag'}"></i>
                </div>
                <div class="tx-info">
                    <h4>${title}</h4>
                    <span>${date}</span>
                </div>
                <div class="tx-amount ${credit ? 'tx-credit' : 'tx-debit'}">
                    ${credit ? '+' : ''}LKR ${fmt(amount)}
                </div>
            </div>`;
        txList.insertAdjacentHTML('afterbegin', html);
    }


    /* ================================================================
       3. QR SCANNER MODAL
       ================================================================ */

    async function startCam() {
        if (!cameraVideo) return;
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            cameraVideo.srcObject = mediaStream;
            await cameraVideo.play();
        } catch (e) {
            console.warn('Camera unavailable:', e);
        }
    }

    function stopCam() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(t => t.stop());
            mediaStream = null;
        }
        isTorchOn = false;
    }

    function openQR()  { if (qrModal) { qrModal.classList.add('active'); startCam(); } }
    function closeQR() { if (qrModal) { qrModal.classList.remove('active'); stopCam(); } }

    if (btnScanQR)  btnScanQR.addEventListener('click', openQR);
    if (qrClose)    qrClose.addEventListener('click', closeQR);
    if (qrModal)    qrModal.addEventListener('click', e => { if (e.target === qrModal) closeQR(); });

    if (btnTorch) {
        btnTorch.addEventListener('click', async () => {
            if (mediaStream) {
                const track = mediaStream.getVideoTracks()[0];
                if (track?.getCapabilities?.().torch) {
                    isTorchOn = !isTorchOn;
                    await track.applyConstraints({ advanced: [{ torch: isTorchOn }] });
                    return;
                }
            }
            alert('Flash supported on compatible mobile devices only.');
        });
    }

    if (btnMockScan) {
        btnMockScan.addEventListener('click', async () => {
            const mockAmt = (Math.floor(Math.random() * 20) + 1) * 250;
            if (walletBalance >= mockAmt && currentDocId) {
                try {
                    const newBalance = walletBalance - mockAmt;
                    await updateDoc(doc(db, "users", currentDocId), { balance: newBalance });
                    walletBalance = newBalance;
                    updateBalance();
                    addTx('POS Scan Purchase', -mockAmt);
                    alert(`✅ QR Scan Success!\nPaid: LKR ${fmt(mockAmt)}\nTXN-${Math.floor(100000 + Math.random() * 900000)}`);
                    closeQR();
                } catch (e) {
                    console.error("Scan error:", e);
                    alert("Error processing payment.");
                }
            } else {
                alert('⚠️ Insufficient balance for this purchase!');
                closeQR();
            }
        });
    }

    // ── Init ──
    updateBalance();
});
