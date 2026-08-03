<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ClipboardCheck, ArrowRight } from '@lucide/vue'
import { getParentsTests } from '@/lib/api/tests'
import type { TestDto } from '@/lib/api/types'

const { t } = useI18n()
const tests = ref<TestDto[]>([])
const loading = ref(true)

onMounted(async () => {
  tests.value = await getParentsTests()
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <router-link
      to="/for-parents"
      class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
    >
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('common.back') }}</span>
    </router-link>

    <div
      class="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-3"
    >
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider"
      >
        <ClipboardCheck class="w-4 h-4" aria-hidden="true" />
        <span>{{ t('sections.parentsTestEyebrow') }}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold font-display">
        {{ t('sections.parentsTestsTitle') }}
      </h1>
      <p class="text-white/90 max-w-xl text-sm leading-relaxed font-light">
        {{ t('sections.parentsTestsSubtitle') }}
      </p>
    </div>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="tests.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="test in tests"
        :key="test.id"
        :to="`/for-parents/tests/${test.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-emerald-500 hover:shadow-xl transition-all space-y-4"
      >
        <div
          class="h-40 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600"
        >
          <ClipboardCheck class="w-12 h-12" aria-hidden="true" />
        </div>
        <div>
          <h3
            class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-emerald-600 transition-colors"
          >
            {{ test.title }}
          </h3>
          <p class="text-xs text-[var(--fg-muted)] mt-1">
            {{ test.qustions?.length || 0 }} {{ t('sections.questions') }}
          </p>
        </div>
        <div class="pt-2 flex items-center justify-between text-xs font-bold text-emerald-600">
          <span>{{ t('test.retake') }}</span>
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
