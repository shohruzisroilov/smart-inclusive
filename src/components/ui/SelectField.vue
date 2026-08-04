<script setup lang="ts">
import { computed, useId, type Component } from 'vue'
import { ChevronDown } from '@lucide/vue'

/**
 * Ochiq saytdagi barcha ochiluvchi ro'yxatlar.
 *
 * ICHIDA NATIVE `<select>` — ataylab, custom dropdown emas:
 *
 *   - TZ 1.3 bo'yicha asosiy qurilma PLANSHET. Native select u yerda
 *     operatsion tizimning katta tanlash oynasini ochadi — barmoq bilan
 *     bosish uchun har qanday custom ro'yxatdan qulayroq.
 *   - Ekran o'quvchilar va klaviatura navigatsiyasi (harf bosib o'tish,
 *     Home/End) tekinga keladi. Custom `role="listbox"` da bularning
 *     hammasini qaytadan va xatosiz yozish kerak bo'lardi.
 *   - Inklyuziv platforma uchun bu qulaylikdan voz kechish noto'g'ri
 *     savdo bo'lardi.
 *
 * Ko'rinish esa to'liq boshqariladi: native strelka olib tashlanadi
 * (`appearance-none`), o'rniga o'zimizniki qo'yiladi.
 *
 * `color-scheme` — nozik, lekin muhim detal: usiz qorong'i mavzuda
 * OCHILGAN ro'yxat oq bo'lib qolardi (uni CSS bilan bo'yab bo'lmaydi,
 * u OS tomonidan chiziladi). Bu xossa OS ga mavzuni aytadi.
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
    /** Tanlanmagan holat uchun — tanlab bo'lmaydigan birinchi qator. */
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
const errorId = `${id}-error`

const hasError = computed(() => Boolean(props.error))

/**
 * Joriy qiymat variantlar orasida yo'q — demak «hali tanlanmagan».
 *
 * Formalar bo'sh holatni har xil ifodalaydi: `regionId` uchun bu `0`, matnli
 * filtrlar uchun `''`. Shuning uchun placeholder varianti QAT'IY `""` emas,
 * aynan shu qiymat bilan chiqadi — aks holda brauzer hech qaysi variantni
 * tanlay olmay, select bo'sh ko'rinardi.
 */
const isUnset = computed(() => !props.options.some((o) => String(o.value) === String(props.modelValue)))

/**
 * Native select qiymatni HAR DOIM satr qilib qaytaradi. Variantlar raqamli
 * bo'lsa (masalan `regionId`), uni songa qaytarmasak `v-model` tipi buziladi
 * va taqqoslashlar jimgina yiqiladi.
 */
function onChange(event: Event) {
  const raw = (event.target as HTMLSelectElement).value
  const match = props.options.find((o) => String(o.value) === raw)
  emit('update:modelValue', match ? match.value : raw)
}
</script>

<template>
  <div class="space-y-1.5">
    <label
      :for="id"
      class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5"
      :class="{ 'sr-only': hideLabel }"
    >
      <component v-if="icon" :is="icon" class="w-3.5 h-3.5 text-[var(--brand)]" aria-hidden="true" />
      <span>{{ label }}</span>
      <span v-if="required" class="text-red-500" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <select
        :id="id"
        :value="String(modelValue)"
        :disabled="disabled"
        :required="required"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? errorId : undefined"
        class="w-full appearance-none min-h-[var(--tap-target-min)] pl-4 pr-11 py-3 rounded-xl border bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--fg)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:bg-[var(--surface)] focus:border-[var(--brand)]"
        :class="hasError ? 'border-red-500' : 'border-[var(--border-default)]'"
        @change="onChange"
      >
        <option v-if="placeholder && isUnset" :value="String(modelValue)" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="String(option.value)"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <ChevronDown
        class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)] pointer-events-none"
        aria-hidden="true"
      />
    </div>

    <span v-if="hasError" :id="errorId" class="text-xs text-red-500 font-medium block">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
/* Ochilgan ro'yxatni OS chizadi — mavzuni faqat shu xossa orqali aytish
   mumkin. Usiz qorong'i rejimda ro'yxat oq bo'lib qolardi. */
select {
  color-scheme: light;
}

:global(:root[data-theme='dark']) select {
  color-scheme: dark;
}
</style>
