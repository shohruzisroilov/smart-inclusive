<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Phone, Check } from '@lucide/vue'
import { TRUST_PHONE, TRUST_PHONE_TEL } from '@/lib/constants/contact'

/**
 * Header ustidagi ishonch raqami paneli (TZ 3.1).
 *
 * Bosilganda qurilmaga qarab ikki xil ishlaydi:
 *   - desktopda raqamni buferga nusxalaydi va tasdiq ko'rsatadi;
 *   - planshet/telefonda `tel:` orqali terishni ochadi.
 *
 * Aniqlash `matchMedia('(hover: none)')` bo'yicha — ekran kengligi emas,
 * chunki muhimi teginish qurilmasi ekani (planshet keng bo'lishi mumkin).
 */
const { t } = useI18n()
const copied = ref(false)

const isTouch = computed(
  () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches,
)

async function handleClick(event: MouseEvent) {
  if (isTouch.value) return // `tel:` havolasi o'z ishini qiladi
  event.preventDefault()
  try {
    await navigator.clipboard.writeText(TRUST_PHONE)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* buferga ruxsat berilmagan — havola baribir ishlaydi */
  }
}
</script>

<template>
  <div class="bg-[var(--surface-inverse)] text-[var(--fg-inverse)]">
    <div class="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-end">
      <a
        :href="TRUST_PHONE_TEL"
        class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold hover:opacity-80 transition-opacity"
        :title="isTouch ? undefined : t('trustBar.copyHint')"
        @click="handleClick"
      >
        <component :is="copied ? Check : Phone" class="w-3.5 h-3.5" aria-hidden="true" />
        <span>{{ copied ? t('trustBar.copied') : TRUST_PHONE }}</span>
      </a>
    </div>
  </div>
</template>
