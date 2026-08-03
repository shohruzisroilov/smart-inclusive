<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from '@lucide/vue'
import { fetchWizardSlides } from '@/lib/api/services'
import type { SlideDto } from '@/lib/api/types'

const props = defineProps<{
  scenarioId: number
  /** Yakunlash ekranidagi «Qaytish» tugmasi manzili. */
  backTo: string
}>()

const { t } = useI18n()

const slides = ref<SlideDto[]>([])
const loading = ref(true)
const currentIndex = ref(0)
const isFinished = ref(false)

const currentSlide = computed(() => slides.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === slides.value.length - 1)
const progress = computed(() =>
  slides.value.length ? ((currentIndex.value + 1) / slides.value.length) * 100 : 0,
)

function goNext() {
  if (isLast.value) isFinished.value = true
  else currentIndex.value++
}

function restart() {
  currentIndex.value = 0
  isFinished.value = false
}

onMounted(async () => {
  slides.value = (await fetchWizardSlides(props.scenarioId)).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )
  loading.value = false
})
</script>

<template>
  <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
    {{ t('common.loading') }}
  </div>

  <div
    v-else-if="slides.length === 0"
    class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl text-center text-[var(--fg-muted)]"
  >
    {{ t('slidePages.empty') }}
  </div>

  <!-- --- Yakunlash ekrani --- -->
  <div
    v-else-if="isFinished"
    class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl text-center space-y-6"
    role="status"
  >
    <div
      class="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center"
    >
      <CheckCircle2 class="w-10 h-10" aria-hidden="true" />
    </div>
    <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">
      {{ t('slides.completionTitle') }}
    </h2>
    <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light max-w-lg mx-auto">
      {{ t('slides.completionDesc') }}
    </p>
    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold hover:opacity-90 transition-all cursor-pointer"
        @click="restart"
      >
        <RotateCcw class="w-4 h-4" aria-hidden="true" />
        <span>{{ t('slides.restart') }}</span>
      </button>
      <router-link
        :to="backTo"
        class="px-8 py-3.5 rounded-xl border border-[var(--border-default)] text-[var(--fg)] font-bold hover:bg-[var(--surface-subtle)] transition-all"
      >
        {{ t('slides.back') }}
      </router-link>
    </div>
  </div>

  <!-- --- Slayd --- -->
  <div
    v-else-if="currentSlide"
    class="rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl overflow-hidden"
  >
    <div
      class="h-2 bg-[var(--surface-muted)]"
      role="progressbar"
      :aria-valuenow="currentIndex + 1"
      aria-valuemin="1"
      :aria-valuemax="slides.length"
    >
      <div class="h-full bg-[var(--brand)] transition-all" :style="{ width: `${progress}%` }" />
    </div>

    <div class="p-6 sm:p-10 space-y-6">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">
          {{ currentSlide.title }}
        </h2>
        <span class="shrink-0 text-xs font-bold text-[var(--brand)] tabular-nums">
          {{ t('slides.slideCounter', { current: currentIndex + 1, total: slides.length }) }}
        </span>
      </div>

      <img
        v-if="currentSlide.imageUrl"
        :src="currentSlide.imageUrl"
        :alt="currentSlide.title"
        class="w-full max-h-80 object-contain rounded-2xl bg-[var(--surface-subtle)]"
      />

      <p
        v-if="currentSlide.content"
        class="text-base text-[var(--fg-muted)] leading-relaxed font-light whitespace-pre-line"
      >
        {{ currentSlide.content }}
      </p>

      <div class="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border-default)] font-bold text-sm text-[var(--fg)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          :disabled="currentIndex === 0"
          @click="currentIndex--"
        >
          <ArrowLeft class="w-4 h-4" aria-hidden="true" />
          <span>{{ t('slides.prev') }}</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
          @click="goNext"
        >
          <span>{{ isLast ? t('slides.finish') : t('slides.next') }}</span>
          <ArrowRight class="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>
