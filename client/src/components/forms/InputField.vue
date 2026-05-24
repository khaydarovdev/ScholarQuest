
<template>
  <label class="grid gap-2">
    <span class="text-xs font-medium uppercase tracking-[0.22em] text-muted">{{ label }}</span>
    <input
      v-if="type !== 'textarea'"
      :value="modelValue"
      :type="type"
      :step="step"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.08]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <textarea
      v-else
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      rows="4"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.08]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number | null | undefined;
  label: string;
  placeholder?: string;
  type?: string;
  step?: string;
  min?: string | number;
  max?: string | number;
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
