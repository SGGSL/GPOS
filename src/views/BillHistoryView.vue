<template>
  <div class="history-page">
    <header class="history-appbar">
      <button class="back-btn" @click="router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="appbar-title">Billing History</span>
      <div style="width:40px;"></div>
    </header>

    <div class="history-body">
      <!-- Search -->
      <div class="search-wrap">
        <div class="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" placeholder="Search bills..." />
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-wrap">
        <div class="tabs">
          <div :class="['tab', { 'tab--active': activeTab === 0 }]" @click="activeTab = 0">History</div>
          <div :class="['tab', { 'tab--active': activeTab === 1 }]" @click="activeTab = 1">Hold Bill</div>
        </div>
      </div>

      <!-- List -->
      <div class="bills-list">
        <div v-if="filteredBills.length === 0" class="empty-state">
          <img src="/images/no_bill.svg" alt="No bills" class="empty-img" />
          <p class="empty-title">No Bills Yet</p>
          <p class="empty-sub">Bills will appear here once you start billing</p>
        </div>
        <div
          v-for="bill in filteredBills"
          :key="bill.ref"
          class="bill-card"
          @click="selectedBill = bill"
        >
          <div class="bill-icon-wrap">
            <img :src="bill.isHold ? '/images/hold_bill.svg' : '/images/payment_received.svg'" alt="" width="28" />
          </div>
          <div class="bill-info">
            <div class="bill-name">{{ bill.name }}</div>
            <div class="bill-amount">₹{{ bill.amount }}</div>
            <div class="bill-ref">Ref. No. {{ bill.ref }}</div>
          </div>
          <div class="bill-right">
            <div class="bill-date">{{ bill.date }}</div>
            <div :class="['bill-status', bill.isHold ? 'bill-status--hold' : 'bill-status--paid']">
              {{ bill.status }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bill Detail Modal -->
    <Transition name="fade">
      <div class="modal-overlay" v-if="selectedBill" @click="selectedBill = null">
        <div class="modal-sheet detail-sheet" @click.stop>
          <div class="sheet-handle"></div>
          <h2 class="modal-title">Bill Details</h2>
          <div class="detail-row"><span>Customer</span><strong>{{ selectedBill.name }}</strong></div>
          <div class="detail-row"><span>Date</span><strong>{{ selectedBill.date }}</strong></div>
          <div class="detail-row"><span>Ref No.</span><strong>{{ selectedBill.ref }}</strong></div>
          <div class="detail-row"><span>Amount</span><strong>₹{{ selectedBill.amount }}</strong></div>
          <div class="detail-row">
            <span>Status</span>
            <strong :class="selectedBill.isHold ? 'status-hold' : 'status-paid'">{{ selectedBill.status }}</strong>
          </div>
          <div style="margin-top:20px; display:flex; gap:10px;">
            <button class="detail-btn detail-btn--print" @click="selectedBill = null">Close</button>
            <button v-if="selectedBill.isHold" class="detail-btn detail-btn--recall">Recall Bill</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref(0)
const searchQuery = ref('')
const selectedBill = ref(null)

const allBills = [
  { name: 'Rajesh Prakash', date: '02-02-2025, 13:22', amount: '151.00', ref: '000008596854866', status: 'Payment Received', isHold: false },
  { name: 'Suman Dey', date: '03-02-2025, 11:05', amount: '249.00', ref: '000008596854867', status: 'Payment Received', isHold: false },
  { name: 'Pooja Sharma', date: '03-02-2025, 14:12', amount: '98.50', ref: '000008596854868', status: 'Bill on Hold', isHold: true },
  { name: 'Amit Verma', date: '04-02-2025, 10:45', amount: '315.00', ref: '000008596854869', status: 'Payment Received', isHold: false },
  { name: 'Riya Singh', date: '04-02-2025, 17:25', amount: '589.99', ref: '000008596854870', status: 'Bill on Hold', isHold: true },
  { name: 'Ankit Tiwari', date: '05-02-2025, 09:34', amount: '199.00', ref: '000008596854871', status: 'Payment Received', isHold: false },
  { name: 'Priya Ghosh', date: '05-02-2025, 13:55', amount: '412.75', ref: '000008596854872', status: 'Payment Received', isHold: false },
  { name: 'Ravi Kumar', date: '06-02-2025, 16:40', amount: '285.00', ref: '000008596854873', status: 'Bill on Hold', isHold: true },
  { name: 'Manish Agarwal', date: '06-02-2025, 18:30', amount: '122.00', ref: '000008596854874', status: 'Payment Received', isHold: false },
  { name: 'Rashmi Das', date: '07-02-2025, 12:15', amount: '348.00', ref: '000008596854875', status: 'Payment Received', isHold: false },
]

const filteredBills = computed(() => {
  let list = activeTab.value === 1 ? allBills.filter(b => b.isHold) : allBills.filter(b => !b.isHold)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b => b.name.toLowerCase().includes(q) || b.ref.includes(q))
  }
  return list
})
</script>

<style scoped>
.history-page { display: flex; flex-direction: column; height: 100vh; background: var(--bg); }
.history-appbar {
  height: 56px; background: var(--white);
  display: flex; align-items: center; padding: 0 12px; gap: 8px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.back-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: none; border-radius: 8px; }
.back-btn:hover { background: var(--bg); }
.appbar-title { flex: 1; text-align: center; font-size: 18px; font-weight: 700; }

.history-body { flex: 1; overflow-y: auto; }
.search-wrap { padding: 16px 16px 0; }
.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: var(--white); border: 1.5px solid var(--border);
  border-radius: 30px; padding: 0 14px; height: 44px;
}
.search-bar input { flex: 1; border: none; background: none; font-size: 14px; }
.search-bar input::placeholder { color: var(--placeholder); }

.tabs-wrap { padding: 12px 16px 0; }
.tabs {
  display: flex; background: var(--border); border-radius: 30px; padding: 4px;
}
.tab {
  flex: 1; text-align: center; padding: 10px; border-radius: 25px;
  font-size: 14px; font-weight: 500; cursor: pointer; color: var(--text-secondary);
  transition: background 0.2s, color 0.2s;
}
.tab--active { background: var(--white); font-weight: 600; color: var(--text); }

.bills-list { padding: 16px; }
.bill-card {
  display: flex; align-items: flex-start; gap: 10px;
  background: var(--white); border-radius: 12px; padding: 14px;
  border: 1px solid var(--border); margin-bottom: 10px; cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04); transition: box-shadow 0.15s;
}
.bill-card:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.1); }
.bill-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.bill-info { flex: 1; min-width: 0; }
.bill-name { font-size: 14px; font-weight: 600; color: var(--text-secondary); }
.bill-amount { font-size: 13px; font-weight: 700; color: var(--text); margin-top: 3px; }
.bill-ref { font-size: 11px; color: var(--gray); margin-top: 2px; }
.bill-right { text-align: right; flex-shrink: 0; }
.bill-date { font-size: 11px; color: var(--gray); }
.bill-status { font-size: 12px; font-weight: 600; margin-top: 16px; }
.bill-status--paid { color: var(--primary); }
.bill-status--hold { color: var(--orange); }

.empty-state { text-align: center; padding: 48px 24px; }
.empty-img { width: 140px; opacity: 0.7; margin-bottom: 16px; }
.empty-title { font-size: 18px; font-weight: 700; }
.empty-sub { font-size: 13px; color: var(--gray); margin-top: 6px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: flex-end; }
.modal-sheet {
  background: var(--white); width: 100%; max-width: 520px; margin: 0 auto;
  border-radius: 24px 24px 0 0; padding: 14px 20px 32px; max-height: 80vh; overflow-y: auto;
}
.sheet-handle { width: 40px; height: 5px; background: var(--border); border-radius: 10px; margin: 0 auto 16px; }
.modal-title { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
.detail-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0; border-bottom: 1px solid var(--border);
  font-size: 14px; color: var(--text-secondary);
}
.detail-row strong { color: var(--text); font-weight: 600; }
.status-paid { color: var(--primary); }
.status-hold { color: var(--orange); }
.detail-btn {
  flex: 1; height: 44px; border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; border: 1.5px solid var(--border); background: none;
}
.detail-btn--recall { background: var(--primary); color: #fff; border-color: var(--primary); }
</style>
