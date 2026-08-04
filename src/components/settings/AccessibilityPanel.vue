<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { PersonStanding, Sun, Moon, Eye, Palette, X, Minus, Plus } from '@lucide/vue'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useModalBehavior } from '@/composables/useModalBehavior'
import { FONT_SCALES, type FontScale, type ThemeMode } from '@/types/settings'

withDefaults(
  defineProps<{
    /** `compact` — headerda ikonka; `list` — mobil menyuda matn bilan. */
    variant?: 'compact' | 'list'
  }>(),
  { variant: 'compact' },
)

const { t } = useI18n()
const settings = useSettingsStore()

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const titleId = useId()

useModalBehavior(isOpen, panelRef, () => (isOpen.value = false))

const themeOptions: { value: ThemeMode; icon: typeof Sun; labelKey: string }[] = [
  { value: 'light', icon: Sun, labelKey: 'a11y.themeLight' },
  { value: 'dark', icon: Moon, labelKey: 'a11y.themeDark' },
  { value: 'high-contrast', icon: Eye, labelKey: 'a11y.themeHighContrast' },
  { value: 'monochrome', icon: Palette, labelKey: 'a11y.themeMonochrome' },
]

const currentIndex = computed(() => FONT_SCALES.indexOf(settings.fontScale))
const canDecrease = computed(() => currentIndex.value > 0)
const canIncrease = computed(
  () => currentIndex.value !== -1 && currentIndex.value < FONT_SCALES.length - 1,
)

function stepFont(delta: -1 | 1) {
  const next = FONT_SCALES[currentIndex.value + delta] as FontScale | undefined
  if (next !== undefined) settings.fontScale = next
}
</script>

<template>
  <button
    type="button"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    :aria-label="t('a11y.accessibilitySettings')"
    :title="t('a11y.accessibilitySettings')"
    class="flex items-center rounded-lg text-[var(--fg)] transition-colors hover:bg-[var(--surface-muted)]"
    :class="
      variant === 'list'
        ? 'w-full min-h-[var(--tap-target-min)] gap-3 px-4 text-base font-medium'
        : 'tap-target justify-center'
    "
    @click="isOpen = true"
  >
    <PersonStanding class="h-6 w-6 shrink-0" aria-hidden="true" />
    <span v-if="variant === 'list'">{{ t('a11y.accessibilitySettings') }}</span>
  </button>

  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[var(--z-overlay)] flex justify-end">
      <div
        class="fixed inset-0 bg-[var(--overlay)] animate-in fade-in duration-200"
        aria-hidden="true"
        @click="isOpen = false"
      />

      <div
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        class="relative z-[var(--z-drawer)] h-full w-[min(34rem,95vw)] flex flex-col bg-[var(--surface)] border-l border-[var(--border-default)] p-5 md:p-6 shadow-xl animate-in slide-in-from-right duration-300 ease-out"
      >
        <div
          class="flex items-center justify-between mb-4 border-b border-[var(--border-default)] pb-3"
        >
          <h2 :id="titleId" class="text-lg md:text-xl font-black text-[var(--fg)] font-display">
            {{ t('a11y.accessibilitySettings') }}
          </h2>
          <button
            type="button"
            class="tap-target flex items-center justify-center rounded-lg text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--fg)]"
            @click="isOpen = false"
          >
            <X class="h-6 w-6" aria-hidden="true" />
            <span class="sr-only">{{ t('common.close') }}</span>
          </button>
        </div>

        <div class="flex-1 flex flex-col overflow-y-auto overflow-x-hidden px-1 py-1 gap-4 w-full">
          <!-- 1. Mavzular -->
          <div class="space-y-2">
            <h3
              class="text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider flex items-center gap-2"
            >
              <Palette class="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
              {{ t('a11y.theme') }}
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="opt in themeOptions"
                :key="opt.value"
                type="button"
                :aria-pressed="settings.theme === opt.value"
                class="flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                :class="
                  settings.theme === opt.value
                    ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)]'
                    : 'border-[var(--border-default)] text-[var(--fg)] hover:bg-[var(--surface-muted)]'
                "
                @click="settings.theme = opt.value"
              >
                <component :is="opt.icon" class="h-4 w-4" aria-hidden="true" />
                <span>{{ t(opt.labelKey) }}</span>
              </button>
            </div>
          </div>

          <!-- 2. Matn o'lchami -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3
                class="text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider flex items-center gap-1.5"
              >
                <span class="text-lg font-black leading-none">A</span>
                <span>{{ t('a11y.fontScale') }}</span>
              </h3>
              <span class="text-base font-black text-[var(--brand)]">
                {{ Math.round(settings.fontScale * 100) }}%
              </span>
            </div>

            <div
              class="flex items-center justify-between gap-3 bg-[var(--surface-muted)] p-2 rounded-xl border border-[var(--border-default)] w-full"
            >
              <button
                type="button"
                :disabled="!canDecrease"
                aria-label="Matn o'lchamini kichiklashtirish"
                class="tap-target w-10 h-10 rounded-lg bg-[var(--surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--fg)] transition-all hover:bg-[var(--brand-subtle)] hover:text-[var(--brand)] disabled:opacity-40 disabled:cursor-not-allowed"
                @click="stepFont(-1)"
              >
                <Minus class="h-4 w-4" aria-hidden="true" />
              </button>

              <div class="flex-1 px-3 flex items-center justify-between gap-1 select-none">
                <div
                  v-for="(scale, i) in FONT_SCALES"
                  :key="scale"
                  class="h-2.5 rounded-full flex-1 transition-all"
                  :class="i <= currentIndex ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]'"
                />
              </div>

              <button
                type="button"
                :disabled="!canIncrease"
                aria-label="Matn o'lchamini kattalashtirish"
                class="tap-target w-10 h-10 rounded-lg bg-[var(--surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--fg)] transition-all hover:bg-[var(--brand-subtle)] hover:text-[var(--brand)] disabled:opacity-40 disabled:cursor-not-allowed"
                @click="stepFont(1)"
              >
                <Plus class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- 3 & 4. Disleksiya va harakat -->
          <div class="flex flex-col gap-2.5 border-t border-[var(--border-default)] pt-4">
            <div
              class="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border-default)] gap-4"
            >
              <div class="space-y-0.5">
                <span class="text-sm font-bold text-[var(--fg)] block select-none">
                  {{ t('a11y.dyslexiaMode') }}
                </span>
                <span class="text-[10px] text-[var(--fg-muted)] leading-tight block">
                  Disleksiyali bolalar uchun maxsus qulay shrift.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="settings.dyslexicFont"
                :aria-label="t('a11y.dyslexiaMode')"
                class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors"
                :class="settings.dyslexicFont ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]'"
                @click="settings.dyslexicFont = !settings.dyslexicFont"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
                  :class="settings.dyslexicFont ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div
              class="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border-default)] gap-4"
            >
              <div class="space-y-0.5">
                <span class="text-sm font-bold text-[var(--fg)] block select-none">
                  {{ t('a11y.reducedMotion') }}
                </span>
                <span class="text-[10px] text-[var(--fg-muted)] leading-tight block">
                  Tezkor animatsiyalar va harakatlarni kamaytiradi.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="settings.reducedMotion === true"
                :aria-label="t('a11y.reducedMotion')"
                class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors"
                :class="settings.reducedMotion ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]'"
                @click="settings.reducedMotion = settings.reducedMotion ? null : true"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
                  :class="settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>

          <!-- 5. Bekor qilish -->
          <div class="pt-2 mt-auto border-t border-[var(--border-default)]">
            <button
              type="button"
              class="w-full flex items-center justify-center min-h-[var(--tap-target-min)] bg-[var(--surface-muted)] text-[var(--fg)] hover:opacity-80 font-bold text-sm rounded-xl transition-all"
              @click="settings.reset()"
            >
              {{ t('a11y.resetSettings') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
