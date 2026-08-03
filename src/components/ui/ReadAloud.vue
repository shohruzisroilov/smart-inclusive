<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Volume2, Square } from '@lucide/vue'

/**
 * Matnni ovoz bilan o'qish — brauzerning `SpeechSynthesis` API'siga tayanadi
 * (bekend TTS'i kerak emas). Qo'llab-quvvatlanmagan brauzerda umuman
 * ko'rinmaydi.
 */
const props = defineProps<{
  /** O'qiladigan matn joylashgan elementning `id` si. */
  targetId: string
}>()

const { t, locale } = useI18n()

const isSupported =
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  'SpeechSynthesisUtterance' in window

const isPlaying = ref(false)

const LANG_BY_LOCALE: Record<string, string> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
}

function stop() {
  window.speechSynthesis.cancel()
  isPlaying.value = false
}

function toggle() {
  if (!isSupported) return

  if (isPlaying.value) {
    stop()
    return
  }

  const element = document.getElementById(props.targetId)
  const text = element?.innerText ?? element?.textContent ?? ''
  if (!text.trim()) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_BY_LOCALE[locale.value] ?? 'uz-UZ'
  // Bolalar va kognitiv qulaylik uchun biroz sekinroq.
  utterance.rate = 0.85
  utterance.onend = () => (isPlaying.value = false)
  utterance.onerror = () => (isPlaying.value = false)

  window.speechSynthesis.speak(utterance)
  isPlaying.value = true
}

onBeforeUnmount(() => {
  if (isSupported) window.speechSynthesis.cancel()
})
</script>

<template>
  <button
    v-if="isSupported"
    type="button"
    :aria-pressed="isPlaying"
    :aria-label="isPlaying ? t('a11y.readAloudStop') : t('a11y.readAloudPlay')"
    :title="isPlaying ? t('a11y.readAloudStop') : t('a11y.readAloudPlay')"
    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm"
    :class="
      isPlaying
        ? 'bg-red-600 text-white animate-pulse'
        : 'bg-[var(--brand)] text-[var(--fg-on-brand)] hover:opacity-90'
    "
    @click="toggle"
  >
    <component :is="isPlaying ? Square : Volume2" class="h-4 w-4 shrink-0" aria-hidden="true" />
    <span>{{ isPlaying ? t('a11y.readAloudStop') : t('a11y.readAloudPlay') }}</span>
  </button>
</template>
