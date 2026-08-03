<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from '@lucide/vue'
import SlideWizard from '@/components/wizards/SlideWizard.vue'
import { SLIDE_SCENARIO_PRESENTATION } from '@/lib/api/constants'

const { t } = useI18n()
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link
      to="/for-parents"
      class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
    >
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('common.back') }}</span>
    </router-link>

    <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">
      {{ t('slidePages.presentationTitle') }}
    </h1>

    <SlideWizard :scenario-id="SLIDE_SCENARIO_PRESENTATION" back-to="/for-parents" />
  </div>
</template>
