<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Sun, Moon } from '@lucide/vue'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Yorug' ↔ qorong'i mavzu tugmasi.
 *
 * Store'da tema `light | dark | system | high-contrast | monochrome` bo'lishi
 * mumkin; bu tugma esa oddiy ikkilik almashtirgich. To'liq tanlov —
 * `AccessibilityPanel` ichida.
 */
withDefaults(
  defineProps<{
    /** `compact` — headerda ikonka; `list` — mobil menyuda matn bilan. */
    variant?: 'compact' | 'list'
  }>(),
  { variant: 'compact' },
)

const { t } = useI18n()
const settings = useSettingsStore()

// Ekran o'quvchiga o'zgarishni e'lon qilish uchun.
const announcement = ref('')

const isDark = computed(() => settings.isDark())
// Yorug'da → oyni ko'rsatamiz (bosilsa qorong'iga); qorong'ida → quyoshni.
const label = computed(() => (isDark.value ? t('a11y.switchToLight') : t('a11y.switchToDark')))
const listLabel = computed(() => (isDark.value ? t('a11y.themeLight') : t('a11y.themeDark')))

function handleToggle() {
  settings.toggleTheme()
  announcement.value = isDark.value ? t('a11y.themeDark') : t('a11y.themeLight')
}
</script>

<template>
  <button
    type="button"
    :aria-pressed="isDark"
    :aria-label="label"
    :title="label"
    class="flex items-center rounded-lg text-[var(--fg)] transition-colors hover:bg-[var(--surface-muted)]"
    :class="
      variant === 'list'
        ? 'w-full min-h-[var(--tap-target-min)] gap-3 px-4 text-base font-medium'
        : 'tap-target justify-center'
    "
    @click="handleToggle"
  >
    <component :is="isDark ? Sun : Moon" class="h-5 w-5 shrink-0" aria-hidden="true" />
    <span v-if="variant === 'list'">{{ listLabel }}</span>
  </button>

  <p role="status" aria-live="polite" class="sr-only">{{ announcement }}</p>
</template>
