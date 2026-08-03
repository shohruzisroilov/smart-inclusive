<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Award, ArrowRight } from '@lucide/vue'
import { getKidsTests } from '@/lib/api/tests'
import type { TestDto } from '@/lib/api/types'

const { t } = useI18n()
const tests = ref<TestDto[]>([])
const loading = ref(true)

onMounted(async () => {
  tests.value = await getKidsTests()
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-purple-200 text-xs font-bold uppercase tracking-wider">
        <Award class="w-4 h-4" />
        <span>{{ t('sections.testsTitle') }}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold font-display">{{ t('sections.testsTitle') }}</h1>
      <p class="text-white/90 max-w-xl text-sm leading-relaxed font-light">{{ t('sections.testsSubtitle') }}</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">{{ t('common.loading') }}</div>

    <div v-else-if="tests.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="test in tests"
        :key="test.id"
        :to="`/tests/${test.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-purple-500 hover:shadow-xl transition-all space-y-4"
      >
        <div class="h-40 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
          <Award class="w-12 h-12" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-purple-600 transition-colors">{{ test.title }}</h3>
          <p class="text-xs text-[var(--fg-muted)] mt-1">
            {{ test.qustions?.length || 0 }} {{ t('sections.questions') }}
          </p>
        </div>
        <div class="pt-2 flex items-center justify-between text-xs font-bold text-purple-600">
          <span>Topshirish</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </router-link>
    </div>
  </div>
</template>
