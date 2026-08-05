<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TestWizard from '@/components/wizards/TestWizard.vue'
import { getVocabularyTest } from '@/lib/api/tests'
import type { TestDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'

const route = useRoute()
const { t } = useI18n()

const topicId = Number(route.params.topicId)
const backTo = `/vocabulary/${route.params.topicId}`

const testData = ref<TestDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  if (Number.isInteger(topicId)) testData.value = await getVocabularyTest(topicId)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <SkeletonArticle v-if="loading" :media="false" />

    <TestWizard v-else-if="testData" :test="testData" variant="vocabulary" :back-to="backTo" />

    <div
      v-else
      class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] text-center space-y-3"
    >
      <h1 class="text-2xl font-extrabold text-[var(--fg)] font-display">
        {{ t('vocab.testEyebrow') }}
      </h1>
      <p class="text-sm text-[var(--fg-muted)]">{{ t('content.list.emptyTitle') }}</p>
    </div>
  </div>
</template>
