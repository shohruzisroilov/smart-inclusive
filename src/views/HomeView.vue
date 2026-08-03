<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Sparkles,
  BookOpen,
  Users,
  HeartHandshake,
  MessageSquare,
  ArrowRight,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { fetchPlatformStats } from '@/lib/api/services'
import type { PlatformStatDto } from '@/lib/api/types'

const { t } = useI18n()
const modalStore = useVolunteerModalStore()
const settings = useSettingsStore()

/**
 * Harakat kamaytirilgan bo'lsa fon videosi umuman yuklanmaydi — 16 MB fayl
 * ham tejaladi. Bunday holatda hero ortidagi gradient ko'rinib turadi.
 */
const showHeroVideo = computed(() => settings.reducedMotion !== true)

const currentSlide = ref(0)
const stats = ref<PlatformStatDto[]>([])

const slides = [
  {
    title: 'home.slide1Title',
    desc: 'home.slide1Desc',
    cta: 'home.slide1Cta',
    link: '/vocabulary' as string | undefined,
    bg: 'from-[#135f70] to-[#1b93a6]',
  },
  {
    title: 'home.slide2Title',
    desc: 'home.slide2Desc',
    cta: 'home.slide2Cta',
    link: '/i-can-do-it' as string | undefined,
    bg: 'from-[#b85e14] to-[#e8933a]',
  },
  {
    title: 'home.slide3Title',
    desc: 'home.slide3Desc',
    cta: 'home.slide3Cta',
    action: 'volunteer',
    link: undefined as string | undefined,
    bg: 'from-[#154e5a] to-[#14768a]',
  },
]

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

onMounted(async () => {
  stats.value = await fetchPlatformStats()
  setInterval(nextSlide, 6000)
})
</script>

<template>
  <div class="space-y-16 pb-20">
    <!-- Hero Carousel -->
    <section class="relative overflow-hidden bg-gradient-to-br from-[#10141a] via-[#1b2027] to-[#154e5a] text-white py-16 sm:py-24">
      <!--
        Fon videosi. Gradient uning ostida qoladi — video yuklangunicha va
        `reducedMotion` yoqilganda o'sha ko'rinadi.

        `muted` SHART: ovozli videoni brauzer avtomatik ijro etmaydi.
        `playsinline` — iOS'da butun ekranga sakramasligi uchun.
        `aria-hidden` — bu bezak, matn ustidagi kontent bilan takrorlanmaydi.
      -->
      <video
        v-if="showHeroVideo"
        class="absolute inset-0 w-full h-full object-cover"
        src="/videos/valyontorlar.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
        tabindex="-1"
      />

      <!-- Matn kontrasti uchun qoraytirgich (WCAG 1.4.3) -->
      <div
        v-if="showHeroVideo"
        class="absolute inset-0 bg-gradient-to-r from-[#0b0f14]/90 via-[#0b0f14]/70 to-[#0b0f14]/40"
        aria-hidden="true"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/10">
            <Sparkles class="w-4 h-4" />
            <span>Smart Inclusive Platformasi</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight text-white">
            {{ t(slides[currentSlide].title) }}
          </h1>

          <p class="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl font-light">
            {{ t(slides[currentSlide].desc) }}
          </p>

          <div class="pt-4 flex flex-wrap items-center gap-4">
            <button
              v-if="slides[currentSlide].action === 'volunteer'"
              type="button"
              class="px-8 py-4 rounded-2xl bg-amber-400 text-slate-900 font-extrabold shadow-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer text-base"
              @click="modalStore.openModal()"
            >
              <HeartHandshake class="w-5 h-5" />
              <span>{{ t(slides[currentSlide].cta) }}</span>
            </button>
            <router-link
              v-else
              :to="slides[currentSlide].link || '/'"
              class="px-8 py-4 rounded-2xl bg-[var(--brand)] text-white font-extrabold shadow-xl hover:bg-[var(--brand-hover)] transition-all flex items-center gap-2 cursor-pointer text-base"
            >
              <span>{{ t(slides[currentSlide].cta) }}</span>
              <ArrowRight class="w-5 h-5" />
            </router-link>

            <div class="flex items-center gap-2 ml-auto sm:ml-0">
              <button
                type="button"
                class="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors cursor-pointer"
                @click="prevSlide"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>
              <button
                type="button"
                class="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors cursor-pointer"
                @click="nextSlide"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation Hub Cards -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <h2 class="text-3xl font-extrabold text-[var(--fg)] font-display">
          {{ t('home.navHeading') }}
        </h2>
        <p class="text-sm text-[var(--fg-muted)]">
          {{ t('home.navDesc') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Dictionary Card -->
        <router-link
          to="/vocabulary"
          class="group p-6 rounded-3xl bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/20 hover:border-teal-500/50 hover:shadow-xl transition-all space-y-4"
        >
          <div class="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <BookOpen class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-teal-600 transition-colors">
              {{ t('home.navDictionary') }}
            </h3>
            <p class="text-xs text-[var(--fg-muted)] mt-1">
              {{ t('home.navDictionaryDesc') }}
            </p>
          </div>
          <div class="pt-2 flex items-center text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
            <span>{{ t('sections.more') }}</span>
            <ArrowRight class="w-4 h-4 ml-1" />
          </div>
        </router-link>

        <!-- Parents Card -->
        <router-link
          to="/for-parents"
          class="group p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 hover:border-amber-500/50 hover:shadow-xl transition-all space-y-4"
        >
          <div class="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <GraduationCap class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-amber-600 transition-colors">
              {{ t('home.navParents') }}
            </h3>
            <p class="text-xs text-[var(--fg-muted)] mt-1">
              {{ t('home.navParentsDesc') }}
            </p>
          </div>
          <div class="pt-2 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
            <span>{{ t('sections.more') }}</span>
            <ArrowRight class="w-4 h-4 ml-1" />
          </div>
        </router-link>

        <!-- Volunteers Card -->
        <router-link
          to="/volunteers"
          class="group p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/50 hover:shadow-xl transition-all space-y-4"
        >
          <div class="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Users class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-blue-600 transition-colors">
              {{ t('home.navVolunteers') }}
            </h3>
            <p class="text-xs text-[var(--fg-muted)] mt-1">
              {{ t('home.navVolunteersDesc') }}
            </p>
          </div>
          <div class="pt-2 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>{{ t('sections.more') }}</span>
            <ArrowRight class="w-4 h-4 ml-1" />
          </div>
        </router-link>

        <!-- Contact Card -->
        <router-link
          to="/contact"
          class="group p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/50 hover:shadow-xl transition-all space-y-4"
        >
          <div class="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <MessageSquare class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-purple-600 transition-colors">
              {{ t('home.navContact') }}
            </h3>
            <p class="text-xs text-[var(--fg-muted)] mt-1">
              {{ t('home.navContactDesc') }}
            </p>
          </div>
          <div class="pt-2 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            <span>{{ t('sections.more') }}</span>
            <ArrowRight class="w-4 h-4 ml-1" />
          </div>
        </router-link>
      </div>
    </section>

    <!-- Platform Stats -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-8 sm:p-12 rounded-3xl bg-[var(--surface-muted)] border border-[var(--border-default)]">
        <div class="text-center max-w-xl mx-auto mb-8">
          <span class="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
            {{ t('trustBar.title') }}
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--fg)] font-display mt-1">
            {{ t('home.statsHeading') }}
          </h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="p-4 space-y-2">
            <div class="text-3xl sm:text-4xl font-extrabold text-[var(--brand)] font-display">1 200+</div>
            <div class="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">{{ t('trustBar.children') }}</div>
          </div>
          <div class="p-4 space-y-2">
            <div class="text-3xl sm:text-4xl font-extrabold text-amber-500 font-display">450+</div>
            <div class="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">{{ t('trustBar.lessons') }}</div>
          </div>
          <div class="p-4 space-y-2">
            <div class="text-3xl sm:text-4xl font-extrabold text-emerald-500 font-display">180+</div>
            <div class="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">{{ t('trustBar.volunteers') }}</div>
          </div>
          <div class="p-4 space-y-2">
            <div class="text-3xl sm:text-4xl font-extrabold text-blue-500 font-display">14</div>
            <div class="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">{{ t('trustBar.regions') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Volunteer CTA Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#135f70] via-[#1b93a6] to-[#0a2932] p-8 sm:p-12 text-white shadow-2xl">
        <div class="relative z-10 max-w-2xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake class="w-4 h-4" />
            <span>{{ t('home.ctaBadge') }}</span>
          </div>

          <h2 class="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            {{ t('home.ctaHeading') }}
          </h2>

          <p class="text-sm sm:text-base text-white/80 leading-relaxed font-light">
            {{ t('home.ctaDesc') }}
          </p>

          <div class="pt-2">
            <button
              type="button"
              class="px-8 py-4 rounded-2xl bg-amber-400 text-slate-900 font-extrabold shadow-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer text-base"
              @click="modalStore.openModal()"
            >
              <HeartHandshake class="w-5 h-5" />
              <span>{{ t('home.ctaJoin') }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
