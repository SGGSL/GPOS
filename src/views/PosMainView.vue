<template>
  <div class="pos-layout">
    <!-- Sidebar Drawer -->
    <Transition name="drawer">
      <div class="drawer-overlay" v-if="drawerOpen" @click="drawerOpen = false">
        <div class="drawer" @click.stop>
          <div class="drawer-header">
            <div class="drawer-user-row">
              <div class="drawer-avatar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#101828" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
              <div>
                <div class="drawer-role">{{ store.roleLabel }}</div>
                <div class="drawer-name">{{ store.cashierName }}</div>
              </div>
            </div>
            <div class="drawer-kv"><span>Terminal</span><span class="drawer-kv-val">{{ store.terminalName }}</span></div>
            <div class="drawer-kv"><span>Session</span><span class="drawer-kv-val">{{ sessionTimeStr }}</span></div>
            <div style="margin-top:14px;">
              <AppButton
                :text="store.sessionActive ? 'Close Session' : 'Start Session'"
                :variant="store.sessionActive ? 'red' : 'primary'"
                @click="store.toggleSession()"
              />
            </div>
          </div>
          <div class="drawer-menu">
            <div class="drawer-item" @click="clearCart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>
              <span>Clear Cart</span>
            </div>
            <div class="drawer-item" @click="router.push('/bill-history'); drawerOpen=false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>Billing History</span>
            </div>
            <div class="drawer-item" @click="showOpeningBalance = true; drawerOpen=false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span>Add Opening Balance</span>
            </div>
            <div class="drawer-item" @click="showClosingBalance = true; drawerOpen=false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>
              <span>Add Closing Balance</span>
            </div>
          </div>
          <div class="drawer-logout" @click="handleLogout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toolbar -->
    <header class="toolbar">
      <button class="icon-btn" @click="drawerOpen = true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <img src="/images/toolbar_logo.svg" alt="Ginesys" class="toolbar-logo" onerror="this.style.display='none'" />
      <div style="width:40px;"></div>
    </header>

    <!-- Main content -->
    <div class="pos-body">
      <!-- Left: Product search + list -->
      <div class="pos-left">
        <!-- Search bar -->
        <div class="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" placeholder="Search item by name or scan barcode..." @keyup.enter="searchProducts" />
          <button class="scan-btn" title="Scan Barcode">
            <img src="/images/scan.svg" width="20" alt="scan" />
          </button>
        </div>

        <!-- Customer & Salesperson tags -->
        <div class="tags-row">
          <button class="tag-chip tag-chip--customer" @click="showCustomerModal = true">
            <img src="/images/tag_customer.svg" width="16" alt="" />
            <span>{{ store.taggedCustomer ? store.taggedCustomer.name : 'Tag Customer' }}</span>
          </button>
          <button class="tag-chip tag-chip--sales" @click="showSalesModal = true">
            <img src="/images/sales_person.svg" width="16" alt="" />
            <span>{{ store.assignedSalesperson ? store.assignedSalesperson.name : 'Assign Salesperson' }}</span>
          </button>
        </div>

        <!-- Product grid -->
        <div class="product-section">
          <div v-if="filteredProducts.length === 0 && searchQuery" class="empty-state">
            <p style="color:var(--gray);font-size:14px;">No products found for "{{ searchQuery }}"</p>
          </div>
          <div v-else class="product-grid">
            <div
              v-for="p in filteredProducts"
              :key="p.id"
              class="product-card"
              @click="store.addToCart(p)"
            >
              <div class="product-img-wrap">
                <img :src="p.image" :alt="p.name" class="product-img" onerror="this.src='/images/item_placeholder.svg'" />
              </div>
              <div class="product-info">
                <div class="product-name">{{ p.name }}</div>
                <div class="product-code">{{ p.code }}</div>
                <div class="product-price">₹{{ p.price.toFixed(2) }}</div>
              </div>
              <button class="product-add-btn">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Cart -->
      <div class="pos-right">
        <div class="cart-header">
          <span class="cart-title">Cart</span>
          <span class="cart-badge">{{ store.cartCount }} items</span>
        </div>

        <!-- Empty cart -->
        <div v-if="store.cartItems.length === 0" class="cart-empty">
          <img src="/images/empty_cart.svg" alt="Empty" class="cart-empty-img" />
          <p class="cart-empty-title">Your cart is empty</p>
          <p class="cart-empty-sub">Search and add items to start billing</p>
        </div>

        <!-- Cart items -->
        <div v-else class="cart-list">
          <div v-for="item in store.cartItems" :key="item.id" class="cart-item">
            <div class="cart-item-img">
              <img :src="item.image" :alt="item.name" onerror="this.src='/images/item_placeholder.svg'" />
            </div>
            <div class="cart-item-info">
              <div class="cart-item-name">{{ item.name }}</div>
              <div class="cart-item-code">{{ item.code }}</div>
              <div class="cart-item-price">₹{{ (item.price * item.qty).toFixed(2) }}</div>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" @click="store.updateQty(item.id, -1)">
                <img src="/images/minus.svg" width="14" alt="-" />
              </button>
              <span class="qty-val">{{ item.qty }}</span>
              <button class="qty-btn" @click="store.updateQty(item.id, 1)">
                <img src="/images/plus.svg" width="14" alt="+" />
              </button>
            </div>
            <button class="cart-del-btn" @click="store.removeFromCart(item.id)">
              <img src="/images/delete_red.svg" width="16" alt="del" />
            </button>
          </div>
        </div>

        <!-- Cart footer -->
        <div v-if="store.cartItems.length > 0" class="cart-footer">
          <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{{ store.cartTotal.toFixed(2) }}</span>
          </div>
          <div class="cart-summary-row cart-summary-row--total">
            <span>Total Payable</span>
            <span>₹{{ store.cartTotal.toFixed(2) }}</span>
          </div>
          <AppButton text="Proceed to Payment →" @click="goToPayment" />
        </div>
      </div>
    </div>

    <!-- Customer Modal -->
    <Transition name="fade">
      <div class="modal-overlay" v-if="showCustomerModal" @click="showCustomerModal = false">
        <div class="modal-sheet" @click.stop>
          <div class="sheet-handle"></div>
          <h2 class="modal-title">Tag Customer</h2>
          <AppInput placeholder="Search by name or mobile..." v-model="customerSearch" />
          <div class="modal-list">
            <div v-for="c in filteredCustomers" :key="c.id" class="modal-list-item" @click="selectCustomer(c)">
              <div class="modal-item-avatar">{{ c.name[0] }}</div>
              <div>
                <div style="font-weight:600;font-size:14px;">{{ c.name }}</div>
                <div style="font-size:12px;color:var(--gray);">{{ c.phone }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Salesperson Modal -->
    <Transition name="fade">
      <div class="modal-overlay" v-if="showSalesModal" @click="showSalesModal = false">
        <div class="modal-sheet" @click.stop>
          <div class="sheet-handle"></div>
          <h2 class="modal-title">Assign Salesperson</h2>
          <div class="modal-list">
            <div v-for="s in salespeople" :key="s.id" class="modal-list-item" @click="selectSales(s)">
              <div class="modal-item-avatar" style="background:var(--primary-secondary);color:var(--primary);">{{ s.name[0] }}</div>
              <div>
                <div style="font-weight:600;font-size:14px;">{{ s.name }}</div>
                <div style="font-size:12px;color:var(--gray);">{{ s.code }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Balance Modal -->
    <Transition name="fade">
      <div class="modal-overlay" v-if="showOpeningBalance || showClosingBalance" @click="showOpeningBalance=false;showClosingBalance=false;">
        <div class="modal-sheet" @click.stop>
          <div class="sheet-handle"></div>
          <h2 class="modal-title">{{ showOpeningBalance ? 'Add Opening Balance' : 'Add Closing Balance' }}</h2>
          <AppInput label="Amount" placeholder="Enter amount" v-model="balanceAmount" type="number" />
          <div style="margin-top:20px;display:flex;gap:12px;">
            <AppButton text="Cancel" variant="text-black" @click="showOpeningBalance=false;showClosingBalance=false;" />
            <AppButton text="Save" @click="saveBalance" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Logout confirm -->
    <Transition name="fade">
      <div class="modal-overlay" v-if="showLogoutConfirm" @click="showLogoutConfirm = false">
        <div class="modal-sheet" @click.stop>
          <div class="sheet-handle"></div>
          <h2 class="modal-title">Logout?</h2>
          <p style="font-size:14px;color:var(--gray);margin-top:8px;">Do you want to logout the current session?</p>
          <div style="margin-top:22px;display:flex;gap:12px;">
            <AppButton text="Cancel" variant="text-black" @click="showLogoutConfirm = false" />
            <AppButton text="Logout" variant="red" @click="confirmLogout" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import AppButton from '../components/ui/AppButton.vue'
import AppInput from '../components/ui/AppInput.vue'

const router = useRouter()
const store = useAppStore()

const drawerOpen = ref(false)
const searchQuery = ref('')
const showCustomerModal = ref(false)
const showSalesModal = ref(false)
const showOpeningBalance = ref(false)
const showClosingBalance = ref(false)
const showLogoutConfirm = ref(false)
const customerSearch = ref('')
const balanceAmount = ref('')

const sessionTimeStr = computed(() => {
  if (!store.sessionStartTime) return '-'
  return new Date(store.sessionStartTime).toLocaleTimeString()
})

// Demo products
const products = ref([
  { id: 1, name: 'Blue Denim Jeans', code: 'DNM-001', price: 1299, image: '/images/item_placeholder.svg' },
  { id: 2, name: 'White Formal Shirt', code: 'SHT-002', price: 799, image: '/images/item_placeholder.svg' },
  { id: 3, name: 'Black T-Shirt', code: 'TSH-003', price: 499, image: '/images/item_placeholder.svg' },
  { id: 4, name: 'Casual Chinos', code: 'CHN-004', price: 999, image: '/images/item_placeholder.svg' },
  { id: 5, name: 'Polo Shirt', code: 'PLO-005', price: 649, image: '/images/item_placeholder.svg' },
  { id: 6, name: 'Track Pants', code: 'TRK-006', price: 549, image: '/images/item_placeholder.svg' },
  { id: 7, name: 'Linen Shirt', code: 'LIN-007', price: 899, image: '/images/item_placeholder.svg' },
  { id: 8, name: 'Sports Shorts', code: 'SPT-008', price: 349, image: '/images/item_placeholder.svg' },
])

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
})

const customers = ref([
  { id: 1, name: 'Rajesh Prakash', phone: '9876543210' },
  { id: 2, name: 'Suman Dey', phone: '9876543211' },
  { id: 3, name: 'Pooja Sharma', phone: '9876543212' },
  { id: 4, name: 'Amit Verma', phone: '9876543213' },
  { id: 5, name: 'Riya Singh', phone: '9876543214' },
])

const filteredCustomers = computed(() => {
  if (!customerSearch.value) return customers.value
  const q = customerSearch.value.toLowerCase()
  return customers.value.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q))
})

const salespeople = ref([
  { id: 1, name: 'Ankit Tiwari', code: 'SP-001' },
  { id: 2, name: 'Priya Ghosh', code: 'SP-002' },
  { id: 3, name: 'Rahul Sen', code: 'SP-003' },
])

function selectCustomer(c) {
  store.setCustomer(c)
  showCustomerModal.value = false
}

function selectSales(s) {
  store.setSalesperson(s)
  showSalesModal.value = false
}

function clearCart() {
  store.clearCart()
  drawerOpen.value = false
}

function saveBalance() {
  showOpeningBalance.value = false
  showClosingBalance.value = false
  balanceAmount.value = ''
}

function handleLogout() {
  drawerOpen.value = false
  setTimeout(() => { showLogoutConfirm.value = true }, 250)
}

function confirmLogout() {
  store.logout()
  router.push('/login')
}

function goToPayment() {
  router.push('/payment')
}

function searchProducts() {
  // filter handled by computed
}
</script>

<style scoped>
.pos-layout {
  display: flex; flex-direction: column;
  height: 100vh; overflow: hidden;
  background: var(--bg);
}

/* Toolbar */
.toolbar {
  height: 56px; background: var(--white);
  display: flex; align-items: center;
  padding: 0 16px; gap: 8px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0; z-index: 10;
}
.toolbar-logo { height: 22px; flex: 1; object-fit: contain; }
.icon-btn {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: none; border-radius: 8px; color: #333;
}
.icon-btn:hover { background: var(--bg); }

/* Body */
.pos-body {
  flex: 1; display: flex; overflow: hidden; gap: 0;
}

/* Left */
.pos-left {
  flex: 1; display: flex; flex-direction: column;
  overflow: hidden; padding: 12px;
  border-right: 1px solid var(--border);
}
.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: var(--white); border: 1.5px solid var(--border);
  border-radius: 30px; padding: 0 14px; height: 46px; margin-bottom: 10px;
}
.search-bar input { flex: 1; border: none; background: none; font-size: 14px; color: var(--text); }
.search-bar input::placeholder { color: var(--placeholder); }
.scan-btn { background: none; display: flex; align-items: center; }

.tags-row { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.tag-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;
  border: 1.5px solid var(--border); background: var(--white); cursor: pointer;
}
.tag-chip--customer { color: var(--customer-color); border-color: var(--customer-color); background: var(--customer-bg); }
.tag-chip--sales { color: var(--primary); border-color: var(--primary); background: var(--primary-secondary); }

.product-section { flex: 1; overflow-y: auto; }
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}
.product-card {
  background: var(--white); border-radius: 12px; padding: 10px;
  border: 1.5px solid var(--border); cursor: pointer; position: relative;
  transition: box-shadow 0.15s, border-color 0.15s;
}
.product-card:hover { border-color: var(--primary); box-shadow: 0 2px 12px rgba(76,163,13,0.15); }
.product-img-wrap { height: 90px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
.product-img { max-height: 80px; max-width: 100%; object-fit: contain; }
.product-name { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.3; }
.product-code { font-size: 11px; color: var(--gray); margin-top: 2px; }
.product-price { font-size: 14px; font-weight: 700; color: var(--primary); margin-top: 4px; }
.product-add-btn {
  position: absolute; top: 8px; right: 8px;
  width: 24px; height: 24px; border-radius: 6px;
  background: var(--primary); color: #fff; font-size: 18px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
}

/* Right - Cart */
.pos-right {
  width: 340px; flex-shrink: 0;
  display: flex; flex-direction: column;
  background: var(--white);
}
.cart-header {
  padding: 14px 16px 10px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.cart-title { font-size: 18px; font-weight: 700; }
.cart-badge {
  background: var(--primary); color: #fff;
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 10px;
}
.cart-empty {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px;
}
.cart-empty-img { width: 140px; opacity: 0.7; }
.cart-empty-title { font-size: 16px; font-weight: 600; margin-top: 16px; }
.cart-empty-sub { font-size: 13px; color: var(--gray); margin-top: 6px; text-align: center; }
.cart-list { flex: 1; overflow-y: auto; padding: 8px; }
.cart-item {
  display: flex; align-items: center; gap: 8px;
  padding: 10px; border-radius: 10px;
  border: 1.5px solid var(--border); margin-bottom: 8px; background: var(--white);
}
.cart-item-img { width: 40px; height: 40px; border-radius: 8px; overflow: hidden; background: var(--bg); flex-shrink: 0; }
.cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-item-code { font-size: 11px; color: var(--gray); }
.cart-item-price { font-size: 13px; font-weight: 700; color: var(--primary); }
.cart-item-qty { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.qty-btn {
  width: 26px; height: 26px; border-radius: 6px;
  background: var(--bg); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.qty-val { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
.cart-del-btn { background: none; padding: 4px; flex-shrink: 0; }
.cart-footer {
  padding: 12px 16px 16px;
  border-top: 1.5px solid var(--border);
  flex-shrink: 0;
}
.cart-summary-row {
  display: flex; justify-content: space-between;
  font-size: 14px; padding: 4px 0; color: var(--text-secondary);
}
.cart-summary-row--total { font-size: 16px; font-weight: 700; color: var(--text); padding: 8px 0; border-top: 1px solid var(--border); margin-bottom: 12px; }

/* Drawer */
.drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100;
  display: flex; align-items: stretch;
}
.drawer {
  width: 300px; background: var(--white); height: 100%;
  display: flex; flex-direction: column; overflow-y: auto;
}
.drawer-header { background: var(--bg); padding: 18px; }
.drawer-user-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.drawer-avatar {
  width: 42px; height: 42px; border-radius: 10px;
  background: var(--border); display: flex; align-items: center; justify-content: center;
}
.drawer-role { font-size: 12px; color: var(--gray); }
.drawer-name { font-size: 16px; font-weight: 700; color: var(--text); }
.drawer-kv { display: flex; justify-content: space-between; font-size: 14px; padding: 3px 0; color: var(--gray); }
.drawer-kv-val { font-weight: 600; color: var(--text); }
.drawer-menu { flex: 1; padding: 8px 0; }
.drawer-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; cursor: pointer; font-size: 15px; font-weight: 500;
}
.drawer-item:hover { background: var(--primary-tertiary); }
.drawer-logout {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; cursor: pointer; font-size: 15px; font-weight: 500; color: var(--error);
  border-top: 1px solid var(--border);
}
.drawer-logout:hover { background: #fff5f5; }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: flex-end; }
.modal-sheet {
  background: var(--white); width: 100%; max-width: 520px; margin: 0 auto;
  border-radius: 24px 24px 0 0; padding: 14px 20px 32px; max-height: 80vh; overflow-y: auto;
}
.sheet-handle { width: 40px; height: 5px; background: var(--border); border-radius: 10px; margin: 0 auto 16px; }
.modal-title { font-size: 22px; font-weight: 700; margin-bottom: 14px; }
.modal-list { margin-top: 14px; }
.modal-list-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 4px; border-bottom: 1px solid var(--border); cursor: pointer;
}
.modal-list-item:hover { background: var(--primary-tertiary); border-radius: 8px; padding: 12px 8px; }
.modal-item-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--border); color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
}

.empty-state { padding: 40px; text-align: center; }

/* Drawer transition */
.drawer-enter-active, .drawer-leave-active { transition: all 0.25s ease; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(-100%); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 768px) {
  .pos-right { width: 100%; position: fixed; bottom: 0; left: 0; right: 0; height: 50vh; border-top: 2px solid var(--border); }
  .pos-left { padding-bottom: 50vh; }
  .product-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
}
</style>
