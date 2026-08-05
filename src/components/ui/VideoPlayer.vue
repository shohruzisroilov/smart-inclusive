<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Play, Pause, Award, Gauge } from '@lucide/vue'
import { useProgressStore } from '@/stores/useProgressStore'
import {
  extractVideoId,
  loadYouTubeApi,
  YT_STATE_ENDED,
  YT_STATE_PLAYING,
  type YouTubePlayer,
} from '@/lib/youtube'
import type { ContentItemDto, TestDto } from '@/lib/api/types'

/**
 * Videodars pleyeri (TZ 10.3).
 *
 * YouTube IFrame API orqali boshqariladi (TZ 13.1): shu tufayli pauza/ijro va
 * tezlik pereklyuchateli ijroni UZMASDAN ishlaydi. Avval tezlik URL parametri
 * bilan berilar va iframe'ni qayta yuklardi — bola videoni boshidan ko'rishga
 * majbur bo'lardi.
 *
 * API yuklanmasa (tarmoq bloklangan bo'lsa) pleyer oddiy `<iframe>` ga
 * qaytadi: video baribir ko'riladi, faqat tashqi tugmalarsiz.
 */
const props = defineProps<{
  item: ContentItemDto
  linkedTest?: TestDto | null
}>()

const { t } = useI18n()
const progress = useProgressStore()

const SPEEDS = [
  { value: 0.75, labelKey: 'player.speedSlow' },
  { value: 1, labelKey: 'player.speedNormal' },
  { value: 1.5, labelKey: 'player.speedFast' },
] as const

const speed = ref(1)
const isPlaying = ref(false)
/** API ishlamasa oddiy embed'ga qaytamiz. */
const apiFailed = ref(false)

const isWatched = computed(() => progress.isViewed(props.item.id))

/**
 * Test tugmasi ochilish sharti (TZ 10.4).
 *
 * Odatda video OXIRIGACHA ko'rilganda ochiladi va buni pleyerning o'zi
 * aniqlaydi. Lekin YouTube API yuklanmagan bo'lsa (tarmoq bloklangan),
 * oddiy `<iframe>` tugash hodisasini bermaydi — bunday holatda testni
 * umuman ochmaslik foydalanuvchini boshi berk ko'chaga olib borardi,
 * shuning uchun aniqlab bo'lmasa cheklanmaydi.
 */
const testUnlocked = computed(() => isWatched.value || apiFailed.value)

const videoId = computed(() => extractVideoId(props.item.youtubeUrl))

/** Zaxira embed — faqat API yuklanmagan holatda ishlatiladi. */
const fallbackUrl = computed(() =>
  videoId.value ? `https://www.youtube.com/embed/${videoId.value}?rel=0` : null,
)

const host = ref<HTMLElement | null>(null)
let player: YouTubePlayer | null = null

async function mountPlayer(el: HTMLElement, id: string) {
  try {
    const api = await loadYouTubeApi()
    player = new api.Player(el, {
      videoId: id,
      playerVars: { rel: 0, playsinline: 1 },
      events: {
        onStateChange: ({ data }) => {
          isPlaying.value = data === YT_STATE_PLAYING
          // Oxirigacha ko'rilgani «ko'rildi» degani (TZ 10.3, 10.4).
          if (data === YT_STATE_ENDED) progress.markViewed(props.item.id)
        },
      },
    })
  } catch {
    apiFailed.value = true
  }
}

/**
 * Pleyer transkript rejimidan qaytganda konteyner qayta yaratiladi, shuning
 * uchun ulanish `host` o'zgarishini kuzatadi — `onMounted` yetarli emas.
 */
watch(
  [host, videoId],
  ([el, id]) => {
    if (player || !el || !id || apiFailed.value) return
    void mountPlayer(el, id)
  },
  { immediate: true, flush: 'post' },
)

watch(speed, (rate) => player?.setPlaybackRate(rate))

function togglePlay() {
  if (!player) return
  if (isPlaying.value) player.pauseVideo()
  else player.playVideo()
}

onBeforeUnmount(() => {
  player?.destroy()
  player = null
})
</script>

<template>
  <div class="space-y-5">
    <div class="rounded-2xl overflow-hidden bg-black aspect-video border border-[var(--border-default)]">
      <!-- API pleyerni shu elementning O'RNIGA qo'yadi, shuning uchun o'ram kerak -->
      <div v-if="videoId && !apiFailed" class="w-full h-full">
        <div ref="host" class="w-full h-full" />
      </div>

      <iframe
        v-else-if="fallbackUrl"
        :src="fallbackUrl"
        :title="item.titleUz"
        class="w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowfullscreen
      />

      <div v-else class="w-full h-full flex items-center justify-center text-white/70 text-sm">
        {{ t('player.unavailable') }}
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Pauza / ijro (TZ 10.3) — faqat API pleyeri ishlaganda -->
      <button
        v-if="videoId && !apiFailed"
        type="button"
        :aria-pressed="isPlaying"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] text-sm font-bold hover:bg-[var(--brand)] hover:text-[var(--fg-on-brand)] transition-colors cursor-pointer"
        @click="togglePlay"
      >
        <component :is="isPlaying ? Pause : Play" class="w-4 h-4" aria-hidden="true" />
        <span>{{ isPlaying ? t('player.pause') : t('player.play') }}</span>
      </button>


      <!-- Tezlik (TZ 10.3) -->
      <div
        v-if="videoId && !apiFailed"
        class="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] p-0.5"
        role="group"
        :aria-label="t('player.speed')"
      >
        <Gauge class="w-4 h-4 mx-1.5 text-[var(--fg-muted)]" aria-hidden="true" />
        <button
          v-for="s in SPEEDS"
          :key="s.value"
          type="button"
          :aria-pressed="speed === s.value"
          class="px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer"
          :class="speed === s.value ? 'bg-[var(--brand)] text-[var(--fg-on-brand)]' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'"
          @click="speed = s.value"
        >
          {{ t(s.labelKey) }}
        </button>
      </div>

    </div>

    <!--
      Transkript (TZ 10.3). Avval u videoni ALMASHTIRARDI va buning uchun
      alohida tugma bor edi; endi shunchaki pleyer ostida yig'ilgan holda
      turadi — kerak bo'lsa ochiladi, video esa joyida qoladi.
    -->
    <details v-if="item.transcriptText" class="rounded-2xl bg-[var(--surface-subtle)] p-4">
      <summary class="cursor-pointer text-sm font-bold text-[var(--fg)]">
        {{ t('player.transcript') }}
      </summary>
      <p class="mt-3 max-h-96 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-[var(--fg-muted)]">
        {{ item.transcriptText }}
      </p>
    </details>

    <!-- TZ 10.4: test video oxirigacha ko'rilgach ochiladi -->
    <div
      v-if="linkedTest"
      class="pt-4 border-t border-[var(--border-default)] text-center space-y-2"
    >
      <p class="text-sm text-[var(--fg-muted)]">
        {{ testUnlocked ? t('reader.testPrompt') : t('player.watchToEnd') }}
      </p>
      <router-link
        v-if="testUnlocked"
        :to="`/tests/${linkedTest.id}`"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold hover:opacity-90 transition-all"
      >
        <Award class="w-5 h-5" aria-hidden="true" />
        <span>{{ t('reader.goToTest') }}</span>
      </router-link>
      <span
        v-else
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--surface-muted)] text-[var(--fg-subtle)] font-bold cursor-not-allowed"
        aria-disabled="true"
      >
        <Award class="w-5 h-5" aria-hidden="true" />
        <span>{{ t('reader.goToTest') }}</span>
      </span>
    </div>
  </div>
</template>
