<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  Video,
  ShieldCheck,
  Home,
  FileText,
  ClipboardCheck,
  ArrowRight,
} from '@lucide/vue'
import PageHero from '@/components/ui/PageHero.vue'

const { t } = useI18n()

/*
 * TZ 6 da hab yetti plitkadan iborat. «O'qitish vizardi» va «Platforma
 * taqdimoti» bu yerda YO'Q: ular `Slide/GetList` ga tayanardi, bekend esa unga
 * 401 qaytaradi (`services.ts` dagi izoh) — mavjud bo'lmagan sahifaga plitka
 * qo'yish foydalanuvchini bo'sh ekranga olib borardi.
 *
 * Plitkalar rangi bu yerda YO'Q: bularning hammasi bitta bo'limning ichki
 * sahifalari, shuning uchun rang ham bitta — «ota-onalar» tasmasi. Ilgari
 * har bir plitkaga alohida yorqin gradient berilgandi va bo'lim bir necha
 * xil rangda ko'rinib, kartochkadagi rang belgisining ma'nosini yo'qotardi.
 */
const cards = [
  {
    title: 'sections.hubTests',
    desc: 'sections.hubTestsDesc',
    icon: ClipboardCheck,
    link: '/for-parents/tests',
  },
  {
    title: 'sections.hubLegal',
    desc: 'sections.hubLegalDesc',
    icon: ShieldCheck,
    link: '/for-parents/legal',
  },
  {
    title: 'sections.hubVideos',
    desc: 'sections.hubVideosDesc',
    icon: Video,
    link: '/for-parents/videos',
  },
  {
    title: 'sections.hubArticles',
    desc: 'sections.hubArticlesDesc',
    icon: FileText,
    link: '/for-parents/articles',
  },
  {
    title: 'sections.hubHomeEd',
    desc: 'sections.hubHomeEdDesc',
    icon: Home,
    link: '/for-parents/home-education',
  },
]
</script>

<template>
  <div class="pt-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- Hero Banner -->
    <PageHero
      accent="parents"
      :title="t('sections.parentsHubTitle')"
    />

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link
        v-for="(card, idx) in cards"
        :key="idx"
        :to="card.link"
        class="si-card si-card-interactive si-card-tabbed group gap-4 p-6 sm:p-8"
        style="--tab-color: var(--tab-parents)"
      >
        <div
          class="flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--fg-on-brand)]"
          style="background-color: var(--tab-parents)"
        >
          <component :is="card.icon" class="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <h3 class="font-display text-xl font-bold text-[var(--fg)] sm:text-2xl">
            {{ t(card.title) }}
          </h3>
          <p class="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
            {{ t(card.desc) }}
          </p>
        </div>
        <span
          class="mt-auto flex items-center gap-1 pt-2 text-sm font-bold"
          style="color: var(--tab-parents)"
        >
          {{ t('sections.more') }}
          <ArrowRight
            class="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </router-link>
    </div>
  </div>
</template>
