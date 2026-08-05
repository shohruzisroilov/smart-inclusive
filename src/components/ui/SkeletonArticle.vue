<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Skeleton from './Skeleton.vue'

/**
 * Bitta yozuv sahifasi uchun yuklanish holati — detal sahifalar, o'quvchi
 * (reader) va vizardlar shu shaklni ishlatadi.
 */
withDefaults(
  defineProps<{
    /** Tepadagi katta rasm/video joyi. */
    media?: boolean
    /** Matn qatorlari soni. */
    lines?: number
  }>(),
  { media: true, lines: 5 },
)

const { t } = useI18n()
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] space-y-6"
  >
    <span class="sr-only">{{ t('common.loading') }}</span>

    <Skeleton v-if="media" class="w-full h-64 rounded-2xl" />

    <div class="space-y-3">
      <Skeleton class="h-8 w-2/3" />
      <div class="flex items-center gap-4">
        <Skeleton class="h-3 w-28" />
        <Skeleton class="h-3 w-24" />
      </div>
    </div>

    <div class="space-y-2.5">
      <Skeleton
        v-for="i in lines"
        :key="i"
        class="h-3"
        :class="i === lines ? 'w-2/5' : 'w-full'"
      />
    </div>
  </div>
</template>
