<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ClipboardCheck, ArrowRight } from '@lucide/vue'
import { getParentsTests } from '@/lib/api/tests'
import type { TestDto } from '@/lib/api/types'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'

const { t } = useI18n()
const tests = ref<TestDto[]>([])
const loading = ref(true)

onMounted(async () => {
  tests.value = await getParentsTests()
  loading.value = false
})
</script>

<template>
  <div class="pt-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <PageHero
      accent="parents"
      :title="t('sections.parentsTestsTitle')"
    />

    <SkeletonCardGrid v-if="loading" />

    <div v-else-if="tests.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="test in tests"
        :key="test.id"
        :to="`/for-parents/tests/${test.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--accent-platform)] transition-all space-y-4"
      >
        <div
          class="h-40 rounded-2xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--accent-platform)]"
        >
          <ClipboardCheck class="w-12 h-12" aria-hidden="true" />
        </div>
        <div>
          <h3
            class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--accent-platform)] transition-colors"
          >
            {{ test.title }}
          </h3>
          <p class="text-xs text-[var(--fg-muted)] mt-1">
            {{ test.qustions?.length || 0 }} {{ t('sections.questions') }}
          </p>
        </div>
        <div class="pt-2 flex items-center justify-between text-xs font-bold text-[var(--accent-platform)]">
          <span>{{ t('sections.startTest') }}</span>
          <ArrowRight
            class="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </div>
      </router-link>
    </div>

    <div
      v-else
      class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
    >
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
