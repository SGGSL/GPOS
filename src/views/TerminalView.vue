<template>
  <div class="terminal-page">
    <div class="terminal-header">
      <img src="/images/ginesysone_logo.svg" alt="Ginesys" class="terminal-logo" />
      <h2 class="terminal-title">Select Terminal</h2>
      <p class="terminal-sub">Choose your POS terminal to continue</p>
    </div>
    <div class="terminal-list">
      <div
        v-for="t in terminals"
        :key="t.id"
        :class="['terminal-card', { 'terminal-card--selected': selected === t.id }]"
        @click="selected = t.id"
      >
        <div class="terminal-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div class="terminal-info">
          <div class="terminal-name">{{ t.name }}</div>
          <div class="terminal-code">{{ t.code }}</div>
        </div>
        <div v-if="selected === t.id" class="terminal-check">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
    </div>
    <div class="terminal-footer">
      <AppButton text="Continue" :disabled="!selected" @click="proceed" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import AppButton from '../components/ui/AppButton.vue'

const router = useRouter()
const store = useAppStore()
const selected = ref(null)

const terminals = [
  { id: 1, name: 'Terminal 01', code: 'T-001' },
  { id: 2, name: 'Terminal 02', code: 'T-002' },
  { id: 3, name: 'Terminal 03', code: 'T-003' },
]

function proceed() {
  const t = terminals.find(x => x.id === selected.value)
  if (t) {
    store.login({ cashierName: store.cashierName, terminalName: t.name, roleLabel: store.roleLabel })
    router.push('/pos')
  }
}
</script>

<style scoped>
.terminal-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
.terminal-header { background: var(--primary); padding: 40px 24px 30px; text-align: center; color: #fff; }
.terminal-logo { width: 100px; filter: brightness(0) invert(1); margin-bottom: 16px; }
.terminal-title { font-size: 24px; font-weight: 700; }
.terminal-sub { font-size: 14px; opacity: 0.85; margin-top: 6px; }
.terminal-list { flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 10px; }
.terminal-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--white); border-radius: 14px; padding: 16px;
  border: 2px solid var(--border); cursor: pointer; transition: border-color 0.2s;
}
.terminal-card--selected { border-color: var(--primary); background: var(--primary-tertiary); }
.terminal-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--primary); }
.terminal-card--selected .terminal-icon { background: var(--primary-secondary); }
.terminal-info { flex: 1; }
.terminal-name { font-size: 15px; font-weight: 600; }
.terminal-code { font-size: 12px; color: var(--gray); }
.terminal-check { width: 28px; height: 28px; background: var(--primary-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.terminal-footer { padding: 16px; }
</style>
