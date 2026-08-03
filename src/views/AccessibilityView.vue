<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ShieldCheck } from '@lucide/vue'
const { t } = useI18n()
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] text-xs font-bold uppercase tracking-wider">
        <ShieldCheck class="w-4 h-4" />
        <span>{{ t('a11y.accessibilitySettings') }}</span>
      </div>

      <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">
        {{ t('footer.accessibilityStatement') }}
      </h1>

      <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
        {{ t('a11y.screenReaderInfo') }}
      </p>
    </div>
  </div>
</template>
