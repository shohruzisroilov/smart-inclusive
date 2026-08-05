<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, X } from '@lucide/vue'
import ConfettiBurst from '@/components/ui/ConfettiBurst.vue'
import { useProgressStore } from '@/stores/useProgressStore'
import { PASS_THRESHOLD } from '@/lib/storage/progress'
import { TEST_TYPE_IMAGE } from '@/lib/api/constants'
import type { TestDto, TestQuestionDto } from '@/lib/api/types'

/**
 * Platformadagi BARCHA testlar shu vizarddan foydalanadi (TZ 9).
 *
 * Savolning ikki verstkasi bor — matnli ro'yxat va rasmli 2x2 to'r. Lug'at
 * testi (TZ 5.7) shu ikkinchisi: savolda so'z, variantlar rasm, imzolar esa
 * TANLANGUNCHA yashirin.
 *
 * To'g'ri javob har doim AYNAN BITTA — TZ bir nechta to'g'ri javob
 * mexanikasini hech qayerda ishlatmaslikni aniq ko'rsatadi.
 */
const props = withDefaults(
  defineProps<{
    test: TestDto
    variant?: 'default' | 'vocabulary'
    /** Natija ekranidagi «Qaytish» va «To'xtatish» manzili. */
    backTo: string
  }>(),
  { variant: 'default' },
)

const { t } = useI18n()
const progress = useProgressStore()

const questions = computed<TestQuestionDto[]>(() =>
  [...(props.test.qustions ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
)

const currentIndex = ref(0)
const answers = ref<Record<number, number>>({})
const isFinished = ref(false)
const confettiTrigger = ref(0)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)
const progressPercent = computed(() =>
  questions.value.length ? ((currentIndex.value + 1) / questions.value.length) * 100 : 0,
)

/** Javob tanlangan bo'lsa savol «tekshirilgan» holatga o'tadi (TZ 13.3). */
const isChecked = computed(() => answers.value[currentIndex.value] !== undefined)

function correctOptionId(question: TestQuestionDto): number | undefined {
  return question.answerOptions.find((o) => o.isCorrect)?.id
}

const correctCount = computed(
  () =>
    questions.value.filter((q, idx) => {
      const correct = correctOptionId(q)
      return correct !== undefined && answers.value[idx] === correct
    }).length,
)
const scorePercent = computed(() =>
  questions.value.length ? Math.round((correctCount.value / questions.value.length) * 100) : 0,
)
const isPassed = computed(() => scorePercent.value >= PASS_THRESHOLD)

const isVocab = computed(() => props.variant === 'vocabulary')
/** Rasmli to'r: lug'at testi yoki savol turi «Rasm» bo'lsa. */
const isImageLayout = computed(
  () => isVocab.value || currentQuestion.value?.typeId === TEST_TYPE_IMAGE,
)

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

/**
 * Javob TANLANGAN ZAHOTI tekshiriladi — serverga so'rov yo'q, test ochilganda
 * kelgan ma'lumot yetarli (TZ 9.1). Qayta bosish natijani o'zgartirmaydi,
 * aks holda bola qizil variantni bosib, uni yashilga aylantirib olardi.
 */
function select(optionId: number) {
  if (isChecked.value) return
  answers.value[currentIndex.value] = optionId
  if (optionId === correctOptionId(currentQuestion.value!)) {
    confettiTrigger.value++
  }
}

/** Variantning tekshiruvdan keyingi ko'rinishi (TZ 9.1: yashil/qizil/xira). */
function optionState(optionId: number): 'correct' | 'wrong' | 'muted' | 'idle' {
  if (!isChecked.value) return 'idle'
  if (optionId === correctOptionId(currentQuestion.value!)) return 'correct'
  if (optionId === answers.value[currentIndex.value]) return 'wrong'
  return 'muted'
}

function goNext() {
  if (isLast.value) {
    isFinished.value = true
    progress.saveTestResult(props.test.id, correctCount.value, questions.value.length)
  } else {
    currentIndex.value++
  }
}

function restart() {
  currentIndex.value = 0
  answers.value = {}
  isFinished.value = false
}
</script>

<template>
  <div
    class="relative p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] space-y-6"
  >
    <ConfettiBurst :trigger="confettiTrigger" />

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

        <!-- Nuqtalardan progress (TZ 9.1) -->
        <div
          class="flex items-center gap-1.5"
          role="progressbar"
          :aria-valuenow="currentIndex + 1"
          aria-valuemin="1"
          :aria-valuemax="questions.length"
          :aria-valuetext="t('test.questionCounter', { current: currentIndex + 1, total: questions.length })"
        >
          <span
            v-for="(q, i) in questions"
            :key="q.id"
            class="h-2 flex-1 rounded-full transition-colors"
            :class="i <= currentIndex ? 'bg-[var(--brand)]' : 'bg-[var(--surface-muted)]'"
          />
        </div>
      </div>

      <div
        class="p-5 sm:p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-default)] space-y-4"
      >
        <h2 class="text-lg sm:text-xl font-bold text-[var(--fg)]">
          {{ isVocab ? t('test.vocabPrompt') : currentQuestion.text }}
        </h2>

        <p v-if="isVocab" class="text-2xl font-extrabold text-[var(--brand)] font-display">
          {{ currentQuestion.text }}
        </p>

        <img
          v-if="currentQuestion.imageUrl"
          :src="currentQuestion.imageUrl"
          :alt="t('test.questionImageAlt')"
          class="w-full max-h-64 object-contain rounded-xl bg-[var(--surface)]"
        />

        <div
          role="radiogroup"
          :aria-label="t('test.answersLabel')"
          :class="isImageLayout ? 'grid grid-cols-2 gap-3 sm:gap-4' : 'space-y-2'"
        >
          <button
            v-for="opt in sortedOptions(currentQuestion)"
            :key="opt.id"
            type="button"
            role="radio"
            :aria-checked="answers[currentIndex] === opt.id"
            :disabled="isChecked"
            class="text-left rounded-2xl border-2 transition-all font-semibold"
            :class="[ { idle: 'border-[var(--border-default)] hover:border-[var(--brand)] text-[var(--fg)] cursor-pointer', correct: 'border-[var(--status-success)] bg-[var(--status-success-subtle)] text-[var(--status-success)]', wrong: 'border-[var(--status-danger)] bg-[var(--status-danger-subtle)] text-[var(--status-danger)]', muted: 'border-[var(--border-default)] text-[var(--fg-muted)] opacity-50', }[optionState(opt.id)], isImageLayout ? 'p-2' : 'p-4 text-sm w-full', ]"
            @click="select(opt.id)"
          >
            <img
              v-if="opt.imageUrl"
              :src="opt.imageUrl"
              :alt="opt.imageCaption ?? t('test.vocabImageAlt')"
              class="w-full aspect-square object-cover rounded-xl"
            />

            <span class="flex items-center gap-2" :class="opt.imageUrl ? 'mt-2 justify-center' : ''">
              <component
                :is="optionState(opt.id) === 'correct' ? CheckCircle2 : XCircle"
                v-if="optionState(opt.id) === 'correct' || optionState(opt.id) === 'wrong'"
                class="w-5 h-5 shrink-0"
                aria-hidden="true"
              />
              <!--
                Rasmli formatda imzo TANLASHGACHA yashirin (TZ 5.7/9.1) —
                aks holda javob rasmga qaramay o'qib olinardi.
              -->
              <span v-if="opt.text && (!isImageLayout || isChecked)" class="text-xs sm:text-sm">
                {{ opt.text }}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 pt-2">
        <!-- «To'xtatish» — istalgan qadamda, natija saqlanmaydi (TZ 9.1) -->
        <router-link
          :to="backTo"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-default)] font-bold text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          <X class="w-4 h-4" aria-hidden="true" />
          <span>{{ t('test.stop') }}</span>
        </router-link>

        <button
          type="button"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          :disabled="!isChecked"
          @click="goNext"
        >
          <span>{{ isLast ? t('test.viewResult') : t('test.next') }}</span>
          <ArrowRight class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </template>

    <!-- --- Natija bosqichi (TZ 9.2) --- -->
    <div v-else-if="isFinished" class="text-center space-y-6 py-4" role="status">
      <div
        class="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
        :class="isPassed ? 'bg-[var(--status-success-subtle)] text-[var(--status-success)]' : 'bg-[var(--status-warning-subtle)] text-[var(--status-warning)]'"
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

      <ul class="text-left space-y-2 max-w-xl mx-auto">
        <li
          v-for="(q, idx) in questions"
          :key="q.id"
          class="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-default)]"
        >
          <component
            :is="answers[idx] === correctOptionId(q) ? CheckCircle2 : XCircle"
            class="w-5 h-5 shrink-0 mt-0.5"
            :class="answers[idx] === correctOptionId(q) ? 'text-[var(--status-success)]' : 'text-[var(--status-danger)]'"
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
