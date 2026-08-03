<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from '@lucide/vue'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { isMascotCollapsed, setMascotCollapsed } from '@/lib/storage/progress'

/**
 * Mini-personaj (TZ 12.2) — SOF DEKORATIV.
 *
 * Syujeti, replikasi va bo'limlarga bog'liq holati yo'q: kursorga "qaraydi",
 * teginilganda qisqa reaksiya beradi, xolos. Biznes-mantiqqa aralashmaydi.
 *
 * Kontent va tugmalarni to'smasligi shart, shuning uchun burchakda va
 * `pointer-events` faqat o'zida.
 */
const { t } = useI18n()
const settings = useSettingsStore()

const collapsed = ref(isMascotCollapsed())
const pupil = ref({ x: 0, y: 0 })
const reacting = ref(false)
const root = ref<HTMLElement | null>(null)
let reactTimer: ReturnType<typeof setTimeout> | undefined

/** Harakat kamaytirilganda ko'z ham, reaksiya ham qotib turadi. */
const isStill = computed(() => settings.reducedMotion === true)

function onPointerMove(event: PointerEvent) {
  if (!root.value || isStill.value) return
  const r = root.value.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const dx = event.clientX - cx
  const dy = event.clientY - cy
  const dist = Math.hypot(dx, dy) || 1
  // Qorachiq ko'z ichida qoladi — 3px dan chiqmaydi.
  const limit = Math.min(3, dist / 40)
  pupil.value = { x: (dx / dist) * limit, y: (dy / dist) * limit }
}

function react() {
  if (isStill.value) return
  reacting.value = true
  clearTimeout(reactTimer)
  reactTimer = setTimeout(() => (reacting.value = false), 600)
}

function collapse() {
  collapsed.value = true
  setMascotCollapsed(true)
}

function expand() {
  collapsed.value = false
  setMascotCollapsed(false)
}

onMounted(() => window.addEventListener('pointermove', onPointerMove, { passive: true }))
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  clearTimeout(reactTimer)
})
</script>

<template>
  <!-- Yig'ilgan holat: kichkina qayta ochish tugmasi -->
  <button
    v-if="collapsed"
    type="button"
    class="fixed bottom-4 right-4 z-40 w-11 h-11 rounded-full bg-[var(--brand)] text-[var(--fg-on-brand)] shadow-lg flex items-center justify-center text-lg font-black cursor-pointer hover:scale-105 transition-transform"
    :aria-label="t('mascot.expand')"
    @click="expand"
  >
    ◕
  </button>

  <div
    v-else
    ref="root"
    class="fixed bottom-4 right-4 z-40 select-none"
    :aria-label="t('mascot.label')"
    role="img"
  >
    <button
      type="button"
      class="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border-default)] text-[var(--fg-muted)] flex items-center justify-center cursor-pointer hover:text-[var(--fg)] transition-colors"
      :aria-label="t('mascot.collapse')"
      @click="collapse"
    >
      <X class="w-3.5 h-3.5" aria-hidden="true" />
    </button>

    <div
      class="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-hover)] shadow-xl flex items-center justify-center gap-1.5 cursor-pointer"
      :class="{ 'mascot-idle': !isStill, 'mascot-react': reacting }"
      @click="react"
      @touchstart.passive="react"
    >
      <span
        v-for="side in ['l', 'r']"
        :key="side"
        class="w-4 h-4 rounded-full bg-white flex items-center justify-center"
      >
        <span
          class="w-1.5 h-1.5 rounded-full bg-slate-900 transition-transform duration-75"
          :style="{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
.mascot-idle {
  animation: bob 3.2s ease-in-out infinite;
}

.mascot-react {
  animation: pop 0.6s ease-out;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.18) rotate(-6deg);
  }
  100% {
    transform: scale(1);
  }
}
</style>
