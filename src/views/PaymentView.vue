<template>
  <div class="payment-page">
    <!-- App Bar -->
    <header class="payment-appbar">
      <button class="back-btn" @click="router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="appbar-title">Payment</span>
      <div style="width:40px;"></div>
    </header>

    <div class="payment-body">
      <!-- Amount Summary -->
      <div class="amount-card">
        <div class="amount-label">Total Payable</div>
        <div class="amount-value">₹{{ store.cartTotal.toFixed(2) }}</div>
        <div class="amount-sub">
          <span class="remaining" :class="{ 'remaining--done': remainingBalance <= 0 }">
            {{ remainingBalance <= 0 ? '✓ Fully Paid' : `Remaining: ₹${remainingBalance.toFixed(2)}` }}
          </span>
          <span v-if="totalPaid > 0" class="paid-label">Paid: ₹{{ totalPaid.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Payment methods -->
      <div class="methods-list">

        <!-- Cash -->
        <div class="method-card" :class="{ 'method-card--open': cashOpen }">
          <div class="method-header" @click="cashOpen = !cashOpen">
            <div class="method-icon-wrap method-icon--cash">
              <img src="/images/cash.svg" width="22" alt="cash" />
            </div>
            <span class="method-name">Cash</span>
            <span v-if="payments.cash" class="method-paid">₹{{ payments.cash.toFixed(2) }}</span>
            <svg :class="['chevron', { 'chevron--open': cashOpen }]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div v-if="cashOpen" class="method-body">
            <div class="quick-amounts">
              <button v-for="amt in quickAmounts" :key="amt" class="quick-btn" @click="setCashAmount(amt)">₹{{ amt }}</button>
              <button class="quick-btn quick-btn--exact" @click="setCashAmount(remainingBalance > 0 ? remainingBalance : store.cartTotal)">Exact</button>
            </div>
            <AppInput label="Cash Amount" placeholder="0.00" v-model="cashInput" type="number" />
            <div v-if="parseFloat(cashInput) > store.cartTotal" class="change-info">
              Change: ₹{{ (parseFloat(cashInput) - store.cartTotal).toFixed(2) }}
            </div>
            <div style="margin-top:12px; display:flex; gap:10px;">
              <AppButton text="Cancel" variant="text-black" @click="cashOpen = false; cashInput = ''" />
              <AppButton text="Apply" @click="applyCash" />
            </div>
          </div>
        </div>

        <!-- Card -->
        <div class="method-card" :class="{ 'method-card--open': cardOpen }">
          <div class="method-header" @click="cardOpen = !cardOpen">
            <div class="method-icon-wrap method-icon--card">
              <img src="/images/card.svg" width="22" alt="card" />
            </div>
            <span class="method-name">Credit / Debit Card</span>
            <span v-if="payments.card" class="method-paid">₹{{ payments.card.toFixed(2) }}</span>
            <svg :class="['chevron', { 'chevron--open': cardOpen }]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div v-if="cardOpen" class="method-body">
            <div class="card-options">
              <div v-for="opt in cardOptions" :key="opt.id" :class="['card-opt', { 'card-opt--selected': selectedCard === opt.id }]" @click="selectedCard = opt.id">
                <div class="card-opt-icon">{{ opt.icon }}</div>
                <span>{{ opt.label }}</span>
              </div>
            </div>
            <AppInput label="Card Amount" placeholder="0.00" v-model="cardInput" type="number" />
            <AppInput label="Last 4 digits" placeholder="XXXX" v-model="cardLast4" />
            <div style="margin-top:12px; display:flex; gap:10px;">
              <AppButton text="Cancel" variant="text-black" @click="cardOpen = false; cardInput = ''" />
              <AppButton text="Apply" @click="applyCard" />
            </div>
          </div>
        </div>

        <!-- UPI -->
        <div class="method-card" :class="{ 'method-card--open': upiOpen }">
          <div class="method-header" @click="upiOpen = !upiOpen">
            <div class="method-icon-wrap method-icon--upi">
              <img src="/images/upi.svg" width="22" alt="upi" />
            </div>
            <span class="method-name">UPI / QR Code</span>
            <span v-if="payments.upi" class="method-paid">₹{{ payments.upi.toFixed(2) }}</span>
            <svg :class="['chevron', { 'chevron--open': upiOpen }]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div v-if="upiOpen" class="method-body">
            <div class="upi-apps">
              <div v-for="app in upiApps" :key="app.id" :class="['upi-app', { 'upi-app--selected': selectedUpi === app.id }]" @click="selectedUpi = app.id">
                <div class="upi-app-icon" :style="{ background: app.color }">{{ app.icon }}</div>
                <span>{{ app.label }}</span>
              </div>
            </div>
            <div class="qr-placeholder">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
              <p>QR Code will appear here</p>
            </div>
            <AppInput label="UPI Amount" placeholder="0.00" v-model="upiInput" type="number" />
            <div style="margin-top:12px; display:flex; gap:10px;">
              <AppButton text="Cancel" variant="text-black" @click="upiOpen = false; upiInput = ''" />
              <AppButton text="Apply" @click="applyUpi" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: Checkout button -->
    <div class="checkout-bar">
      <div class="checkout-summary">
        <span>Total: ₹{{ store.cartTotal.toFixed(2) }}</span>
        <span class="checkout-paid" v-if="totalPaid > 0">Paid: ₹{{ totalPaid.toFixed(2) }}</span>
      </div>
      <AppButton
        :text="remainingBalance <= 0 ? 'Complete Payment' : 'Collect & Complete'"
        :variant="remainingBalance <= 0 ? 'primary' : 'outline'"
        @click="completePayment"
      />
    </div>

    <!-- Success Modal -->
    <Transition name="fade">
      <div class="modal-overlay" v-if="showSuccess">
        <div class="success-modal">
          <div class="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>
          </div>
          <h2 class="success-title">Payment Successful!</h2>
          <p class="success-sub">Transaction completed for ₹{{ store.cartTotal.toFixed(2) }}</p>
          <div style="margin-top:24px; display:flex; flex-direction:column; gap:10px;">
            <AppButton text="Print Receipt" variant="outline" @click="printReceipt" />
            <AppButton text="New Bill" @click="newBill" />
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

const cashOpen = ref(false)
const cardOpen = ref(false)
const upiOpen = ref(false)
const cashInput = ref('')
const cardInput = ref('')
const cardLast4 = ref('')
const upiInput = ref('')
const selectedCard = ref(null)
const selectedUpi = ref(null)
const showSuccess = ref(false)

const payments = ref({ cash: 0, card: 0, upi: 0 })

const totalPaid = computed(() => payments.value.cash + payments.value.card + payments.value.upi)
const remainingBalance = computed(() => Math.max(0, store.cartTotal - totalPaid.value))

const quickAmounts = [100, 200, 500, 1000]

const cardOptions = [
  { id: 'credit', label: 'Credit Card', icon: '💳' },
  { id: 'debit', label: 'Debit Card', icon: '🏦' },
]

const upiApps = [
  { id: 'gpay', label: 'GPay', icon: 'G', color: '#4285F4' },
  { id: 'phonepe', label: 'PhonePe', icon: 'P', color: '#5F259F' },
  { id: 'paytm', label: 'Paytm', icon: 'T', color: '#00BAF2' },
  { id: 'bhim', label: 'BHIM', icon: 'B', color: '#00A859' },
]

function setCashAmount(amount) {
  cashInput.value = amount.toFixed(2)
}

function applyCash() {
  const amount = parseFloat(cashInput.value) || 0
  if (amount <= 0) return
  payments.value.cash = Math.min(amount, store.cartTotal)
  cashOpen.value = false
}

function applyCard() {
  const amount = parseFloat(cardInput.value) || 0
  if (amount <= 0) return
  payments.value.card = amount
  cardOpen.value = false
}

function applyUpi() {
  const amount = parseFloat(upiInput.value) || 0
  if (amount <= 0) return
  payments.value.upi = amount
  upiOpen.value = false
}

function completePayment() {
  showSuccess.value = true
}

function printReceipt() {
  window.print()
}

function newBill() {
  store.clearCart()
  router.push('/pos')
}
</script>

<style scoped>
.payment-page { display: flex; flex-direction: column; height: 100vh; background: var(--bg); }
.payment-appbar {
  height: 56px; background: var(--white);
  display: flex; align-items: center; padding: 0 12px; gap: 8px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.back-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: none; border-radius: 8px; }
.back-btn:hover { background: var(--bg); }
.appbar-title { flex: 1; text-align: center; font-size: 18px; font-weight: 700; }

.payment-body { flex: 1; overflow-y: auto; padding: 16px; }

.amount-card {
  background: var(--primary); color: var(--white);
  border-radius: 16px; padding: 20px 20px 18px;
  margin-bottom: 16px;
}
.amount-label { font-size: 13px; opacity: 0.85; }
.amount-value { font-size: 36px; font-weight: 800; margin-top: 4px; }
.amount-sub { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 13px; opacity: 0.9; }
.remaining { font-weight: 500; }
.remaining--done { color: #C0FF85; font-weight: 700; }
.paid-label { font-weight: 600; }

.methods-list { display: flex; flex-direction: column; gap: 10px; }
.method-card { background: var(--white); border-radius: 14px; overflow: hidden; border: 1.5px solid var(--border); }
.method-card--open { border-color: var(--primary); }
.method-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; cursor: pointer; user-select: none;
}
.method-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.method-icon--cash { background: #F0FFF4; }
.method-icon--card { background: #EFF6FF; }
.method-icon--upi { background: #FFF7ED; }
.method-name { flex: 1; font-size: 15px; font-weight: 600; }
.method-paid { font-size: 14px; font-weight: 700; color: var(--primary); margin-right: 6px; }
.chevron { transition: transform 0.2s; }
.chevron--open { transform: rotate(180deg); }
.method-body { padding: 0 16px 16px; border-top: 1px solid var(--border); padding-top: 14px; }

.quick-amounts { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.quick-btn {
  padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;
  background: var(--primary-secondary); color: var(--primary);
  border: 1px solid var(--primary-secondary); cursor: pointer;
}
.quick-btn--exact { background: var(--primary-tertiary); color: var(--green-dark); }
.change-info { margin-top: 6px; font-size: 13px; color: var(--orange); font-weight: 500; }

.card-options { display: flex; gap: 10px; margin-bottom: 14px; }
.card-opt {
  flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid var(--border);
  cursor: pointer; text-align: center; font-size: 13px; font-weight: 500;
}
.card-opt--selected { border-color: var(--primary); background: var(--primary-tertiary); color: var(--primary); }
.card-opt-icon { font-size: 22px; margin-bottom: 4px; }

.upi-apps { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.upi-app { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; width: 60px; }
.upi-app-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 16px; font-weight: 700;
}
.upi-app span { font-size: 11px; color: var(--text-secondary); }
.upi-app--selected .upi-app-icon { box-shadow: 0 0 0 3px var(--primary-light); }
.qr-placeholder {
  background: var(--bg); border-radius: 12px; padding: 24px;
  text-align: center; margin-bottom: 14px;
}
.qr-placeholder p { font-size: 13px; color: var(--gray); margin-top: 8px; }

.checkout-bar {
  padding: 12px 16px 16px; background: var(--white);
  border-top: 1.5px solid var(--border); flex-shrink: 0;
}
.checkout-summary { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.checkout-paid { color: var(--primary); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.success-modal { background: var(--white); border-radius: 20px; padding: 32px 24px; text-align: center; max-width: 340px; width: 100%; }
.success-icon { margin-bottom: 16px; }
.success-title { font-size: 22px; font-weight: 800; }
.success-sub { font-size: 14px; color: var(--gray); margin-top: 8px; }
</style>
