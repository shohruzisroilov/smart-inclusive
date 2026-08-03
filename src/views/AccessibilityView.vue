<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Keyboard, Eye, Type, Contrast, MousePointerClick, Moon } from '@lucide/vue'

const { t } = useI18n()

/** Platformaning qulaylik imkoniyatlari — kartalar uchun. */
const FEATURES = [
  {
    icon: Keyboard,
    title: 'Klaviatura bilan boshqarish',
    description:
      "Barcha interaktiv elementlar faqat klaviatura orqali ishlaydi. Fokus halqasi hech qachon yashirilmaydi.",
  },
  {
    icon: Eye,
    title: "Ekran o'quvchi qo'llab-quvvatlashi",
    description:
      "Semantik teglar, ARIA belgilari va matnli muqobillar bilan sahifalar ekran o'quvchilarga to'g'ri o'qiladi.",
  },
  {
    icon: Contrast,
    title: 'Yetarli rang kontrasti',
    description:
      "Matn va fon ranglari WCAG talablariga mos. Holat hech qachon faqat rang bilan bildirilmaydi — ikonka va matn ham qo'shiladi.",
  },
  {
    icon: Type,
    title: 'Shriftni kattalashtirish',
    description:
      "Interfeys 200% gacha kattalashtirilganda ham buzilmaydi va o'qishga qulay bo'lib qoladi.",
  },
  {
    icon: Moon,
    title: 'Mavzu va harakat sozlamalari',
    description:
      "Yorug', qorong'i, yuqori kontrast va oq-qora rejim tanlash mumkin; harakatlarni kamaytirish ham sozlanadi.",
  },
  {
    icon: MousePointerClick,
    title: 'Katta tegish maydonlari',
    description:
      'Har bir tugma va havola kamida 44px balandlikda — planshet va telefonda barmoq bilan bosish oson.',
  },
]
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <article class="space-y-12">
      <header class="space-y-4">
        <h1
          class="text-3xl sm:text-4xl font-black text-[var(--fg)] font-display tracking-tight leading-tight"
        >
          {{ t('footer.accessibilityStatement') }}
        </h1>
        <p class="text-lg text-[var(--fg-muted)] leading-relaxed font-light">
          Smart Inclusive — inklyuziv ta'lim platformasi. Biz platformadan imkoniyati cheklangan
          foydalanuvchilar ham teng qatnasha olishini asosiy maqsad qilib qo'yganmiz va qulaylikni
          doimiy ravishda yaxshilab boramiz.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display tracking-tight">
          Muvofiqlik darajasi
        </h2>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
          Platforma <strong class="text-[var(--fg)]">WCAG 2.1 AA</strong> darajasiga muvofiq
          bo'lishni maqsad qiladi. Bu — veb-kontent qulayligi bo'yicha xalqaro standart. Sahifalar
          shu talablarni hisobga olgan holda ishlab chiqilmoqda.
        </p>
      </section>

      <section class="space-y-5">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display tracking-tight">
          Qo'llab-quvvatlanadigan imkoniyatlar
        </h2>
        <ul class="grid gap-5 sm:grid-cols-2">
          <li
            v-for="feature in FEATURES"
            :key="feature.title"
            class="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5"
          >
            <div
              class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-subtle)] text-[var(--brand)]"
            >
              <component :is="feature.icon" class="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 class="mb-1.5 text-lg font-bold text-[var(--fg)] font-display">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-[var(--fg-muted)] leading-relaxed font-light">
              {{ feature.description }}
            </p>
          </li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display tracking-tight">
          Ma'lum cheklovlar
        </h2>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
          Ba'zi bo'limlar hali ishlab chiqilmoqda va uchinchi tomon manbalaridan olingan ayrim
          videolarda subtitrlar to'liq bo'lmasligi mumkin. Bunday kamchiliklarni bosqichma-bosqich
          bartaraf etamiz.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display tracking-tight">
          Fikr-mulohaza
        </h2>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
          Agar biror sahifada qulaylik muammosiga duch kelsangiz, bizga xabar bering — tez orada
          tuzatamiz.
        </p>
        <router-link
          to="/contact"
          class="inline-flex min-h-[var(--tap-target-min)] items-center font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-hover)] transition-colors"
        >
          Murojaat qoldirish
        </router-link>
      </section>
    </article>
  </div>
</template>
