<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from '@lucide/vue'
import TestWizard from '@/components/wizards/TestWizard.vue'
import { fetchTestById } from '@/lib/api/services'
import type { TestDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()

const testData = ref<TestDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  if (Number.isInteger(id)) testData.value = await fetchTestById(id)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link
      to="/tests"
      class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
    >
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('common.back') }}</span>
    </router-link>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
      {{ t('common.loading') }}
    </div>

    <TestWizard v-else-if="testData" :test="testData" back-to="/tests" />

    <div
      v-else
      class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
    >
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
