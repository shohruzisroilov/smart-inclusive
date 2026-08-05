<script setup lang="ts">
import type { Component } from 'vue'

/**
 * Bo'lim sahifalarining sarlavha bloki.
 *
 * Ilgari bu blok 14 ta sahifada QO'LDA takrorlanardi va nusxalar bir-biridan
 * siljib ketgandi — 11 xil gradient, ba'zilari deyarli bir xil. Endi bitta
 * joyda, rang esa `tokens.css` dagi bo'lim tasmasidan olinadi.
 *
 * NEGA ENDI RANGLI PLITA EMAS. Avval sarlavha to'yingan rangli katta
 * to'rtburchak ichida turardi. Ikki muammosi bor edi:
 *   1) Planshetda u ekranning deyarli to'rtdan birini egallardi — asosiy
 *      qurilmada kontentgacha yetib borish uchun ortiqcha aylantirish.
 *   2) Rang saytda ikki xil ma'noda ishlatilar edi: kartochkada «bo'lim
 *      belgisi», bu yerda esa shunchaki fon. Bir belgi — bir ma'no.
 *
 * Endi rang faqat BELGI bo'lib qoladi: sarlavha tepasida qisqa tasma —
 * kartochkalarning yuqori qirrasidagi tasmaning aynan o'zi.
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

const tab = `var(--tab-${props.accent})`
</script>

<template>
  <header class="space-y-4" :style="{ '--tab-color': tab }">
    <!-- Kartochkalardagi tasmaning o'zi, faqat qisqartirilgan bo'lagi -->
    <div class="h-2.5 w-16 rounded-full" :style="{ backgroundColor: 'var(--tab-color)' }" />

    <div class="flex items-start gap-4">
      <div
        v-if="icon"
        class="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[var(--fg-on-brand)]"
        :style="{ backgroundColor: 'var(--tab-color)' }"
      >
        <component :is="icon" class="h-6 w-6" aria-hidden="true" />
      </div>

      <div class="space-y-3">
        <p v-if="eyebrow" class="si-eyebrow" :style="{ color: 'var(--tab-color)' }">
          {{ eyebrow }}
        </p>

        <h1 class="font-display text-3xl font-extrabold text-[var(--fg)] sm:text-4xl lg:text-5xl">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="max-w-2xl text-base leading-relaxed text-[var(--fg-muted)]">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </header>
</template>
