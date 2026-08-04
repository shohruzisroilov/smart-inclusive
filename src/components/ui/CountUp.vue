<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Ko'rish zonasiga kirganda 0 dan haqiqiy qiymatgacha sanaydigan raqam
 * (TZ 4, blok 2).
 *
 * Animatsiya `IntersectionObserver` bilan boshlanadi va BIR MARTA ishlaydi:
 * sahifa aylantirilganda raqamlarning qayta-qayta sanashi chalg'itadi.
 *
 * Harakat kamaytirilgan bo'lsa animatsiya umuman bo'lmaydi — raqam darhol
 * o'z qiymatida chiziladi (WCAG 2.3.3).
 */
const props = defineProps<{ value: number }>()

const { locale } = useI18n()
const settings = useSettingsStore()

const DURATION_MS = 1400

const shown = ref(0)
const host = ref<HTMLElement | null>(null)

const formatted = computed(() => shown.value.toLocaleString(locale.value))

let observer: IntersectionObserver | null = null
let frame = 0

function animate() {
  const start = performance.now()
  const target = props.value

  function step(now: number) {
    const progress = Math.min((now - start) / DURATION_MS, 1)
    // easeOutCubic — oxiriga borib sekinlashadi, shunda raqam «qo'nadi».
    shown.value = Math.round(target * (1 - Math.pow(1 - progress, 3)))
    if (progress < 1) frame = requestAnimationFrame(step)
  }

  frame = requestAnimationFrame(step)
}

onMounted(() => {
  if (settings.reducedMotion === true || !('IntersectionObserver' in window)) {
    shown.value = props.value
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer?.disconnect()
        observer = null
        animate()
      }
    },
    { threshold: 0.4 },
  )
  if (host.value) observer.observe(host.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <!-- Ekran o'quvchiga oxirgi qiymat beriladi, oraliq raqamlar emas. -->
  <span ref="host" :aria-label="String(value)">
    <span aria-hidden="true">{{ formatted }}</span>
  </span>
</template>
