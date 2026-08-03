<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Award, CheckCircle2, XCircle } from '@lucide/vue'
import { fetchTestById } from '@/lib/api/services'
import type { TestDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()
const testData = ref<TestDto | null>(null)
const currentQuestion = ref(0)
const selectedAnswers = ref<Record<number, number>>({})
const isFinished = ref(false)
const loading = ref(true)

// computed score
const score = ref(0)

function finish() {
  if (!testData.value) return
  score.value = 0
  testData.value.qustions.forEach((q, idx) => {
    const selected = selectedAnswers.value[idx]
    const correct = q.answerOptions.find((o) => o.isCorrect)
    if (correct && selected === correct.id) score.value++
  })
  isFinished.value = true
}

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (id) testData.value = await fetchTestById(id)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/tests" class="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">{{ t('common.loading') }}</div>

    <div v-else-if="testData" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <!-- Title -->
      <div v-if="!isFinished" class="space-y-2 text-center">
        <span class="text-xs font-bold text-purple-600 uppercase tracking-wider">Test</span>
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ testData.title }}</h1>
      </div>

      <!-- Questions -->
      <div v-if="!isFinished && testData.qustions && testData.qustions.length > 0" class="space-y-6">
        <div class="p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-default)] space-y-4">
          <h2 class="text-lg font-bold text-[var(--fg)]">
            {{ currentQuestion + 1 }}. {{ testData.qustions[currentQuestion].text }}
          </h2>

          <div class="space-y-2">
            <button
              v-for="opt in testData.qustions[currentQuestion].answerOptions"
              :key="opt.id"
              type="button"
              class="w-full text-left p-4 rounded-xl border border-[var(--border-default)] hover:border-purple-500 hover:bg-purple-500/5 transition-all text-sm font-semibold cursor-pointer"
              :class="{ 'border-purple-600 bg-purple-500/10 font-bold': selectedAnswers[currentQuestion] === opt.id }"
              @click="selectedAnswers[currentQuestion] = opt.id"
            >
              {{ opt.text }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4">
          <button
            type="button"
            class="px-6 py-2.5 rounded-xl border border-[var(--border-default)] font-bold text-sm disabled:opacity-30 cursor-pointer"
            :disabled="currentQuestion === 0"
            @click="currentQuestion--"
          >
            Orqaga
          </button>
          <button
            type="button"
            class="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-all cursor-pointer"
            @click="currentQuestion < testData.qustions.length - 1 ? currentQuestion++ : finish()"
          >
            {{ currentQuestion < testData.qustions.length - 1 ? 'Keyingi' : 'Yakunlash' }}
          </button>
        </div>
      </div>

      <!-- Result Screen -->
      <div v-if="isFinished" class="text-center space-y-6 py-6">
        <div class="w-20 h-20 mx-auto rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
          <Award class="w-10 h-10" />
        </div>
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">Test yakunlandi!</h2>
        <p class="text-base text-[var(--fg-muted)]">
          To'g'ri javoblar: <strong class="text-purple-600">{{ score }}</strong> / {{ testData.qustions.length }}
        </p>
        <button
          type="button"
          class="mt-4 px-8 py-3.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all cursor-pointer"
          @click="isFinished = false; currentQuestion = 0; selectedAnswers = {}"
        >
          Qayta urinish
        </button>
      </div>
    </div>
  </div>
</template>
