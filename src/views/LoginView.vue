<template>
  <div class="auth-page">
    <div class="auth-top">
      <div class="logo-circle">
        <img src="/images/ginesysone_logo.svg" alt="Ginesys" class="logo-img" />
      </div>
    </div>

    <div class="auth-card">
      <h1 class="auth-title">Login</h1>

      <div class="connection-info" v-if="store.connectionUrl">
        <span class="conn-ip">Connected IP: {{ store.connectionUrl }}</span>
        <a class="conn-change" @click="router.push('/connection')">Change Connection</a>
      </div>

      <form @submit.prevent="handleLogin" style="margin-top:16px;">
        <AppInput
          label="User ID"
          placeholder="Please enter User ID"
          v-model="userId"
          :error="userIdError"
        />
        <div style="height:16px;"></div>
        <AppInput
          label="Password"
          placeholder="Please enter Password"
          v-model="password"
          :type="showPass ? 'text' : 'password'"
          :error="passError"
        >
          <template #suffix>
            <button type="button" class="eye-btn" @click="showPass = !showPass">
              <svg v-if="!showPass" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </template>
        </AppInput>
        <div style="height:22px;"></div>
        <AppButton text="Login" :loading="loading" />
      </form>
    </div>

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

const userId = ref('')
const password = ref('')
const showPass = ref(false)
const userIdError = ref('')
const passError = ref('')
const loading = ref(false)
const toast = ref({ show: false, message: '', success: false })

function showToast(msg, success = true) {
  toast.value = { show: true, message: msg, success }
  setTimeout(() => { toast.value.show = false }, 2500)
}

async function handleLogin() {
  userIdError.value = ''
  passError.value = ''
  if (!userId.value.trim()) { userIdError.value = 'User ID is required'; return }
  if (!password.value) { passError.value = 'Password is required'; return }

  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false

  // Demo: any credentials work
  store.login({ cashierName: userId.value, terminalName: 'Terminal-01', roleLabel: 'Cashier' })
  showToast('Login successful!', true)
  setTimeout(() => router.push('/pos'), 600)
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh; background: var(--primary);
  display: flex; flex-direction: column; position: relative;
}
.auth-top {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding-top: 60px; min-height: 240px;
}
.logo-circle {
  width: 160px; height: 160px; background: var(--white);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.logo-img { width: 110px; }
.auth-card {
  background: var(--white); border-radius: 24px 24px 0 0;
  padding: 26px 22px 48px; box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
}
.auth-title { font-size: 28px; font-weight: 700; color: var(--text-secondary); }
.connection-info {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 8px;
}
.conn-ip { font-size: 12px; color: var(--gray); }
.conn-change { font-size: 12px; color: var(--primary); cursor: pointer; }
.eye-btn { background: none; border: none; color: var(--gray); cursor: pointer; padding: 0; display: flex; }
.toast {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 500;
  color: #fff; z-index: 9999; white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.toast--success { background: var(--primary); }
.toast--error { background: var(--error); }
</style>
