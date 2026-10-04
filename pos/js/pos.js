/**
 * Pegas (Pvt) Ltd - Point of Sale (POS) System Engine
 * Address: Kinniya, Trincomalee, Sri Lanka
 * Features:
 * - Invoice Generation with Customer & Product Selector
 * - Automatic Stock Deduction & Credit Balance Updating
 * - Add/Edit/Delete Customers (Name, Address, Phone, Total Credit)
 * - Add/Edit/Delete Products (Product Name, Stock Qty, Price)
 * - Printable Thermal Receipt View
 * - Send via WhatsApp Integration
 * - Send via Web Bluetooth Thermal Printer Integration
 */

// Global State
const POSState = {
  customers: [],
  products: [],
  cart: [],
  selectedCustomerId: '',
  paymentMethod: 'cash', // 'cash' or 'credit'
  editingCustomerId: null,
  editingProductId: null,
  lastInvoice: null
};

// Initial Seed Data
const DEFAULT_CUSTOMERS = [
  {
    id: 'cust_1',
    name: 'Mohamed Rizwan',
    address: 'Main Street, Kinniya',
    phone: '0771234567',
    credit: 1500.00
  },
  {
    id: 'cust_2',
    name: 'Trinco Traders Ltd',
    address: 'Central Market, Trincomalee',
    phone: '0759876543',
    credit: 4200.00
  },
  {
    id: 'cust_3',
    name: 'Walk-in Customer',
    address: 'Kinniya, Trincomalee',
    phone: '0700000000',
    credit: 0.00
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Bottle Juice (350ml)',
    stock: 50,
    price: 180.00
  },
  {
    id: 'prod_2',
    name: 'Cup Juice (250ml)',
    stock: 120,
    price: 80.00
  },
  {
    id: 'prod_3',
    name: 'Carbonated Soda (500ml)',
    stock: 65,
    price: 150.00
  },
  {
    id: 'prod_4',
    name: 'SalesRep Mobile App License',
    stock: 999,
    price: 2500.00
  },
  {
    id: 'prod_5',
    name: 'Vending Machine Controller Box',
    stock: 15,
    price: 18500.00
  }
];

// Load & Initialize Storage
function initStorage() {
  const savedCustomers = localStorage.getItem('pegas_pos_customers');
  if (savedCustomers) {
    try { POSState.customers = JSON.parse(savedCustomers); }
    catch(e) { POSState.customers = DEFAULT_CUSTOMERS; }
  } else {
    POSState.customers = DEFAULT_CUSTOMERS;
    saveCustomers();
  }

  const savedProducts = localStorage.getItem('pegas_pos_products');
  if (savedProducts) {
    try { POSState.products = JSON.parse(savedProducts); }
    catch(e) { POSState.products = DEFAULT_PRODUCTS; }
  } else {
    POSState.products = DEFAULT_PRODUCTS;
    saveProducts();
  }
}

function saveCustomers() {
  localStorage.setItem('pegas_pos_customers', JSON.stringify(POSState.customers));
}

function saveProducts() {
  localStorage.setItem('pegas_pos_products', JSON.stringify(POSState.products));
}

// DOM Loading Ready Event
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  setupNavigation();
  renderCustomerSelect();
  renderProductsGrid();
  renderCart();
  renderCustomersTable();
  renderProductsTable();
  setupFormListeners();
  setupTheme();
});

// Setup Tab Navigation
function setupNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });
}

// Setup Theme Toggle
function setupTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;
  
  const savedTheme = localStorage.getItem('pegas_pos_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('pegas_pos_theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn i');
  const text = document.querySelector('#themeToggleBtn span');
  if (icon && text) {
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
      text.textContent = 'Dark';
    } else {
      icon.className = 'fas fa-sun';
      text.textContent = 'Light';
    }
  }
}

// ==========================================
// TAB 1: POS / INVOICE GENERATOR LOGIC
// ==========================================

function renderCustomerSelect() {
  const selectEl = document.getElementById('customerSelect');
  if (!selectEl) return;

  selectEl.innerHTML = '<option value="">-- Select Customer --</option>';
  POSState.customers.forEach(cust => {
    const opt = document.createElement('option');
    opt.value = cust.id;
    opt.textContent = `${cust.name} (${cust.phone}) - Credit: LKR ${cust.credit.toFixed(2)}`;
    selectEl.appendChild(opt);
  });

  if (POSState.selectedCustomerId) {
    selectEl.value = POSState.selectedCustomerId;
  } else if (POSState.customers.length > 0) {
    // Select first customer by default
    POSState.selectedCustomerId = POSState.customers[0].id;
    selectEl.value = POSState.selectedCustomerId;
  }

  selectEl.addEventListener('change', (e) => {
    POSState.selectedCustomerId = e.target.value;
    updateCustomerChip();
    renderCart();
  });

  updateCustomerChip();
}

function updateCustomerChip() {
  const chipContainer = document.getElementById('selectedCustomerChip');
  if (!chipContainer) return;

  const cust = POSState.customers.find(c => c.id === POSState.selectedCustomerId);
  if (!cust) {
    chipContainer.style.display = 'none';
    return;
  }

  chipContainer.style.display = 'flex';
  chipContainer.innerHTML = `
    <div class="customer-chip-info">
      <div class="customer-avatar">${cust.name.charAt(0).toUpperCase()}</div>
      <div>
        <div style="font-weight:700;">${cust.name}</div>
        <div style="font-size:0.78rem; color:var(--text-muted);"><i class="fas fa-phone"></i> ${cust.phone} | <i class="fas fa-map-marker-alt"></i> ${cust.address}</div>
      </div>
    </div>
    <div class="customer-credit-tag">
      Prev. Credit: LKR ${cust.credit.toFixed(2)}
    </div>
  `;
}

function renderProductsGrid(filterQuery = '') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const query = filterQuery.toLowerCase().trim();

  const filtered = POSState.products.filter(p => p.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
        <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
        <p>No products found matching "${filterQuery}"</p>
      </div>
    `;
    return;
  }

  filtered.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';

    let stockStatusClass = 'in-stock';
    let stockStatusText = `In Stock (${prod.stock})`;
    if (prod.stock <= 0) {
      stockStatusClass = 'out-stock';
      stockStatusText = 'Out of Stock';
    } else if (prod.stock <= 5) {
      stockStatusClass = 'low-stock';
      stockStatusText = `Low Stock (${prod.stock})`;
    }

    card.innerHTML = `
      <div class="product-card-top">
        <h4 class="product-name">${prod.name}</h4>
        <span class="stock-badge ${stockStatusClass}">${stockStatusText}</span>
      </div>
      <div class="product-card-bottom">
        <span class="product-price">LKR ${prod.price.toFixed(2)}</span>
        <button class="add-item-btn" title="Add to Invoice" ${prod.stock <= 0 ? 'disabled style="opacity:0.4;"' : ''}>
          <i class="fas fa-plus"></i>
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      if (prod.stock > 0) {
        addToCart(prod.id);
      } else {
        showToast(`"${prod.name}" is out of stock!`, 'warning');
      }
    });

    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const prod = POSState.products.find(p => p.id === productId);
  if (!prod) return;

  const existing = POSState.cart.find(item => item.productId === productId);
  if (existing) {
    if (existing.qty + 1 > prod.stock) {
      showToast(`Cannot add more. Stock limit (${prod.stock}) reached for ${prod.name}!`, 'warning');
      return;
    }
    existing.qty += 1;
  } else {
    POSState.cart.push({
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      qty: 1
    });
  }

  renderCart();
  showToast(`Added ${prod.name} to invoice`, 'success');
}

function updateCartQty(productId, newQty) {
  const prod = POSState.products.find(p => p.id === productId);
  const itemIndex = POSState.cart.findIndex(i => i.productId === productId);
  if (itemIndex === -1) return;

  if (newQty <= 0) {
    POSState.cart.splice(itemIndex, 1);
  } else {
    if (prod && newQty > prod.stock) {
      showToast(`Stock limit (${prod.stock}) reached for ${prod.name}!`, 'warning');
      return;
    }
    POSState.cart[itemIndex].qty = newQty;
  }
  renderCart();
}

function removeFromCart(productId) {
  POSState.cart = POSState.cart.filter(i => i.productId !== productId);
  renderCart();
}

function clearCart() {
  POSState.cart = [];
  renderCart();
}

function setPaymentMethod(method) {
  POSState.paymentMethod = method;
  document.querySelectorAll('.pay-radio-btn').forEach(btn => {
    if (btn.getAttribute('data-pay') === method) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cartItemsList');
  const generateBtn = document.getElementById('generateInvoiceBtn');
  if (!cartList) return;

  if (POSState.cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart-state">
        <i class="fas fa-shopping-cart"></i>
        <p>No items added to invoice yet</p>
        <span style="font-size: 0.8rem;">Click on items in the catalog to add them</span>
      </div>
    `;
    if (generateBtn) generateBtn.disabled = true;
    updateCartSummary(0);
    return;
  }

  if (generateBtn) generateBtn.disabled = false;
  cartList.innerHTML = '';

  let totalAmount = 0;

  POSState.cart.forEach(item => {
    const itemSubtotal = item.price * item.qty;
    totalAmount += itemSubtotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-row-1">
        <span class="cart-item-title">${item.name}</span>
        <button class="cart-item-remove" onclick="removeFromCart('${item.productId}')" title="Remove item">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
      <div class="cart-item-row-2">
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateCartQty('${item.productId}', ${item.qty - 1})">-</button>
          <input type="number" class="qty-val" value="${item.qty}" min="1" onchange="updateCartQty('${item.productId}', parseInt(this.value) || 1)">
          <button class="qty-btn" onclick="updateCartQty('${item.productId}', ${item.qty + 1})">+</button>
        </div>
        <div class="cart-item-total">LKR ${itemSubtotal.toFixed(2)}</div>
      </div>
    `;
    cartList.appendChild(itemEl);
  });

  updateCartSummary(totalAmount);
}

function updateCartSummary(currentTotal) {
  const subtotalEl = document.getElementById('summarySubtotal');
  const grandTotalEl = document.getElementById('summaryGrandTotal');
  const prevCreditEl = document.getElementById('summaryPrevCredit');
  const newCreditEl = document.getElementById('summaryNewTotalCredit');
  
  if (subtotalEl) subtotalEl.textContent = `LKR ${currentTotal.toFixed(2)}`;
  if (grandTotalEl) grandTotalEl.textContent = `LKR ${currentTotal.toFixed(2)}`;

  const cust = POSState.customers.find(c => c.id === POSState.selectedCustomerId);
  const prevCredit = cust ? cust.credit : 0;
  
  if (prevCreditEl) prevCreditEl.textContent = `LKR ${prevCredit.toFixed(2)}`;

  let totalCreditAmount = prevCredit;
  if (POSState.paymentMethod === 'credit') {
    totalCreditAmount += currentTotal;
  }

  if (newCreditEl) newCreditEl.textContent = `LKR ${totalCreditAmount.toFixed(2)}`;
}

// Generate Invoice Checkout Handler
function checkoutInvoice() {
  if (POSState.cart.length === 0) {
    showToast('Cannot generate invoice with empty cart!', 'error');
    return;
  }

  const customer = POSState.customers.find(c => c.id === POSState.selectedCustomerId);
  if (!customer) {
    showToast('Please select a customer first!', 'warning');
    return;
  }

  // Calculate Totals
  const currentTotal = POSState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const prevCredit = customer.credit;
  
  let newCreditAmount = prevCredit;
  if (POSState.paymentMethod === 'credit') {
    newCreditAmount += currentTotal;
  }

  // Deduct product stock & update storage
  POSState.cart.forEach(item => {
    const prod = POSState.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.qty);
    }
  });
  saveProducts();

  // Update Customer Credit in Storage
  customer.credit = newCreditAmount;
  saveCustomers();

  // Create Invoice Record
  const now = new Date();
  const invoiceId = 'PEG-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + String(Math.floor(100 + Math.random() * 900));

  POSState.lastInvoice = {
    invoiceNo: invoiceId,
    dateTime: now.toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' }),
    customerName: customer.name,
    customerPhone: customer.phone,
    customerAddress: customer.address,
    items: [...POSState.cart],
    totalAmount: currentTotal,
    previousCredit: prevCredit,
    totalCreditAmount: newCreditAmount,
    paymentMethod: POSState.paymentMethod
  };

  // Re-render interfaces
  renderCustomerSelect();
  renderProductsGrid();
  renderCustomersTable();
  renderProductsTable();

  // Open Invoice Printable Modal
  openInvoiceModal();
  
  // Reset cart
  clearCart();
  showToast(`Invoice ${invoiceId} generated successfully!`, 'success');
}

// ==========================================
// INVOICE PRINT VIEW & SHARING MODAL
// ==========================================

function openInvoiceModal() {
  const inv = POSState.lastInvoice;
  if (!inv) return;

  const modal = document.getElementById('invoiceModal');
  const printBody = document.getElementById('invoicePrintContent');

  if (!modal || !printBody) return;

  let itemsRowsHTML = '';
  inv.items.forEach((item, index) => {
    const sub = item.price * item.qty;
    itemsRowsHTML += `
      <tr>
        <td>${index + 1}. ${item.name}</td>
        <td class="num-col">${item.qty}</td>
        <td class="num-col">${item.price.toFixed(2)}</td>
        <td class="num-col">${sub.toFixed(2)}</td>
      </tr>
    `;
  });

  printBody.innerHTML = `
    <div class="invoice-print-card">
      <div class="invoice-company-header">
        <div class="company-title">Pegas (Pvt) Ltd</div>
        <div class="company-address">Kinniya, Trincomalee, Sri Lanka</div>
        <div class="company-contact">Hotline: +94 75 507 7070 | Web: pegas.lk</div>
      </div>

      <div class="invoice-meta-row">
        <span><strong>Inv No:</strong> ${inv.invoiceNo}</span>
        <span><strong>Date:</strong> ${inv.dateTime}</span>
      </div>

      <div class="invoice-customer-info">
        <div class="customer-info-line">
          <span>Customer:</span>
          <strong>${inv.customerName}</strong>
        </div>
        <div class="customer-info-line">
          <span>Phone:</span>
          <strong>${inv.customerPhone}</strong>
        </div>
        <div class="customer-info-line">
          <span>Payment:</span>
          <span style="font-weight:700; text-transform:uppercase;">${inv.paymentMethod === 'credit' ? 'CREDIT BILL' : 'CASH PAID'}</span>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Item Details</th>
            <th class="num-col">Qty</th>
            <th class="num-col">Price</th>
            <th class="num-col">Total (LKR)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHTML}
        </tbody>
      </table>

      <div class="invoice-totals-section">
        <div class="total-row grand-total">
          <span>TOTAL AMOUNT:</span>
          <span>LKR ${inv.totalAmount.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Previous Credit Amount:</span>
          <span>LKR ${inv.previousCredit.toFixed(2)}</span>
        </div>
        <div class="credit-highlight-box">
          <div class="total-row">
            <span>TOTAL CREDIT AMOUNT:</span>
            <span>LKR ${inv.totalCreditAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="invoice-footer-note">
        <p>Thank you for choosing <strong>Pegas (Pvt) Ltd</strong>!</p>
        <p>Software Solutions & Distribution Network</p>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeInvoiceModal() {
  const modal = document.getElementById('invoiceModal');
  if (modal) modal.classList.remove('active');
}

// Direct High-Precision Vector PDF Generator
function createPDFInvoiceDoc(inv) {
  const JSClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if (!JSClass) return null;

  const doc = new JSClass({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  let y = 18;

  // Header Box / Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // #0f172a
  doc.text('PEGAS (PVT) LTD', pageWidth / 2, y, { align: 'center' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // #334155
  doc.text('Kinniya, Trincomalee, Sri Lanka', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // #64748b
  doc.text('Hotline: +94 75 507 7070  |  Web: pegas.lk', pageWidth / 2, y, { align: 'center' });

  // Dashed Line Separator
  y += 6;
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225); // #cbd5e1
  if (doc.setLineDashPattern) doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(margin, y, pageWidth - margin, y);
  if (doc.setLineDashPattern) doc.setLineDashPattern([], 0); // reset line pattern

  // Meta Row: Inv No & Date
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Inv No: ${inv.invoiceNo}`, margin, y);
  doc.text(`Date: ${inv.dateTime}`, pageWidth - margin, y, { align: 'right' });

  // Customer Info Box
  y += 5;
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 2, 2, 'FD');

  let custY = y + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Customer:', margin + 4, custY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${inv.customerName}`, pageWidth - margin - 4, custY, { align: 'right' });

  custY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Phone:', margin + 4, custY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${inv.customerPhone}`, pageWidth - margin - 4, custY, { align: 'right' });

  custY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Payment Terms:', margin + 4, custY);
  doc.setFont('helvetica', 'bold');
  const payText = inv.paymentMethod === 'credit' ? 'CREDIT BILL' : 'CASH PAID';
  doc.text(payText, pageWidth - margin - 4, custY, { align: 'right' });

  y += 28;

  // Table Header
  doc.setFillColor(30, 41, 59); // #1e293b dark header
  doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('ITEM DETAILS', margin + 4, y + 5.5);
  doc.text('QTY', margin + 105, y + 5.5, { align: 'right' });
  doc.text('PRICE (LKR)', margin + 135, y + 5.5, { align: 'right' });
  doc.text('TOTAL (LKR)', pageWidth - margin - 4, y + 5.5, { align: 'right' });

  y += 8;

  // Items Rows
  doc.setFontSize(9);
  inv.items.forEach((item, idx) => {
    const itemSub = item.price * item.qty;
    
    // Alternating row background
    if (idx % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, y, pageWidth - (margin * 2), 7.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${item.name}`, margin + 4, y + 5);
    doc.text(`${item.qty}`, margin + 105, y + 5, { align: 'right' });
    doc.text(`${item.price.toFixed(2)}`, margin + 135, y + 5, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`${itemSub.toFixed(2)}`, pageWidth - margin - 4, y + 5, { align: 'right' });

    y += 7.5;
  });

  // Table Bottom Border Line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;

  // Totals Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL AMOUNT:', margin + 4, y + 4);
  doc.text(`LKR ${inv.totalAmount.toFixed(2)}`, pageWidth - margin - 4, y + 4, { align: 'right' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Previous Customer Credit:', margin + 4, y + 4);
  doc.text(`LKR ${inv.previousCredit.toFixed(2)}`, pageWidth - margin - 4, y + 4, { align: 'right' });

  y += 8;
  // Total Credit Box
  doc.setFillColor(254, 243, 199); // #fef3c7 light amber
  doc.setDrawColor(252, 211, 77); // #fcd34d amber border
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 10, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(180, 83, 9); // #b45309 amber text
  doc.text('UPDATED TOTAL CREDIT AMOUNT:', margin + 4, y + 6.5);
  doc.text(`LKR ${inv.totalCreditAmount.toFixed(2)}`, pageWidth - margin - 4, y + 6.5, { align: 'right' });

  y += 18;

  // Footer Note
  doc.setLineWidth(0.4);
  doc.setDrawColor(226, 232, 240);
  if (doc.setLineDashPattern) doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(margin, y, pageWidth - margin, y);
  if (doc.setLineDashPattern) doc.setLineDashPattern([], 0);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Thank you for choosing Pegas (Pvt) Ltd!', pageWidth / 2, y, { align: 'center' });

  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Software Solutions & Distribution Network', pageWidth / 2, y, { align: 'center' });

  return doc;
}

// PDF Invoice Download & Share (Pure Vector PDF - 100% Full Content Guaranteed)
async function sendWhatsAppInvoice() {
  const inv = POSState.lastInvoice;
  if (!inv) return;

  showToast('Generating PDF...', 'info');

  const fileName = `Pegas_Invoice_${inv.invoiceNo}.pdf`;

  try {
    // 1. Create Vector PDF using jsPDF directly (No canvas screenshot bugs)
    const doc = createPDFInvoiceDoc(inv);
    if (!doc) {
      throw new Error('Could not initialize PDF document generator');
    }

    // 2. Download PDF file directly to device
    doc.save(fileName);
    showToast(`Downloaded ${fileName}`, 'success');

    // 3. Share PDF File via Web Share API
    try {
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `Invoice ${inv.invoiceNo} - Pegas (Pvt) Ltd`,
          files: [pdfFile]
        });
        showToast('Shared PDF file!', 'success');
      }
    } catch (shareErr) {
      if (shareErr.name !== 'AbortError') {
        console.log('File share error:', shareErr);
      }
    }
  } catch (err) {
    console.error('PDF Generation Error:', err);
    showToast('PDF generation failed', 'error');
  }
}

// Web Bluetooth Printing Engine (Thermal Receipt)
async function sendBluetoothInvoice() {
  const inv = POSState.lastInvoice;
  if (!inv) return;

  if (!navigator.bluetooth) {
    showToast('Web Bluetooth is not supported on this browser. Use Chrome/Edge or Mobile Chrome.', 'warning');
    alert('Web Bluetooth standard requires Google Chrome, Microsoft Edge, or Chrome for Android.\n\nYou can also click "Print Invoice" to print using any installed system or Bluetooth printer driver.');
    return;
  }

  try {
    showToast('Searching for Bluetooth Thermal Printer...', 'warning');

    // Request Bluetooth Device
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb',
        '00001101-0000-1000-8000-00805f9b34fb',
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2'
      ]
    });

    const server = await device.gatt.connect();
    showToast(`Connected to printer: ${device.name}`, 'success');

    // Get Serial Service
    const services = await server.getPrimaryServices();
    if (services.length === 0) throw new Error('No Bluetooth services found on printer');
    
    const service = services[0];
    const characteristics = await service.getCharacteristics();
    const writeCharacteristic = characteristics.find(c => c.properties.write || c.properties.writeWithoutResponse);

    if (!writeCharacteristic) throw new Error('No write characteristic found on Bluetooth printer.');

    // Build ESC/POS Printer Commands
    const encoder = new TextEncoder();
    
    // ESC/POS Initialization: ESC @ (\x1B\x40)
    let cmds = '\x1B\x40';
    // Center Align: ESC a 1 (\x1B\x61\x01)
    cmds += '\x1B\x61\x01';
    cmds += 'PEGAS (PVT) LTD\n';
    cmds += 'Kinniya, Trincomalee, Sri Lanka\n';
    cmds += 'Tel: +94 75 507 7070\n';
    cmds += '--------------------------------\n';
    // Left Align: ESC a 0 (\x1B\x61\x00)
    cmds += '\x1B\x61\x00';
    cmds += `Inv: ${inv.invoiceNo}\n`;
    cmds += `Date: ${inv.dateTime}\n`;
    cmds += `Cust: ${inv.customerName}\n`;
    cmds += `Phone: ${inv.customerPhone}\n`;
    cmds += '--------------------------------\n';
    
    inv.items.forEach(item => {
      const lineTotal = (item.price * item.qty).toFixed(2);
      cmds += `${item.name}\n`;
      cmds += `  ${item.qty} x ${item.price.toFixed(2)} = LKR ${lineTotal}\n`;
    });

    cmds += '--------------------------------\n';
    cmds += `TOTAL AMOUNT: LKR ${inv.totalAmount.toFixed(2)}\n`;
    cmds += `Prev Credit : LKR ${inv.previousCredit.toFixed(2)}\n`;
    cmds += `TOTAL CREDIT: LKR ${inv.totalCreditAmount.toFixed(2)}\n`;
    cmds += '--------------------------------\n';
    cmds += '\x1B\x61\x01'; // Center Align
    cmds += 'Thank you for your business!\n';
    cmds += 'www.pegas.lk\n\n\n';
    cmds += '\x1D\x56\x41\x00'; // Cut Paper Command (GS V 65 0)

    const data = encoder.encode(cmds);
    await writeCharacteristic.writeValue(data);

    showToast('Invoice sent to Bluetooth Thermal Printer!', 'success');
  } catch (err) {
    console.error('Bluetooth Print Error:', err);
    showToast('Bluetooth error: ' + err.message, 'error');
  }
}

// Standard Browser Print
function printInvoice() {
  window.print();
}

// ==========================================
// TAB 2: ADD / MANAGE CUSTOMERS
// ==========================================

function renderCustomersTable(filterQuery = '') {
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const query = filterQuery.toLowerCase().trim();
  const filtered = POSState.customers.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.phone.toLowerCase().includes(query) || 
    c.address.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">
          No customers found. Click "Add Customer" to create one.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(cust => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${cust.name}</strong></td>
      <td>${cust.address}</td>
      <td>${cust.phone}</td>
      <td><span style="font-weight:700; color:var(--warning);">LKR ${cust.credit.toFixed(2)}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-icon-btn edit" onclick="editCustomer('${cust.id}')" title="Edit Customer"><i class="fas fa-edit"></i></button>
          <button class="action-icon-btn delete" onclick="deleteCustomer('${cust.id}')" title="Delete Customer"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveCustomerForm(e) {
  e.preventDefault();
  const name = document.getElementById('custNameInput').value.trim();
  const address = document.getElementById('custAddressInput').value.trim();
  const phone = document.getElementById('custPhoneInput').value.trim();
  const credit = parseFloat(document.getElementById('custCreditInput').value) || 0;

  if (!name || !phone) {
    showToast('Please fill in Customer Name and Phone Number!', 'warning');
    return;
  }

  if (POSState.editingCustomerId) {
    // Edit existing
    const cust = POSState.customers.find(c => c.id === POSState.editingCustomerId);
    if (cust) {
      cust.name = name;
      cust.address = address;
      cust.phone = phone;
      cust.credit = credit;
      showToast(`Updated customer "${name}"`, 'success');
    }
    POSState.editingCustomerId = null;
  } else {
    // Add new customer
    const newCust = {
      id: 'cust_' + Date.now(),
      name,
      address: address || 'Kinniya, Sri Lanka',
      phone,
      credit
    };
    POSState.customers.push(newCust);
    showToast(`Added customer "${name}"`, 'success');
  }

  saveCustomers();
  resetCustomerForm();
  renderCustomerSelect();
  renderCustomersTable();
}

function editCustomer(id) {
  const cust = POSState.customers.find(c => c.id === id);
  if (!cust) return;

  POSState.editingCustomerId = id;
  document.getElementById('custNameInput').value = cust.name;
  document.getElementById('custAddressInput').value = cust.address;
  document.getElementById('custPhoneInput').value = cust.phone;
  document.getElementById('custCreditInput').value = cust.credit;

  const title = document.getElementById('customerFormTitle');
  const btn = document.getElementById('customerSubmitBtn');
  if (title) title.innerHTML = '<i class="fas fa-user-edit"></i> Edit Customer';
  if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';

  document.getElementById('cancelCustomerEditBtn').style.display = 'block';
}

function cancelCustomerEdit() {
  POSState.editingCustomerId = null;
  resetCustomerForm();
}

function resetCustomerForm() {
  document.getElementById('customerForm').reset();
  const title = document.getElementById('customerFormTitle');
  const btn = document.getElementById('customerSubmitBtn');
  if (title) title.innerHTML = '<i class="fas fa-user-plus"></i> Add New Customer';
  if (btn) btn.innerHTML = '<i class="fas fa-plus"></i> Add Customer';
  document.getElementById('cancelCustomerEditBtn').style.display = 'none';
}

function deleteCustomer(id) {
  const cust = POSState.customers.find(c => c.id === id);
  if (!cust) return;

  if (confirm(`Are you sure you want to delete customer "${cust.name}"?`)) {
    POSState.customers = POSState.customers.filter(c => c.id !== id);
    if (POSState.selectedCustomerId === id) {
      POSState.selectedCustomerId = POSState.customers.length > 0 ? POSState.customers[0].id : '';
    }
    saveCustomers();
    renderCustomerSelect();
    renderCustomersTable();
    showToast(`Deleted customer "${cust.name}"`, 'error');
  }
}

// ==========================================
// TAB 3: ADD / MANAGE PRODUCTS
// ==========================================

function renderProductsTable(filterQuery = '') {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const query = filterQuery.toLowerCase().trim();
  const filtered = POSState.products.filter(p => p.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted);">
          No products found. Click "Add Product" to create one.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(prod => {
    let stockClass = 'in-stock';
    if (prod.stock <= 0) stockClass = 'out-stock';
    else if (prod.stock <= 5) stockClass = 'low-stock';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${prod.name}</strong></td>
      <td><span class="stock-badge ${stockClass}">${prod.stock} Units</span></td>
      <td><strong style="color:var(--secondary);">LKR ${prod.price.toFixed(2)}</strong></td>
      <td>
        <div class="action-btns">
          <button class="action-icon-btn edit" onclick="editProduct('${prod.id}')" title="Edit Product"><i class="fas fa-edit"></i></button>
          <button class="action-icon-btn delete" onclick="deleteProduct('${prod.id}')" title="Delete Product"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveProductForm(e) {
  e.preventDefault();
  const name = document.getElementById('prodNameInput').value.trim();
  const stock = parseInt(document.getElementById('prodStockInput').value) || 0;
  const price = parseFloat(document.getElementById('prodPriceInput').value) || 0;

  if (!name || price <= 0) {
    showToast('Please enter a valid Product Name and Price!', 'warning');
    return;
  }

  if (POSState.editingProductId) {
    // Edit existing product
    const prod = POSState.products.find(p => p.id === POSState.editingProductId);
    if (prod) {
      prod.name = name;
      prod.stock = stock;
      prod.price = price;
      showToast(`Updated product "${name}"`, 'success');
    }
    POSState.editingProductId = null;
  } else {
    // Add new product
    const newProd = {
      id: 'prod_' + Date.now(),
      name,
      stock,
      price
    };
    POSState.products.push(newProd);
    showToast(`Added product "${name}"`, 'success');
  }

  saveProducts();
  resetProductForm();
  renderProductsGrid();
  renderProductsTable();
}

function editProduct(id) {
  const prod = POSState.products.find(p => p.id === id);
  if (!prod) return;

  POSState.editingProductId = id;
  document.getElementById('prodNameInput').value = prod.name;
  document.getElementById('prodStockInput').value = prod.stock;
  document.getElementById('prodPriceInput').value = prod.price;

  const title = document.getElementById('productFormTitle');
  const btn = document.getElementById('productSubmitBtn');
  if (title) title.innerHTML = '<i class="fas fa-box-open"></i> Edit Product';
  if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';

  document.getElementById('cancelProductEditBtn').style.display = 'block';
}

function cancelProductEdit() {
  POSState.editingProductId = null;
  resetProductForm();
}

function resetProductForm() {
  document.getElementById('productForm').reset();
  const title = document.getElementById('productFormTitle');
  const btn = document.getElementById('productSubmitBtn');
  if (title) title.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Product';
  if (btn) btn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
  document.getElementById('cancelProductEditBtn').style.display = 'none';
}

function deleteProduct(id) {
  const prod = POSState.products.find(p => p.id === id);
  if (!prod) return;

  if (confirm(`Are you sure you want to delete product "${prod.name}"?`)) {
    POSState.products = POSState.products.filter(p => p.id !== id);
    saveProducts();
    renderProductsGrid();
    renderProductsTable();
    showToast(`Deleted product "${prod.name}"`, 'error');
  }
}

// ==========================================
// FORM LISTENERS & SEARCH FILTERS
// ==========================================

function setupFormListeners() {
  // Search Products Catalog (POS Home)
  const prodSearch = document.getElementById('productSearchInput');
  if (prodSearch) {
    prodSearch.addEventListener('input', (e) => {
      renderProductsGrid(e.target.value);
    });
  }

  // Customer Management Form
  const custForm = document.getElementById('customerForm');
  if (custForm) custForm.addEventListener('submit', saveCustomerForm);

  const custTableSearch = document.getElementById('customerTableSearch');
  if (custTableSearch) {
    custTableSearch.addEventListener('input', (e) => {
      renderCustomersTable(e.target.value);
    });
  }

  // Product Management Form
  const prodForm = document.getElementById('productForm');
  if (prodForm) prodForm.addEventListener('submit', saveProductForm);

  const prodTableSearch = document.getElementById('productTableSearch');
  if (prodTableSearch) {
    prodTableSearch.addEventListener('input', (e) => {
      renderProductsTable(e.target.value);
    });
  }
}

// Toast Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'warning') iconClass = 'fa-exclamation-triangle';
  if (type === 'error') iconClass = 'fa-exclamation-circle';

  toast.innerHTML = `
    <i class="fas ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-15px)';
    setTimeout(() => toast.remove(), 200);
  }, 1800);
}
