<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch, type Component } from 'vue'
import { Check, ChevronDown } from '@lucide/vue'

/**
 * Ochiq saytdagi barcha ochiluvchi ro'yxatlar.
 *
 * NATIVE `<select>` EMAS. Ilgari shu yerda native element turardi va uning
 * afzalligi bor edi — klaviatura, harf bosib qidirish, ekran o'quvchi
 * tekinga kelardi. Lekin OCHILGAN ro'yxatni operatsion tizim chizadi va uni
 * CSS bilan bo'yab bo'lmaydi: saytning qolgan qismi qanday ko'rinishidan
 * qat'i nazar, ro'yxat tizimning ko'k ajratmasi bilan ochilardi.
 *
 * Shuning uchun bu yerda `combobox` + `listbox` naqshi qo'lda yozilgan.
 * Native element bergan hamma narsani qaytarish SHART, aks holda almashtirish
 * inklyuziv platforma uchun orqaga qadam bo'lardi:
 *
 *   - fokus tugmada QOLADI, faol variant `aria-activedescendant` orqali
 *     e'lon qilinadi — ekran o'quvchi uchun standart yo'l;
 *   - strelkalar, Home/End, Enter/Bo'shliq, Escape;
 *   - harf bosib o'tish (type-ahead), native'dagi kabi;
 *   - ro'yxat `Teleport` bilan `body` ga chiqariladi va `fixed` joylashadi —
 *     aks holda uni ota elementning `overflow: hidden` i qirqib qo'yardi;
 *   - pastda joy yetmasa yuqoriga ochiladi.
 */
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: SelectOption[]
    label?: string
    /** Tanlanmagan holat uchun ko'rsatiladigan yozuv. */
    placeholder?: string
    icon?: Component
    required?: boolean
    disabled?: boolean
    error?: string
    /** Yorliqni yashiradi, lekin ekran o'quvchiga qoldiradi. */
    hideLabel?: boolean
  }>(),
  {
    label: undefined,
    placeholder: undefined,
    icon: undefined,
    required: false,
    disabled: false,
    error: undefined,
    hideLabel: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

const id = useId()
const labelId = `${id}-label`
const listboxId = `${id}-listbox`
const errorId = `${id}-error`
const optionId = (index: number) => `${id}-option-${index}`

const trigger = ref<HTMLButtonElement | null>(null)
const listbox = ref<HTMLElement | null>(null)

const isOpen = ref(false)
/** Klaviatura bilan ustida turgan variant — tanlangan bilan bir xil emas. */
const activeIndex = ref(-1)

const hasError = computed(() => Boolean(props.error))

const selectedIndex = computed(() =>
  props.options.findIndex((o) => String(o.value) === String(props.modelValue)),
)

const selectedLabel = computed(() => props.options[selectedIndex.value]?.label ?? '')

// ---------------------------------------------------------------------------
// Joylashuv
// ---------------------------------------------------------------------------

const popupStyle = ref<Record<string, string>>({})

/**
 * Ro'yxat tugmaga nisbatan joylashtiriladi. `fixed` bo'lgani uchun sahifa
 * aylantirilganda qayta hisoblanadi — aks holda ro'yxat joyida qolib,
 * tugmadan uzilib ketardi.
 */
function position() {
  const el = trigger.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const maxHeight = 288
  const openUp = spaceBelow < Math.min(maxHeight, 200) && spaceAbove > spaceBelow

  popupStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight: `${Math.max(120, Math.min(maxHeight, openUp ? spaceAbove - 12 : spaceBelow - 12))}px`,
    ...(openUp
      ? { bottom: `${window.innerHeight - rect.top + 6}px` }
      : { top: `${rect.bottom + 6}px` }),
  }
}

// ---------------------------------------------------------------------------
// Ochish / yopish
// ---------------------------------------------------------------------------

function open() {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : firstEnabled()
  position()
  void nextTick(scrollActiveIntoView)
}

function close() {
  isOpen.value = false
  activeIndex.value = -1
}

function toggle() {
  isOpen.value ? close() : open()
}

function select(index: number) {
  const option = props.options[index]
  if (!option || option.disabled) return
  emit('update:modelValue', option.value)
  close()
  trigger.value?.focus()
}

// ---------------------------------------------------------------------------
// Klaviatura
// ---------------------------------------------------------------------------

function firstEnabled(): number {
  return props.options.findIndex((o) => !o.disabled)
}

/** O'chirilgan variantlarni sakrab o'tadi. */
function move(step: 1 | -1) {
  const total = props.options.length
  if (total === 0) return
  let next = activeIndex.value
  for (let i = 0; i < total; i++) {
    next = (next + step + total) % total
    if (!props.options[next]?.disabled) {
      activeIndex.value = next
      void nextTick(scrollActiveIntoView)
      return
    }
  }
}

function moveTo(edge: 'first' | 'last') {
  const indexes = props.options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0)
  const target = edge === 'first' ? indexes[0] : indexes[indexes.length - 1]
  if (target === undefined) return
  activeIndex.value = target
  void nextTick(scrollActiveIntoView)
}

/**
 * Harf bosib o'tish. Native select'da bu bor va foydalanuvchilar unga
 * o'rgangan: uzun ro'yxatda kerakli qatorga bir necha harf bilan yetiladi.
 */
let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

function onType(char: string) {
  clearTimeout(typeaheadTimer)
  typeahead += char.toLowerCase()
  typeaheadTimer = setTimeout(() => (typeahead = ''), 600)

  const match = props.options.findIndex(
    (o) => !o.disabled && o.label.toLowerCase().startsWith(typeahead),
  )
  if (match < 0) return

  if (isOpen.value) {
    activeIndex.value = match
    void nextTick(scrollActiveIntoView)
  } else {
    select(match)
  }
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      isOpen.value ? move(1) : open()
      return
    case 'ArrowUp':
      event.preventDefault()
      isOpen.value ? move(-1) : open()
      return
    case 'Home':
      if (!isOpen.value) return
      event.preventDefault()
      moveTo('first')
      return
    case 'End':
      if (!isOpen.value) return
      event.preventDefault()
      moveTo('last')
      return
    case 'Enter':
    case ' ':
      event.preventDefault()
      isOpen.value ? select(activeIndex.value) : open()
      return
    case 'Escape':
      if (!isOpen.value) return
      event.preventDefault()
      close()
      return
    case 'Tab':
      // Fokus ketyapti — ro'yxat ochiq qolmasligi kerak.
      close()
      return
    default:
      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        onType(event.key)
      }
  }
}

function scrollActiveIntoView() {
  if (activeIndex.value < 0) return
  const el = document.getElementById(optionId(activeIndex.value))
  el?.scrollIntoView({ block: 'nearest' })
}

// ---------------------------------------------------------------------------
// Tashqariga bosish, aylantirish, o'lcham
// ---------------------------------------------------------------------------

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (trigger.value?.contains(target) || listbox.value?.contains(target)) return
  close()
}

watch(isOpen, (openNow) => {
  if (openNow) {
    document.addEventListener('pointerdown', onPointerDown, true)
    // `capture: true` — ichki elementlar hodisani to'xtatsa ham eshitiladi.
    window.addEventListener('scroll', position, true)
    window.addEventListener('resize', position)
  } else {
    document.removeEventListener('pointerdown', onPointerDown, true)
    window.removeEventListener('scroll', position, true)
    window.removeEventListener('resize', position)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown, true)
  window.removeEventListener('scroll', position, true)
  window.removeEventListener('resize', position)
  clearTimeout(typeaheadTimer)
})
</script>

<template>
  <div class="space-y-1.5">
    <span
      :id="labelId"
      class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--fg)]"
      :class="{ 'sr-only': hideLabel }"
    >
      <component :is="icon" v-if="icon" class="h-3.5 w-3.5 text-[var(--brand-text)]" aria-hidden="true" />
      <span>{{ label }}</span>
      <span v-if="required" class="text-[var(--status-danger)]" aria-hidden="true">*</span>
    </span>

    <button
      :id="id"
      ref="trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-labelledby="`${labelId} ${id}`"
      :aria-activedescendant="isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined"
      :aria-invalid="hasError"
      :aria-describedby="hasError ? errorId : undefined"
      :disabled="disabled"
      class="flex w-full min-h-[var(--tap-target-min)] cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 text-left text-sm font-semibold text-[var(--fg)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      :class="[
        hasError ? 'border-[var(--status-danger)]' : 'border-[var(--border-default)]',
        isOpen ? 'bg-[var(--surface)] border-[var(--brand)]' : 'bg-[var(--surface)]',
      ]"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span :class="{ 'text-[var(--fg-subtle)] font-medium': selectedIndex < 0 }">
        {{ selectedIndex >= 0 ? selectedLabel : (placeholder ?? '') }}
      </span>
      <ChevronDown
        class="h-4 w-4 shrink-0 text-[var(--fg-muted)] transition-transform"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>

    <!-- Ro'yxat `body` ga chiqariladi: filtr paneli yoki modal `overflow`i
         uni qirqib qo'ymasligi uchun. -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        :id="listboxId"
        ref="listbox"
        role="listbox"
        :aria-labelledby="labelId"
        tabindex="-1"
        class="z-[var(--z-modal)] overflow-y-auto rounded-xl border border-[var(--border-default)] bg-[var(--surface)] p-1.5 shadow-[var(--si-shadow-lg)]"
        :style="popupStyle"
      >
        <div
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          :aria-selected="index === selectedIndex"
          :aria-disabled="option.disabled"
          class="flex min-h-[var(--tap-target-min)] cursor-pointer items-center justify-between gap-2 rounded-lg px-3 text-sm font-semibold transition-colors"
          :class="[
            option.disabled && 'cursor-not-allowed opacity-40',
            index === activeIndex && !option.disabled && 'bg-[var(--brand-subtle)]',
            index === selectedIndex ? 'text-[var(--brand-text)]' : 'text-[var(--fg)]',
          ]"
          @click="select(index)"
          @pointermove="!option.disabled && (activeIndex = index)"
        >
          <span>{{ option.label }}</span>
          <Check
            v-if="index === selectedIndex"
            class="h-4 w-4 shrink-0 text-[var(--brand-text)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </Teleport>

    <span v-if="hasError" :id="errorId" class="block text-xs font-medium text-[var(--status-danger)]">
      {{ error }}
    </span>
  </div>
</template>
