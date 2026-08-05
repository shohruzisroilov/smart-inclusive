<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Compass, Home } from '@lucide/vue'

/**
 * Topilmagan sahifa.
 *
 * Avval router'da ushlab qoluvchi yo'nalish yo'q edi va noma'lum manzil
 * BUTUNLAY oq sahifa berardi — sarlavhasiz, menyusiz, qaytish yo'lisiz.
 * Bu ayniqsa endi muhim: `/comics/:id/read` va vizard sahifalari olib
 * tashlandi, ya'ni eski havolalar hali ham ochilishi mumkin.
 */
const { t } = useI18n()
</script>

<template>
  <div class="py-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div
      class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] text-center space-y-6"
    >
      <div
        class="w-20 h-20 mx-auto rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] flex items-center justify-center"
      >
        <Compass class="w-10 h-10" aria-hidden="true" />
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">
          {{ t('notFound.title') }}
        </h1>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
          {{ t('notFound.desc') }}
        </p>
      </div>

      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold hover:opacity-90 transition-all"
      >
        <Home class="w-5 h-5" aria-hidden="true" />
        <span>{{ t('notFound.home') }}</span>
      </router-link>
    </div>
  </div>
</template>
