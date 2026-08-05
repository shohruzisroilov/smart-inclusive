<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * Klaviatura foydalanuvchilari uchun navigatsiyani o'tkazib yuborish havolasi
 * (WCAG 2.4.1). Odatda ko'rinmaydi — faqat fokus olganda chiqadi.
 */
const { t } = useI18n()
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-skip-link)] focus:px-5 focus:py-3 focus:rounded-xl focus:bg-[var(--brand)] focus:text-[var(--fg-on-brand)] focus:font-bold"
  >
    {{ t('a11y.skipToContent') }}
  </a>
</template>
