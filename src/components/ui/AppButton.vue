<template>
  <button
    :class="['app-btn', `app-btn--${variant}`, { 'app-btn--disabled': disabled || loading }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup>
defineProps({
  text: String,
  variant: { type: String, default: 'primary' }, // primary | outline | text | red | text-black
  disabled: Boolean,
  loading: Boolean,
})
defineEmits(['click'])
</script>

<style scoped>
.app-btn {
  width: 100%; height: 48px;
  border-radius: 10px;
  font-size: 15px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.15s, transform 0.1s;
  cursor: pointer; border: none;
}
.app-btn:active { transform: scale(0.98); }
.app-btn--primary { background: var(--primary); color: #fff; }
.app-btn--primary:hover { background: #3d8a0a; }
.app-btn--outline { background: transparent; color: var(--primary); border: 1.5px solid var(--primary); }
.app-btn--text { background: transparent; color: var(--text-secondary); border: 1.5px solid var(--border); }
.app-btn--text-black { background: transparent; color: var(--text); border: 1.5px solid var(--border); }
.app-btn--red { background: var(--error); color: #fff; }
.app-btn--red:hover { background: #b91c1c; }
.app-btn--disabled { opacity: 0.55; cursor: not-allowed; }
.btn-spinner {
  width: 20px; height: 20px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
