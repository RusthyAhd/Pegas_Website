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
        if (val === 'clear') { enteredPin = []; updateDots(); return; }
        if (val === 'back')  { enteredPin.pop(); updateDots(); return; }
        if (enteredPin.length < 4 && !isNaN(val)) {
            enteredPin.push(val);
            updateDots();
            if (enteredPin.length === 4) verifyPin();
        }
    }

    async function verifyPin() {
        const pin      = enteredPin.join('');
        const subtitle = document.getElementById('pin-modal-subtitle');
        if (subtitle) subtitle.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

        try {
            const snap = await getDocs(
                query(collection(db, 'users'), where('passcode', '==', pin))
            );

            if (!snap.empty) {
                const userDoc        = snap.docs[0];
                currentUser          = userDoc.data();
                currentDocId         = userDoc.id;
                walletBalance        = currentUser.balance || 0;

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
                    if (subtitle) subtitle.innerHTML = 'Enter your 4-digit PIN to unlock wallet';
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
        if (subtitle) subtitle.innerHTML = 'Enter your 4-digit PIN to unlock wallet';
        updateDots(true);
        pinContainer?.classList.add('shake');
        navigator.vibrate?.(200);
        setTimeout(() => {
            enteredPin = [];
            updateDots();
            pinContainer?.classList.remove('shake');
        }, 700);
    }

    // Keypad
    keyBtns.forEach(btn => {
        let lastTouch = 0;
        btn.addEventListener('touchend', e => {
            e.preventDefault();
            lastTouch = Date.now();
            handleKey(btn.dataset.key);
        }, { passive: false });
        btn.addEventListener('click', () => {
            if (Date.now() - lastTouch < 400) return;
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

        scanProcessed   = false;
        readerEl.innerHTML = '';
        if (qrStatusMsg) qrStatusMsg.textContent = 'Point camera at a shop QR code';

        try {
            html5Scanner = new Html5QrcodeScanner(
                'qr-reader',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    rememberLastUsedCamera: true,
                    showTorchButtonIfSupported: true,
                    showZoomSliderIfSupported: false,
                },
                /* verbose= */ false
            );

            html5Scanner.render(
                // ── SUCCESS ──
                async (decodedText) => {
                    if (scanProcessed) return;
                    scanProcessed = true;
                    if (qrStatusMsg) qrStatusMsg.textContent = '✅ QR scanned! Verifying shop...';
                    await stopScanner();
                    qrModal?.classList.remove('active');
                    await processQRScan(decodedText.trim());
                },
                // ── FRAME FAILURE (normal, ignore) ──
                () => {}
            );
        } catch (err) {
            console.error('Scanner init error:', err);
            showToast('⚠️ Could not start camera. Please allow camera access and try again.', 'error');
        }
    }

    async function stopScanner() {
        if (html5Scanner) {
            try { await html5Scanner.clear(); } catch (e) { /* ignore */ }
            html5Scanner = null;
        }
    }

    function openQR() {
        if (!qrModal) return;
        qrModal.classList.add('active');
        setTimeout(() => startScanner(), 300);   // wait for modal animation
    }

    async function closeQR() {
        qrModal?.classList.remove('active');
        await stopScanner();
    }

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
    /*  INIT                                                                */
    /* ------------------------------------------------------------------ */
    updateBalance();
});
