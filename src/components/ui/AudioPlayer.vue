<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Volume2, Square } from '@lucide/vue'
import { AUDIO_STATUS_SUCCESS } from '@/lib/api/constants'

/**
 * Uch tilli ovoz (TZ 11).
 *
 * Ovoz tili INTERFEYS tilidan mustaqil: bola ruscha interfeysda o'zbekcha
 * talaffuzni tinglashi mumkin. Shuning uchun bu yerda o'z tanlovi bor va u
 * `useI18n().locale` ga bog'lanmagan.
 *
 * Audiosi yo'q yoki generatsiyasi tugamagan til tugmasi `disabled` bo'ladi —
 * TZ shuni talab qiladi, mavjud tillar esa ishlayveradi.
 */
const props = defineProps<{
  uz?: string | null
  ru?: string | null
  en?: string | null
  /** Backend audio generatsiya holati — SUCCESS bo'lmagani ijroga berilmaydi. */
  statusUz?: number
  statusRu?: number
  statusEn?: number
}>()

const { t } = useI18n()

type AudioLang = 'uz' | 'ru' | 'en'
const LANGS: { id: AudioLang; label: string }[] = [
  { id: 'uz', label: "O'z" },
  { id: 'ru', label: 'Ру' },
  { id: 'en', label: 'En' },
]

/** Havola bor VA generatsiya muvaffaqiyatli tugagan bo'lsagina ijro etiladi. */
function urlFor(lang: AudioLang): string | null {
  const url = { uz: props.uz, ru: props.ru, en: props.en }[lang]
  const status = { uz: props.statusUz, ru: props.statusRu, en: props.statusEn }[lang]
  if (!url) return null
  if (status !== undefined && status !== AUDIO_STATUS_SUCCESS) return null
  return url
}

const available = computed(() => LANGS.filter((l) => urlFor(l.id) !== null))
const hasAny = computed(() => available.value.length > 0)

const current = ref<AudioLang>('uz')
watch(
  available,
  (list) => {
    if (list.length && !list.some((l) => l.id === current.value)) current.value = list[0]!.id
  },
  { immediate: true },
)

const isPlaying = ref(false)
let audio: HTMLAudioElement | null = null

function stop() {
  audio?.pause()
  audio = null
  isPlaying.value = false
}

function toggle() {
  if (isPlaying.value) {
    stop()
    return
  }
  const url = urlFor(current.value)
  if (!url) return

  audio = new Audio(url)
  audio.onended = () => (isPlaying.value = false)
  audio.onerror = () => (isPlaying.value = false)
  void audio.play()
  isPlaying.value = true
}

/** Til almashsa ijro to'xtaydi — aks holda ikki til ustma-ust yangrardi. */
function pick(lang: AudioLang) {
  if (lang === current.value) return
  stop()
  current.value = lang
}

onBeforeUnmount(stop)
</script>

<template>
  <div v-if="hasAny" class="inline-flex items-center gap-2 flex-wrap">
    <button
      type="button"
      :aria-pressed="isPlaying"
      :aria-label="isPlaying ? t('reader.pauseAudio') : t('reader.playAudio')"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all"
      :class="
        isPlaying
          ? 'bg-red-600 text-white'
          : 'bg-[var(--brand-subtle)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--fg-on-brand)]'
      "
      @click="toggle"
    >
      <component :is="isPlaying ? Square : Volume2" class="w-4 h-4" aria-hidden="true" />
      <span>{{ isPlaying ? t('reader.pauseAudio') : t('reader.listen') }}</span>
    </button>

    <!-- Ovoz tili — interfeys tilidan alohida (TZ 11) -->
    <div
      class="inline-flex items-center rounded-full border border-[var(--border-default)] p-0.5"
      role="group"
      :aria-label="t('reader.audioLangLabel', { lang: current })"
    >
      <button
        v-for="lang in LANGS"
        :key="lang.id"
        type="button"
        :disabled="urlFor(lang.id) === null"
        :aria-pressed="current === lang.id"
        class="px-2.5 py-1 rounded-full text-xs font-bold transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
        :class="
          current === lang.id
            ? 'bg-[var(--brand)] text-[var(--fg-on-brand)]'
            : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
        "
        @click="pick(lang.id)"
      >
        {{ lang.label }}
      </button>
    </div>
  </div>
</template>
