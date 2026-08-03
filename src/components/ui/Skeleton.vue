<script setup lang="ts">
/**
 * Yuklanish paytidagi «kulrang blok».
 *
 * O'lchamni chaqiruvchi beradi (`class="h-4 w-32"`) — atributlar avtomatik
 * o'tadi. `aria-hidden`, chunki bu bezak: e'lonni o'rab turgan
 * `role="status"` konteyner beradi (`SkeletonCardGrid`, `SkeletonArticle`).
 *
 * Harakatni kamaytirish yoqilganda `animate-pulse` avtomatik to'xtaydi —
 * `tokens.css` dagi `[data-reduced-motion="true"] *` qoidasi hisobiga.
 */
withDefaults(defineProps<{ circle?: boolean }>(), { circle: false })
</script>

<template>
  <div
    aria-hidden="true"
    class="animate-pulse bg-[var(--surface-muted)]"
    :class="circle ? 'rounded-full' : 'rounded-lg'"
  />
</template>
