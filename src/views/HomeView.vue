<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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
  Smile,
  Languages,
  Award,
  Compass,
  PlayCircle,
  Baby,
} from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { fetchContentItems, fetchPlatformStats } from '@/lib/api/services'
import { localizedTitle, routeForContentItem, youtubeThumbnail } from '@/lib/api/content'
import CountUp from '@/components/ui/CountUp.vue'
import type { ContentItemDto, PlatformStatDto } from '@/lib/api/types'

const { t, locale } = useI18n()
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

/**
 * Bo'limlar to'ri — TZ 4, blok 4 aynan SAKKIZ karta so'raydi.
 *
 * Ko'ngillilar bu ro'yxatda ataylab yo'q: unga alohida chaqiriq bloki
 * ajratilgan (TZ 4, blok 5), ya'ni to'rda takrorlanishi ortiqcha bo'lardi.
 *
 * Rang har bir kartaga ALOHIDA tanlanmaydi — u bo'limning o'z tasmasidan
 * (`tokens.css`, 5-bo'lim) olinadi. Ilgari bu yerda sakkizta har xil Tailwind
 * rangi qotirilgandi va bosh sahifa kamalakka o'xshab qolgandi; endi ekrandagi
 * rang saytning qolgan qismidagi rang bilan bir xil ma'noni bildiradi.
 */
const navCards = [
  { link: '/etiquette', icon: Smile, section: 'etiquette', title: 'sections.etiquetteTitle', desc: 'home.navEtiquetteDesc' },
  { link: '/i-can-do-it', icon: Sparkles, section: 'ican', title: 'sections.iCanTitle', desc: 'home.navICanDesc' },
  { link: '/lessons', icon: GraduationCap, section: 'lessons', title: 'sections.lessonsTitle', desc: 'home.navLessonsDesc' },
  { link: '/books', icon: BookOpen, section: 'books', title: 'sections.booksTitle', desc: 'home.navBooksDesc' },
  { link: '/vocabulary', icon: Languages, section: 'vocabulary', title: 'home.navDictionary', desc: 'home.navDictionaryDesc' },
  { link: '/tests', icon: Award, section: 'tests', title: 'sections.testsTitle', desc: 'home.navTestsDesc' },
  { link: '/for-parents', icon: Users, section: 'parents', title: 'home.navParents', desc: 'home.navParentsDesc' },
  { link: '/contact', icon: MessageSquare, section: 'volunteers', title: 'home.navContact', desc: 'home.navContactDesc' },
]

/**
 * «Qanday boshlash kerak» (uch qadam) va «Kimlar uchun» bloklari — sof statik.
 * Bekenddan ma'lumot kelmaydi, shuning uchun ro'yxatlar shu yerda turadi;
 * matnlar esa i18n'da, chunki uch tilda ko'rsatiladi.
 */
const steps = [
  { icon: Compass, title: 'home.step1Title', desc: 'home.step1Desc' },
  { icon: PlayCircle, title: 'home.step2Title', desc: 'home.step2Desc' },
  { icon: Award, title: 'home.step3Title', desc: 'home.step3Desc' },
]

const audiences = [
  {
    icon: Baby,
    title: 'home.forKidsTitle',
    desc: 'home.forKidsDesc',
    cta: 'home.forKidsCta',
    link: '/etiquette',
    section: 'etiquette',
  },
  {
    icon: Users,
    title: 'home.forParentsTitle',
    desc: 'home.forParentsDesc',
    cta: 'home.forParentsCta',
    link: '/for-parents',
    section: 'parents',
  },
  {
    icon: HeartHandshake,
    title: 'home.forVolunteersTitle',
    desc: 'home.forVolunteersDesc',
    cta: 'home.forVolunteersCta',
    link: '/volunteers',
    section: 'volunteers',
  },
]

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

/**
 * Karusel avtomatik aylanadi, lekin harakat kamaytirilgan bo'lsa — yo'q
 * (WCAG 2.2.2: 5 soniyadan uzoq avtomatik harakatni to'xtatib bo'lishi shart).
 * Taymer sahifadan chiqishda albatta tozalanadi, aks holda u fon rejimida
 * ishlab qolaverardi.
 */
let slideTimer: ReturnType<typeof setInterval> | undefined

/**
 * Videolar bloki (TZ 4, blok 3).
 *
 * TZ «turli tumanlardan videolar» deb yozadi, lekin `ContentItemDto` da hudud
 * maydoni YO'Q — shuning uchun kartochkalarda hudud imzosi ko'rsatilmaydi.
 * O'ylab topilgan hudud nomini yozish ma'lumotni soxtalashtirish bo'lardi;
 * bekendga maydon qo'shilgach, imzo shu yerga bir qator bilan qo'shiladi.
 */
const videos = ref<ContentItemDto[]>([])

const HOME_VIDEO_LIMIT = 3

onMounted(async () => {
  if (!settings.reducedMotion) slideTimer = setInterval(nextSlide, 6000)
  const [statList, items] = await Promise.all([fetchPlatformStats(), fetchContentItems()])
  stats.value = statList
  videos.value = items.filter((item) => item.youtubeUrl).slice(0, HOME_VIDEO_LIMIT)
})

onBeforeUnmount(() => {
  if (slideTimer) clearInterval(slideTimer)
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
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[var(--accent-kids-on-dark)] text-xs font-bold uppercase tracking-wider border border-white/10">
            <Sparkles class="w-4 h-4" />
            <span>Smart Inclusive Platformasi</span>
          </div>

          <!--
            Sarlavha va tavsifga QAT'IY joy ajratiladi, shunda karusel
            aylanganda hero balandligi sakramaydi. Slaydlar matni har xil
            uzunlikda: "Men hammasini qila olaman!" — 1 qator,
            "Smart Inclusive platformasiga xush kelibsiz!" — 2 qator.

            Telefonda 3 qator zaxiralanadi: eng uzun sarlavha 30px shriftda
            ikki qatorga sig'maydi va `line-clamp-2` uning oxirini kesib
            tashlardi. Balandlik baribir barqaror — u faqat slayd
            almashganda emas, breakpoint o'zgargandagina o'zgaradi.

            `px` emas, aynan `lh` (qator balandligi) ishlatiladi: foydalanuvchi
            shriftni 200% gacha kattalashtirganda zaxira ham u bilan o'sadi.

            Matn zaxira ichida VERTIKAL MARKAZLASHTIRILADI (`flex items-center`).
            Aks holda qisqa sarlavha tepaga yopishib, ostida bir qatorlik bo'sh
            «teshik» qolardi; markazlashtirilganda bo'shliq tepa va pastga teng
            bo'linib, oddiy oraliqdek ko'rinadi.
          -->
          <!--
            DIQQAT: o'lcham va `leading` klasslari O'RAMDA turishi shart.
            `lh` birligi elementning O'Z shrift metrikasiga tayanadi — agar
            o'ram bazaviy 16px ni meros olsa, `2lh` haqiqiy sarlavha qatoridan
            ancha kichik chiqadi va zaxira umuman ishlamaydi. Sarlavha bu
            qiymatlarni merosga oladi.
          -->
          <div
            class="text-3xl sm:text-4xl lg:text-5xl leading-tight min-h-[3lh] sm:min-h-[2lh] flex items-center"
          >
            <h1 class="font-extrabold font-display tracking-tight text-white line-clamp-3 sm:line-clamp-2">
              {{ t(slides[currentSlide].title) }}
            </h1>
          </div>

          <div class="text-lg sm:text-xl leading-relaxed min-h-[2lh] flex items-center max-w-2xl">
            <p class="text-white/80 font-light line-clamp-2">
              {{ t(slides[currentSlide].desc) }}
            </p>
          </div>

          <div class="pt-4 flex flex-wrap items-center gap-4">
            <button
              v-if="slides[currentSlide].action === 'volunteer'"
              type="button"
              class="px-8 py-4 rounded-2xl bg-[var(--accent-kids-on-dark)] text-[var(--si-neutral-950)] font-extrabold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer text-base"
              @click="modalStore.openModal()"
            >
              <HeartHandshake class="w-5 h-5" />
              <span>{{ t(slides[currentSlide].cta) }}</span>
            </button>
            <router-link
              v-else
              :to="slides[currentSlide].link || '/'"
              class="px-8 py-4 rounded-2xl bg-[var(--brand)] text-white font-extrabold hover:bg-[var(--brand-hover)] transition-all flex items-center gap-2 cursor-pointer text-base"
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

    <!-- Kimlar uchun — uchta yo'nalish, har biri o'z bo'limiga olib boradi -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <h2 class="text-3xl font-extrabold text-[var(--fg)] font-display">
          {{ t('home.audienceHeading') }}
        </h2>
        <p class="text-sm text-[var(--fg-muted)]">{{ t('home.audienceDesc') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link
          v-for="a in audiences"
          :key="a.link"
          :to="a.link"
          class="si-card si-card-interactive si-card-tabbed group gap-4 p-6 sm:p-7"
          :style="{ '--tab-color': `var(--tab-${a.section})` }"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--fg-on-brand)]"
            :style="{ backgroundColor: 'var(--tab-color)' }"
          >
            <component :is="a.icon" class="w-7 h-7" aria-hidden="true" />
          </div>
          <h3 class="text-xl font-bold text-[var(--fg)] font-display">{{ t(a.title) }}</h3>
          <p class="text-sm text-[var(--fg-muted)] leading-relaxed">{{ t(a.desc) }}</p>
          <div
            class="mt-auto flex items-center pt-1 text-sm font-bold"
            :style="{ color: 'var(--tab-color)' }"
          >
            <span>{{ t(a.cta) }}</span>
            <ArrowRight class="w-4 h-4 ml-1" aria-hidden="true" />
          </div>
        </router-link>
      </div>
    </section>

    <!--
      Ishonch raqamlari — adminkadagi «Platforma statistikasi» jadvalidan.
      Jadval bo'sh bo'lsa (hozir aynan shunday) BUTUN blok chizilmaydi: sarlavhasi
      bor, lekin ichi bo'sh ramka soxta taassurot qoldiradi.
    -->
    <section v-if="stats.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div
            v-for="stat in stats"
            :key="stat.id"
            class="p-4 space-y-2"
          >
            <div class="text-3xl sm:text-4xl font-extrabold text-[var(--brand)] font-display">
              <CountUp :value="stat.value" />
            </div>
            <div class="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">
              {{ stat.label || stat.metricKey }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!--
      Videolar (TZ 4, blok 3). Yozuvi bo'lmasa blok umuman chizilmaydi —
      bo'sh sarlavha qoldirmaslik uchun.
    -->
    <section v-if="videos.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div class="space-y-2 max-w-2xl">
          <h2 class="text-3xl font-extrabold text-[var(--fg)] font-display">
            {{ t('home.videosHeading') }}
          </h2>
          <p class="text-sm text-[var(--fg-muted)]">{{ t('home.videosDesc') }}</p>
        </div>
        <router-link
          to="/about-us"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-default)] text-sm font-bold text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
        >
          <span>{{ t('home.videosAll') }}</span>
          <ArrowRight class="w-4 h-4" aria-hidden="true" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="video in videos"
          :key="video.id"
          :to="routeForContentItem(video)"
          class="si-card si-card-interactive group"
        >
          <div class="relative aspect-video overflow-hidden bg-[var(--surface-muted)]">
            <img
              v-if="video.coverImageUrl || youtubeThumbnail(video.youtubeUrl)"
              :src="video.coverImageUrl ?? youtubeThumbnail(video.youtubeUrl)!"
              :alt="localizedTitle(video, locale)"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <span
              class="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors"
            >
              <PlayCircle class="w-14 h-14 text-white drop-shadow" aria-hidden="true" />
            </span>
          </div>
          <div class="p-5 space-y-1.5">
            <h3
              class="text-base font-bold text-[var(--fg)] font-display group-hover:text-[var(--brand)] transition-colors line-clamp-2"
            >
              {{ localizedTitle(video, locale) }}
            </h3>
            <p v-if="video.description" class="text-xs text-[var(--fg-muted)] line-clamp-2">
              {{ video.description }}
            </p>
          </div>
        </router-link>
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

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link
          v-for="card in navCards"
          :key="card.link"
          :to="card.link"
          class="si-card si-card-interactive si-card-tabbed group p-5 sm:p-6"
          :style="{ '--tab-color': `var(--tab-${card.section})` }"
        >
          <div
            class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--fg-on-brand)]"
            :style="{ backgroundColor: 'var(--tab-color)' }"
          >
            <component :is="card.icon" class="h-7 w-7" aria-hidden="true" />
          </div>
          <h3 class="font-display text-lg font-bold text-[var(--fg)] sm:text-xl">
            {{ t(card.title) }}
          </h3>
          <p class="mt-1 text-sm text-[var(--fg-muted)]">{{ t(card.desc) }}</p>
          <span
            class="mt-auto flex items-center gap-1 pt-4 text-sm font-bold"
            :style="{ color: 'var(--tab-color)' }"
          >
            {{ t('sections.more') }}
            <ArrowRight
              class="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </router-link>
      </div>
    </section>

    <!-- Qanday boshlash kerak — uch qadam -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="p-8 sm:p-12 rounded-3xl bg-[var(--surface-muted)] border border-[var(--border-default)]"
      >
        <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 class="text-3xl font-extrabold text-[var(--fg)] font-display">
            {{ t('home.stepsHeading') }}
          </h2>
          <p class="text-sm text-[var(--fg-muted)]">{{ t('home.stepsDesc') }}</p>
        </div>

        <ol class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <li v-for="(step, i) in steps" :key="step.title" class="text-center space-y-3">
            <div class="relative w-16 h-16 mx-auto">
              <div
                class="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--brand)]"
              >
                <component :is="step.icon" class="w-8 h-8" aria-hidden="true" />
              </div>
              <span
                class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--brand)] text-[var(--fg-on-brand)] text-sm font-extrabold flex items-center justify-center"
                aria-hidden="true"
              >
                {{ i + 1 }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-[var(--fg)] font-display">{{ t(step.title) }}</h3>
            <p class="text-sm text-[var(--fg-muted)] leading-relaxed">{{ t(step.desc) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Volunteer CTA Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#135f70] via-[#1b93a6] to-[#0a2932] p-8 sm:p-12 text-white">
        <div class="relative z-10 max-w-2xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[var(--accent-kids-on-dark)] text-xs font-bold uppercase tracking-wider">
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
              class="px-8 py-4 rounded-2xl bg-[var(--accent-kids-on-dark)] text-[var(--si-neutral-950)] font-extrabold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer text-base"
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
