import { db } from './firebase-config.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const productModal = document.getElementById('product-modal');
    const productClose = document.getElementById('product-close');
    const btnOrder = document.getElementById('btn-order');
    const successModal = document.getElementById('success-modal');
    const btnSuccessOk = document.getElementById('btn-success-ok');

    const pmImg = document.getElementById('pm-img');
    const pmName = document.getElementById('pm-name');
    const pmDesc = document.getElementById('pm-desc');
    const pmPrice = document.getElementById('pm-price');

    let currentProduct = null;

    // Helper to format price
    const fmt = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Load Products
    async function loadProducts() {
        try {
            const snap = await getDocs(collection(db, 'products'));
            if (snap.empty) {
                productsList.innerHTML = '<p style="text-align:center;grid-column: 1 / -1;">No products found.</p>';
                return;
            }
            productsList.innerHTML = '';
            snap.forEach(doc => {
                const data = doc.data();
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${data.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" class="product-img" alt="${data.name}">
                    <div class="product-info">
                        <div class="product-name">${data.name}</div>
                        <div class="product-price">LKR ${fmt(data.price || 0)}</div>
                    </div>
                `;
                card.addEventListener('click', () => openProductModal(doc.id, data));
                productsList.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading products:', error);
            productsList.innerHTML = '<p style="text-align:center;color:#dc3545;grid-column: 1 / -1;">Failed to load products.</p>';
        }
    }

    function openProductModal(id, data) {
        currentProduct = { id, ...data };
        pmImg.src = data.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
        pmName.textContent = data.name;
        pmDesc.textContent = data.description || 'No description available.';
        pmPrice.textContent = `LKR ${fmt(data.price || 0)}`;
        productModal.classList.add('active');
    }

    productClose.addEventListener('click', () => {
        productModal.classList.remove('active');
        currentProduct = null;
    });

    btnSuccessOk.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    btnOrder.addEventListener('click', async () => {
        if (!currentProduct) return;
        
        btnOrder.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btnOrder.disabled = true;

        try {
            // Check for user ID from localStorage or session
            const userId = localStorage.getItem('currentDocId') || sessionStorage.getItem('currentDocId') || 'guest_user';
            const userName = localStorage.getItem('currentUserName') || sessionStorage.getItem('currentUserName') || 'Guest User';

            await addDoc(collection(db, 'orders'), {
                productId: currentProduct.id,
                productName: currentProduct.name,
                price: currentProduct.price,
                userId: userId,
                userName: userName,
                timestamp: new Date().toISOString()
            });

            productModal.classList.remove('active');
            successModal.classList.add('active');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            btnOrder.innerHTML = 'Order Now';
            btnOrder.disabled = false;
        }
    });

    loadProducts();
});
