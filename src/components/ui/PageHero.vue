<script setup lang="ts">
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
  }>(),
  { subtitle: undefined, eyebrow: undefined },
)

const tab = `var(--tab-${props.accent})`
</script>

<template>
  <!--
    Balandlik ataylab tejalgan: ro'yxat sahifalarida asosiy narsa — kartochkalar,
    sarlavha esa ular oldida turgan bir necha qator. Tasma endi alohida qator
    emas, sarlavhaning YONIDA vertikal chiziq bo'lib turadi.
  -->
  <header class="flex items-start gap-4" :style="{ '--tab-color': tab }">
    <div
      class="mt-1.5 w-1.5 shrink-0 self-stretch rounded-full"
      :style="{ backgroundColor: 'var(--tab-color)' }"
      aria-hidden="true"
    />

    <div class="space-y-1.5">
      <p v-if="eyebrow" class="si-eyebrow" :style="{ color: 'var(--tab-color)' }">
        {{ eyebrow }}
      </p>

      <h1 class="font-display text-2xl font-extrabold text-[var(--fg)] sm:text-3xl lg:text-4xl">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="max-w-2xl text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>
