<template>
  <div class="input-wrap">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div :class="['input-field', { 'input-field--focused': focused, 'input-field--error': error }]">
      <span v-if="$slots.prefix" class="input-prefix"><slot name="prefix" /></span>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
        v-bind="$attrs"
      />
      <span v-if="$slots.suffix" class="input-suffix"><slot name="suffix" /></span>
    </div>
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const focused = ref(false)
defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  type: { type: String, default: 'text' },
  error: String,
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-wrap { display: flex; flex-direction: column; gap: 6px; }
.input-label { font-size: 14px; font-weight: 500; color: var(--text-secondary); }
.input-field {
  display: flex; align-items: center; gap: 8px;
  border: 1.5px solid var(--border);
  border-radius: 10px; padding: 0 14px;
  background: var(--white); transition: border-color 0.15s;
  height: 48px;
}
.input-field--focused { border-color: var(--primary); }
.input-field--error { border-color: var(--error); }
.input-field input {
  flex: 1; border: none; background: transparent;
  font-size: 15px; color: var(--text); height: 100%;
}
.input-field input::placeholder { color: var(--placeholder); }
.input-prefix, .input-suffix { display: flex; align-items: center; color: var(--gray); }
.input-error { font-size: 12px; color: var(--error); }
</style>
