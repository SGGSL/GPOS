<template>
  <div class="auth-page">
    <!-- Green top section -->
    <div class="auth-top">
      <div class="logo-circle">
        <img src="/images/ginesysone_logo.svg" alt="Ginesys" class="logo-img" />
      </div>
    </div>

    <!-- White bottom card -->
    <div class="auth-card">
      <h1 class="auth-title">Establish Connection</h1>
      <p class="auth-sub">Enter the server IP address or URL to connect to your POS system.</p>

      <div style="margin-top:22px;">
        <AppInput
          label="Connection URL"
          placeholder="10.10.10.10"
          v-model="url"
          :error="urlError"
        >
          <template #prefix>
            <img src="/images/public.svg" alt="" width="18" />
          </template>
        </AppInput>
      </div>

      <p class="version-text">Ginesys mPOS (v0.10)</p>

      <div style="margin-top:22px;">
        <AppButton
          :text="connecting ? 'Connecting...' : 'Connect'"
          :loading="connecting"
          @click="handleConnect"
        />
      </div>
    </div>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toast.show" :class="['toast', toast.success ? 'toast--success' : 'toast--error']">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import AppInput from '../components/ui/AppInput.vue'
import AppButton from '../components/ui/AppButton.vue'

const router = useRouter()
const store = useAppStore()

const url = ref(store.connectionUrl || '')
const urlError = ref('')
const connecting = ref(false)
const toast = ref({ show: false, message: '', success: false })

function showToast(msg, success = true) {
  toast.value = { show: true, message: msg, success }
  setTimeout(() => { toast.value.show = false }, 2500)
}

async function handleConnect() {
  if (!url.value.trim()) {
    urlError.value = 'Please enter a connection URL'
    return
  }
  urlError.value = ''
  connecting.value = true
  // Simulate connection attempt
  await new Promise(r => setTimeout(r, 1200))
  store.setConnection(url.value.trim())
  connecting.value = false
  showToast('Connected successfully!', true)
  setTimeout(() => router.push('/login'), 800)
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--primary);
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
}
.auth-top {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding-top: 60px; min-height: 260px;
}
.logo-circle {
  width: 160px; height: 160px;
  background: var(--white);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.logo-img { width: 110px; }
.auth-card {
  background: var(--white);
  border-radius: 24px 24px 0 0;
  padding: 26px 22px 40px;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
}
.auth-title { font-size: 28px; font-weight: 700; color: var(--text-secondary); }
.auth-sub { font-size: 14px; color: var(--gray); margin-top: 8px; line-height: 1.5; }
.version-text { font-size: 12px; color: var(--gray); margin-top: 18px; }
.toast {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  padding: 12px 24px; border-radius: 12px;
  font-size: 14px; font-weight: 500; color: #fff;
  z-index: 9999; white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.toast--success { background: var(--primary); }
.toast--error { background: var(--error); }
</style>
