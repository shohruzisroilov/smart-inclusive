<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Eye } from '@lucide/vue'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Rang ko'rligi rejimi pereklyuchateli (TZ 12.1).
 *
 * TZ uni header'da, til pereklyuchateli yonida alohida tugma sifatida
 * talab qiladi — maxsus imkoniyatlar paneli ichida emas. Sabab shundaki, bu
 * rejim kerak bo'lgan foydalanuvchi uni BIRINCHI ekranda, panelni ochmasdan
 * topa olishi kerak.
 *
 * Tugma mavzuni almashtirmaydi: `data-colorblind` atributi yorug', qorong'i
 * va kontrastli mavzularning ustiga qo'yiladi (`tokens.css`, 5-bo'lim).
 */
withDefaults(defineProps<{ variant?: 'icon' | 'list' }>(), { variant: 'icon' })

const { t } = useI18n()
const settings = useSettingsStore()
</script>

<template>
  <!-- Mobil menyuda — matnli qator -->
  <button
    v-if="variant === 'list'"
    type="button"
    role="switch"
    :aria-checked="settings.colorblind"
    class="w-full px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between gap-3 hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
    @click="settings.toggleColorblind()"
  >
    <span class="flex items-center gap-3">
      <Eye class="w-5 h-5" aria-hidden="true" />
      <span>{{ t('a11y.colorblindMode') }}</span>
    </span>
    <span
      class="px-2.5 py-1 rounded-full text-xs font-bold"
      :class="
        settings.colorblind
          ? 'bg-[var(--brand)] text-[var(--fg-on-brand)]'
          : 'bg-[var(--surface-muted)] text-[var(--fg-muted)]'
      "
    >
      {{ settings.colorblind ? t('a11y.on') : t('a11y.off') }}
    </span>
  </button>

  <!-- Desktop header — ikonka -->
  <button
    v-else
    type="button"
    role="switch"
    :aria-checked="settings.colorblind"
    :aria-label="t('a11y.colorblindMode')"
    :title="t('a11y.colorblindMode')"
    class="p-2.5 rounded-xl border transition-colors cursor-pointer"
    :class="
      settings.colorblind
        ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)]'
        : 'border-[var(--border-default)] text-[var(--fg-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--fg)]'
    "
    @click="settings.toggleColorblind()"
  >
    <Eye class="w-5 h-5" aria-hidden="true" />
  </button>
</template>
