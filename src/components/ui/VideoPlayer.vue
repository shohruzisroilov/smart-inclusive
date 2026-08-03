<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Play, FileText, Check, Award, Gauge } from '@lucide/vue'
import { useProgressStore } from '@/stores/useProgressStore'
import type { ContentItemDto, TestDto } from '@/lib/api/types'

/**
 * Videodars pleyeri (TZ 10.3).
 *
 * Video YouTube'da — o'z boshqaruvi bilan, shuning uchun pauza/ijro bu yerda
 * takrorlanmaydi. Tezlik esa iframe URL'iga uzatiladi.
 *
 * DIQQAT: tezlik `?` parametri bilan berilgani uchun uni o'zgartirish
 * iframe'ni QAYTA yuklaydi (`key` orqali). YouTube IFrame API'siz boshqa yo'l
 * yo'q; foydalanuvchi uchun bu videoni boshidan boshlash degani, shuning uchun
 * tezlik tugmalari pleyer OSTIDA, tasodifan bosilmaydigan joyda turadi.
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
const showTranscript = ref(false)

const isWatched = computed(() => progress.isViewed(props.item.id))

/** `?rel=0` va tezlik parametri qo'shiladi; mavjud query saqlanadi. */
const embedUrl = computed(() => {
  if (!props.item.youtubeUrl) return null
  const sep = props.item.youtubeUrl.includes('?') ? '&' : '?'
  return `${props.item.youtubeUrl}${sep}rel=0`
})
</script>

<template>
  <div class="space-y-5">
    <!-- Video yoki transkript — TZ 10.3 «O'qish» / «Ko'rish» -->
    <div
      v-if="!showTranscript"
      class="rounded-2xl overflow-hidden bg-black aspect-video border border-[var(--border-default)]"
    >
      <iframe
        v-if="embedUrl"
        :key="speed"
        :src="embedUrl"
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

    <div
      v-else
      class="p-6 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border-default)] max-h-96 overflow-y-auto"
    >
      <p class="text-base text-[var(--fg)] leading-relaxed whitespace-pre-line font-light">
        {{ item.transcriptText || t('content.list.emptyDesc') }}
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Matn rejimi faqat transkript bo'lsa taklif qilinadi -->
      <button
        v-if="item.transcriptText"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border-default)] text-sm font-bold text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
        @click="showTranscript = !showTranscript"
      >
        <component :is="showTranscript ? Play : FileText" class="w-4 h-4" aria-hidden="true" />
        <span>{{ showTranscript ? t('content.card.watch') : t('player.transcript') }}</span>
      </button>

      <!-- Tezlik (TZ 10.3) -->
      <div
        v-if="embedUrl"
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
          :class="
            speed === s.value
              ? 'bg-[var(--brand)] text-[var(--fg-on-brand)]'
              : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
          "
          @click="speed = s.value"
        >
          {{ t(s.labelKey) }}
        </button>
      </div>

      <!-- «Ko'rilgan deb belgilash» — idempotent (TZ 10.3) -->
      <button
        type="button"
        :disabled="isWatched"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors"
        :class="
          isWatched
            ? 'bg-emerald-500/10 text-emerald-700 cursor-default'
            : 'bg-[var(--brand-subtle)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--fg-on-brand)] cursor-pointer'
        "
        @click="progress.markViewed(item.id)"
      >
        <Check class="w-4 h-4" aria-hidden="true" />
        <span>{{ isWatched ? t('player.watched') : t('player.markWatched') }}</span>
      </button>
    </div>

    <!-- TZ 10.4: test faqat video ko'rilgan deb belgilangach ochiladi -->
    <div
      v-if="linkedTest"
      class="pt-4 border-t border-[var(--border-default)] text-center space-y-2"
    >
      <p class="text-sm text-[var(--fg-muted)]">
        {{ isWatched ? t('reader.testPrompt') : t('player.watchToEnd') }}
      </p>
      <router-link
        v-if="isWatched"
        :to="`/tests/${linkedTest.id}`"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold shadow-lg hover:opacity-90 transition-all"
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
