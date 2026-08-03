<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * To'g'ri javob uchun konfetti (TZ 9.1).
 *
 * Kutubxonasiz — 40 ta absolyut joylashgan bo'lakcha CSS animatsiyasi bilan.
 * Bolalar auditoriyasi uchun mukofot signali, shuning uchun ovoz yoki
 * modal emas: kontentni to'smaydi va bosishni kutmaydi.
 *
 * Harakat kamaytirilgan bo'lsa UMUMAN ko'rsatilmaydi — bu foydalanuvchi aynan
 * so'ragan narsa (TZ 12.1 ruhida).
 */
const props = defineProps<{ trigger: number }>()

const settings = useSettingsStore()
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const COLORS = ['#0D9488', '#D97706', '#BE123C', '#4338CA', '#7E22CE', '#047857']

const pieces = computed(() =>
  Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    duration: 1.1 + Math.random() * 0.9,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 6,
    rotate: Math.random() * 360,
  })),
)

watch(
  () => props.trigger,
  (n) => {
    if (!n || settings.reducedMotion === true) return
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (visible.value = false), 2200)
  },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div v-if="visible" class="confetti" aria-hidden="true">
    <span
      v-for="p in pieces"
      :key="p.id"
      class="piece"
      :style="{
        left: `${p.left}%`,
        width: `${p.size}px`,
        height: `${p.size * 1.6}px`,
        backgroundColor: p.color,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.duration}s`,
        transform: `rotate(${p.rotate}deg)`,
      }"
    />
  </div>
</template>

<style scoped>
.confetti {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 20;
}

.piece {
  position: absolute;
  top: -5%;
  border-radius: 2px;
  animation-name: fall;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(420px) rotate(540deg);
    opacity: 0;
  }
}
</style>
