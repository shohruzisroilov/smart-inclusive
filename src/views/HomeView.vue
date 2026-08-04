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
} from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { fetchPlatformStats } from '@/lib/api/services'
import CountUp from '@/components/ui/CountUp.vue'
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

/**
 * Bo'limlar to'ri — TZ 4, blok 4 aynan SAKKIZ karta so'raydi.
 *
 * Ko'ngillilar bu ro'yxatda ataylab yo'q: unga alohida chaqiriq bloki
 * ajratilgan (TZ 4, blok 5), ya'ni to'rda takrorlanishi ortiqcha bo'lardi.
 *
 * Ranglar to'liq sinf nomlari bilan yozilgan — Tailwind sinflarni kodni
 * o'qib topadi, `from-${color}-500` kabi yig'ma satrlarni ko'rmaydi va
 * bunday sinflar bandlga umuman tushmaydi.
 */
const navCards = [
  {
    link: '/etiquette',
    icon: Smile,
    title: 'sections.etiquetteTitle',
    desc: 'home.navEtiquetteDesc',
    surface: 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/50',
    badge: 'bg-amber-500',
    hoverText: 'group-hover:text-amber-600',
    accentText: 'text-amber-600',
  },
  {
    link: '/i-can-do-it',
    icon: Sparkles,
    title: 'sections.iCanTitle',
    desc: 'home.navICanDesc',
    surface: 'bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:border-orange-500/50',
    badge: 'bg-orange-500',
    hoverText: 'group-hover:text-orange-600',
    accentText: 'text-orange-600',
  },
  {
    link: '/lessons',
    icon: GraduationCap,
    title: 'sections.lessonsTitle',
    desc: 'home.navLessonsDesc',
    surface: 'bg-gradient-to-br from-teal-500/10 to-teal-500/5 border-teal-500/20 hover:border-teal-500/50',
    badge: 'bg-teal-500',
    hoverText: 'group-hover:text-teal-600',
    accentText: 'text-teal-600',
  },
  {
    link: '/books',
    icon: BookOpen,
    title: 'sections.booksTitle',
    desc: 'home.navBooksDesc',
    surface: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50',
    badge: 'bg-emerald-500',
    hoverText: 'group-hover:text-emerald-600',
    accentText: 'text-emerald-600',
  },
  {
    link: '/vocabulary',
    icon: Languages,
    title: 'home.navDictionary',
    desc: 'home.navDictionaryDesc',
    surface: 'bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50',
    badge: 'bg-cyan-500',
    hoverText: 'group-hover:text-cyan-600',
    accentText: 'text-cyan-600',
  },
  {
    link: '/tests',
    icon: Award,
    title: 'sections.testsTitle',
    desc: 'home.navTestsDesc',
    surface: 'bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/50',
    badge: 'bg-purple-500',
    hoverText: 'group-hover:text-purple-600',
    accentText: 'text-purple-600',
  },
  {
    link: '/for-parents',
    icon: Users,
    title: 'home.navParents',
    desc: 'home.navParentsDesc',
    surface: 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/50',
    badge: 'bg-blue-500',
    hoverText: 'group-hover:text-blue-600',
    accentText: 'text-blue-600',
  },
  {
    link: '/contact',
    icon: MessageSquare,
    title: 'home.navContact',
    desc: 'home.navContactDesc',
    surface: 'bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20 hover:border-rose-500/50',
    badge: 'bg-rose-500',
    hoverText: 'group-hover:text-rose-600',
    accentText: 'text-rose-600',
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

onMounted(async () => {
  if (!settings.reducedMotion) slideTimer = setInterval(nextSlide, 6000)
  stats.value = await fetchPlatformStats()
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
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/10">
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

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link
          v-for="card in navCards"
          :key="card.link"
          :to="card.link"
          class="group p-6 rounded-3xl border hover:shadow-xl transition-all space-y-4"
          :class="card.surface"
        >
          <div
            class="w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            :class="card.badge"
          >
            <component :is="card.icon" class="w-7 h-7" aria-hidden="true" />
          </div>
          <div>
            <h3
              class="text-xl font-bold text-[var(--fg)] font-display transition-colors"
              :class="card.hoverText"
            >
              {{ t(card.title) }}
            </h3>
            <p class="text-xs text-[var(--fg-muted)] mt-1">{{ t(card.desc) }}</p>
          </div>
          <div
            class="pt-2 flex items-center text-xs font-bold group-hover:translate-x-1 transition-transform"
            :class="card.accentText"
          >
            <span>{{ t('sections.more') }}</span>
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
