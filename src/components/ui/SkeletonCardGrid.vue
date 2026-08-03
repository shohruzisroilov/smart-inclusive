<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Skeleton from './Skeleton.vue'

/**
 * Kartochka ro'yxatlari uchun yuklanish holati.
 *
 * Shakli haqiqiy kartochkaga mos — rasm joyi, sarlavha, ikki qator matn —
 * shunda ma'lumot kelganda sahifa «sakramaydi».
 */
withDefaults(
  defineProps<{
    count?: number
    /** Kartochka tepasida rasm/ikonka joyi bo'ladimi. */
    media?: boolean
    /** `3` — standart ro'yxatlar, `2` — kengroq kartochkalar. */
    columns?: 2 | 3
  }>(),
  { count: 6, media: true, columns: 3 },
)

const { t } = useI18n()
</script>

<template>
  <div role="status" aria-live="polite">
    <span class="sr-only">{{ t('common.loading') }}</span>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-6"
      :class="columns === 3 ? 'lg:grid-cols-3' : ''"
    >
      <div
        v-for="i in count"
        :key="i"
        class="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] space-y-4"
      >
        <Skeleton v-if="media" class="h-40 w-full rounded-2xl" />
        <Skeleton class="h-6 w-3/4" />
        <div class="space-y-2">
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-5/6" />
        </div>
        <Skeleton class="h-3 w-24" />
      </div>
    </div>
  </div>
</template>
