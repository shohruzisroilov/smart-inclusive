<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from '@lucide/vue'
import { TEST_TYPE_IMAGE } from '@/lib/api/constants'
import type { TestDto, TestQuestionDto } from '@/lib/api/types'

const props = defineProps<{
  test: TestDto
  /** Lug'at testi uchun boshqa matn va rasm-variantli tartib ishlatiladi. */
  variant?: 'default' | 'vocabulary'
  /** Natija ekranidagi «Qaytish» tugmasi manzili. */
  backTo: string
}>()

const { t } = useI18n()

/** O'tish bali — eski vizarddagi bilan bir xil. */
const PASS_THRESHOLD = 60

const questions = computed<TestQuestionDto[]>(() =>
  [...(props.test.qustions ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
)

const currentIndex = ref(0)
const answers = ref<Record<number, number>>({})
const isFinished = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)
const hasAnswered = computed(() => answers.value[currentIndex.value] !== undefined)
const progress = computed(() =>
  questions.value.length ? ((currentIndex.value + 1) / questions.value.length) * 100 : 0,
)

const correctCount = computed(
  () =>
    questions.value.filter((q, idx) => {
      const correct = q.answerOptions.find((o) => o.isCorrect)
      return correct && answers.value[idx] === correct.id
    }).length,
)
const scorePercent = computed(() =>
  questions.value.length ? Math.round((correctCount.value / questions.value.length) * 100) : 0,
)
const isPassed = computed(() => scorePercent.value >= PASS_THRESHOLD)

const isVocab = computed(() => props.variant === 'vocabulary')

const resultTitle = computed(() => {
  if (isVocab.value) return t(isPassed.value ? 'test.vocabPassedTitle' : 'test.vocabFailedTitle')
  return t(isPassed.value ? 'test.passedTitle' : 'test.failedTitle')
})

const resultDesc = computed(() => {
  const params = {
    total: questions.value.length,
    correct: correctCount.value,
    score: scorePercent.value,
    topic: props.test.vocabularyTopic ?? props.test.title,
  }
  if (isVocab.value)
    return t(isPassed.value ? 'test.vocabPassedDesc' : 'test.vocabFailedDesc', params)
  return t(isPassed.value ? 'test.passedDesc' : 'test.failedDesc', params)
})

function sortedOptions(question: TestQuestionDto) {
  return [...question.answerOptions].sort((a, b) => a.sortOrder - b.sortOrder)
}

function select(optionId: number) {
  answers.value[currentIndex.value] = optionId
}

function goNext() {
  if (isLast.value) isFinished.value = true
  else currentIndex.value++
}

function restart() {
  currentIndex.value = 0
  answers.value = {}
  isFinished.value = false
}
</script>

<template>
  <div
    class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6"
  >
    <!-- --- Savol bosqichi --- -->
    <template v-if="!isFinished && currentQuestion">
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-4">
          <h1 class="text-xl sm:text-2xl font-extrabold text-[var(--fg)] font-display">
            {{ test.title }}
          </h1>
          <span class="shrink-0 text-xs font-bold text-[var(--brand)] tabular-nums">
            {{ t('test.questionCounter', { current: currentIndex + 1, total: questions.length }) }}
          </span>
        </div>

        <div
          class="h-2 rounded-full bg-[var(--surface-muted)] overflow-hidden"
          role="progressbar"
          :aria-valuenow="currentIndex + 1"
          aria-valuemin="1"
          :aria-valuemax="questions.length"
        >
          <div
            class="h-full bg-[var(--brand)] rounded-full transition-all"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <div
        class="p-5 sm:p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-default)] space-y-4"
      >
        <h2 class="text-lg font-bold text-[var(--fg)]">
          {{ isVocab ? t('test.vocabPrompt') : currentQuestion.text }}
        </h2>

        <img
          v-if="currentQuestion.imageUrl"
          :src="currentQuestion.imageUrl"
          :alt="t('test.questionImageAlt')"
          class="w-full max-h-64 object-contain rounded-xl bg-[var(--surface)]"
        />

        <div
          role="radiogroup"
          :aria-label="t('test.answersLabel')"
          :class="
            currentQuestion.typeId === TEST_TYPE_IMAGE || isVocab
              ? 'grid grid-cols-2 sm:grid-cols-3 gap-3'
              : 'space-y-2'
          "
        >
          <button
            v-for="opt in sortedOptions(currentQuestion)"
            :key="opt.id"
            type="button"
            role="radio"
            :aria-checked="answers[currentIndex] === opt.id"
            class="text-left rounded-xl border-2 transition-all font-semibold cursor-pointer"
            :class="[
              answers[currentIndex] === opt.id
                ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)]'
                : 'border-[var(--border-default)] hover:border-[var(--brand)] text-[var(--fg)]',
              opt.imageUrl ? 'p-2' : 'p-4 text-sm w-full',
            ]"
            @click="select(opt.id)"
          >
            <img
              v-if="opt.imageUrl"
              :src="opt.imageUrl"
              :alt="opt.imageCaption ?? t('test.vocabImageAlt')"
              class="w-full aspect-square object-cover rounded-lg"
            />
            <span v-if="opt.text" class="block" :class="opt.imageUrl ? 'mt-2 text-xs text-center' : ''">
              {{ opt.text }}
            </span>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          class="px-6 py-2.5 rounded-xl border border-[var(--border-default)] font-bold text-sm text-[var(--fg)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          :disabled="currentIndex === 0"
          @click="currentIndex--"
        >
          {{ t('common.back') }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          :disabled="!hasAnswered"
          @click="goNext"
        >
          <span>{{ isLast ? t('test.viewResult') : t('test.next') }}</span>
          <ArrowRight class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </template>

    <!-- --- Natija bosqichi --- -->
    <div v-else-if="isFinished" class="text-center space-y-6 py-4" role="status">
      <div
        class="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
        :class="isPassed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'"
      >
        <Award v-if="isPassed" class="w-10 h-10" aria-hidden="true" />
        <RotateCcw v-else class="w-10 h-10" aria-hidden="true" />
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">{{ resultTitle }}</h2>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light max-w-lg mx-auto">
          {{ resultDesc }}
        </p>
      </div>

      <!-- Javoblarni ko'rib chiqish -->
      <ul class="text-left space-y-2 max-w-xl mx-auto">
        <li
          v-for="(q, idx) in questions"
          :key="q.id"
          class="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-default)]"
        >
          <component
            :is="answers[idx] === q.answerOptions.find((o) => o.isCorrect)?.id ? CheckCircle2 : XCircle"
            class="w-5 h-5 shrink-0 mt-0.5"
            :class="
              answers[idx] === q.answerOptions.find((o) => o.isCorrect)?.id
                ? 'text-emerald-600'
                : 'text-red-500'
            "
            aria-hidden="true"
          />
          <div class="min-w-0 space-y-0.5">
            <p class="text-sm font-semibold text-[var(--fg)]">
              {{ idx + 1 }}. {{ q.text || t('test.questionImageAlt') }}
            </p>
            <p class="text-xs text-[var(--fg-muted)]">
              {{ q.answerOptions.find((o) => o.isCorrect)?.text || '—' }}
            </p>
          </div>
        </li>
      </ul>

      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold hover:opacity-90 transition-all cursor-pointer"
          @click="restart"
        >
          <RotateCcw class="w-4 h-4" aria-hidden="true" />
          <span>{{ t('test.retake') }}</span>
        </button>
        <router-link
          :to="backTo"
          class="px-8 py-3.5 rounded-xl border border-[var(--border-default)] text-[var(--fg)] font-bold hover:bg-[var(--surface-subtle)] transition-all"
        >
          {{ t('test.backToMaterial') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
