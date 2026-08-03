<script setup lang="ts">
import type { Component } from 'vue'

/**
 * Bo'lim sahifalarining yuqoridagi banneri.
 *
 * Ilgari bu blok 14 ta sahifada QO'LDA takrorlanardi va nusxalar bir-biridan
 * siljib ketgandi — 11 xil gradient, ularning ba'zilari deyarli bir xil
 * (`purple-600 -> pink-600` va `purple-500 -> pink-600`). Endi bitta joyda,
 * rang esa `tokens.css` dagi bo'lim aksentidan olinadi.
 *
 * Ranglar chuqurroq qilib tanlangan: eskilarining yarmida oq matn kontrasti
 * WCAG talabidan past edi (`amber-500` ustida 2.15:1).
 */
type Accent =
  | 'vocabulary'
  | 'etiquette'
  | 'ican'
  | 'lessons'
  | 'books'
  | 'comics'
  | 'tests'
  | 'parents'
  | 'volunteers'

const props = withDefaults(
  defineProps<{
    accent: Accent
    title: string
    subtitle?: string
    /**
     * Sarlavha USTIDAGI kichik yorliq. Faqat sarlavhadan BOSHQA ma'lumot
     * bersa beriladi — ilgari to'rt sahifada u sarlavhaning aynan nusxasi
     * edi va hech narsa qo'shmasdi.
     */
    eyebrow?: string
    icon?: Component
  }>(),
  { subtitle: undefined, eyebrow: undefined, icon: undefined },
)

const gradient = `linear-gradient(to right, var(--accent-${props.accent}-from), var(--accent-${props.accent}-to))`
</script>

<template>
  <!--
    Matn rangi `text-white` bilan QOTIRILMAYDI. Yuqori kontrast rejimida
    aksent foni oqarib ketadi va oq matn ko'rinmay qolardi; `--accent-fg`
    o'sha rejimda qora rangga o'tadi. Bolalar matnni ko'ra olmasligi
    shunchaki dizayn nuqsoni emas.
  -->
  <div
    class="p-8 sm:p-12 rounded-3xl shadow-xl space-y-3"
    :style="{ backgroundImage: gradient, color: 'var(--accent-fg)' }"
  >
    <div
      v-if="eyebrow"
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
      :style="{ backgroundColor: 'var(--accent-chip)' }"
    >
      <component :is="icon" v-if="icon" class="w-4 h-4" aria-hidden="true" />
      <span>{{ eyebrow }}</span>
    </div>

    <h1 class="text-3xl sm:text-4xl font-extrabold font-display">{{ title }}</h1>

    <p v-if="subtitle" class="max-w-xl text-sm leading-relaxed font-light opacity-90">
      {{ subtitle }}
    </p>
  </div>
</template>
