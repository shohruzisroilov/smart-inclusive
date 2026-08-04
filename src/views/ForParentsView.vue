<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  GraduationCap,
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
 */
const cards = [
  {
    title: 'sections.hubTests',
    desc: 'sections.hubTestsDesc',
    icon: ClipboardCheck,
    link: '/for-parents/tests',
    color: 'from-rose-500 to-pink-600',
  },
  {
    title: 'sections.hubLegal',
    desc: 'sections.hubLegalDesc',
    icon: ShieldCheck,
    link: '/for-parents/legal',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'sections.hubVideos',
    desc: 'sections.hubVideosDesc',
    icon: Video,
    link: '/for-parents/videos',
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'sections.hubArticles',
    desc: 'sections.hubArticlesDesc',
    icon: FileText,
    link: '/for-parents/articles',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    title: 'sections.hubHomeEd',
    desc: 'sections.hubHomeEdDesc',
    icon: Home,
    link: '/for-parents/home-education',
    color: 'from-purple-500 to-pink-600',
  },
]
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
    <!-- Hero Banner -->
    <PageHero
      accent="parents"
      :title="t('sections.parentsHubTitle')"
      :subtitle="t('sections.parentsHubSubtitle')"
      :eyebrow="t('sections.parentsEyebrow')"
      :icon="GraduationCap"
    />

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link
        v-for="(card, idx) in cards"
        :key="idx"
        :to="card.link"
        class="group p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-amber-500 hover:shadow-xl transition-all space-y-4"
      >
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" :class="card.color">
          <component :is="card.icon" class="w-7 h-7" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-[var(--fg)] font-display group-hover:text-amber-600 transition-colors">
            {{ t(card.title) }}
          </h3>
          <p class="text-sm text-[var(--fg-muted)] mt-1.5 leading-relaxed">
            {{ t(card.desc) }}
          </p>
        </div>
        <div class="pt-2 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
          <span>{{ t('sections.more') }}</span>
          <ArrowRight class="w-4 h-4 ml-1" />
        </div>
      </router-link>
    </div>
  </div>
</template>
