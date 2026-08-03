<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from '@lucide/vue'
const { t } = useI18n()
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/for-parents" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>
    <div class="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl text-center space-y-4">
      <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ t('slidePages.presentationTitle') }}</h1>
      <p class="text-sm text-[var(--fg-muted)]">Platforma taqdimoti yuklanmoqda...</p>
    </div>
  </div>
</template>
