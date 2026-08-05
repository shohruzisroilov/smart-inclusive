<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { HeartHandshake, Menu, X, ChevronDown, Globe } from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import AccessibilityPanel from '@/components/settings/AccessibilityPanel.vue'
import { defaultLocale, type Locale } from '@/i18n'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const modalStore = useVolunteerModalStore()

const mobileMenuOpen = ref(false)
const kidsDropdownOpen = ref(false)
const parentsDropdownOpen = ref(false)
const langDropdownOpen = ref(false)
const moreDropdownOpen = ref(false)

function switchLanguage(lang: Locale) {
  locale.value = lang
  langDropdownOpen.value = false
  const currentName = route.name as string
  if (currentName) {
    router.push({ name: currentName, params: { ...route.params, locale: lang } })
  }
}

function getRoute(name: string, params: Record<string, unknown> = {}) {
  const currentLocale = (route.params.locale as string) || defaultLocale
  return { name, params: { locale: currentLocale, ...params } }
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border-default)] transition-all">
    <!--
      Header konteyneri sahifa kontentidan (`max-w-7xl` = 1280px) KENGROQ:
      1280px ga logotip + nav + boshqaruvlar sig'maydi, flex ularni siqadi va
      ikki so'zli yozuvlar ikki qatorga bo'linib ketadi.

      Nav 768px dan ko'rinadi, 1024px dan emas — platformaning asosiy qurilmasi
      PLANSHET va u ko'pincha aynan shu kenglikda ochiladi. Menyuni u yerda
      gamburgerga yashirish har bir o'tishga bitta ortiqcha bosish qo'shardi.
    -->
    <div class="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
      <!-- Logo -->
      <router-link :to="getRoute('home')" class="flex items-center gap-3 group cursor-pointer shrink-0">
        <img src="/logo.png" alt="Smart Inclusive" class="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
        <span class="font-extrabold text-xl text-[var(--fg)] tracking-tight font-display whitespace-nowrap hidden 2xl:inline-block">
          Smart <span class="text-[var(--brand)]">Inclusive</span>
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <!-- «Bosh sahifa» havolasi ataylab yo'q: logotipning o'zi shu vazifani
           bajaradi va menyuda joy tor. -->
      <nav class="hidden md:flex items-center gap-0.5">
        <!-- Kids Dropdown -->
        <div class="relative" @mouseleave="kidsDropdownOpen = false">
          <button
            type="button"
            class="tap-target px-3 rounded-xl text-sm font-semibold whitespace-nowrap text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors flex items-center gap-1.5 cursor-pointer"
            @mouseenter="kidsDropdownOpen = true"
            @click="kidsDropdownOpen = !kidsDropdownOpen"
          >
            <span>{{ t('nav.kids') }}</span>
            <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': kidsDropdownOpen }" />
          </button>
          <div
            v-if="kidsDropdownOpen"
            class="absolute top-full left-0 w-56 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <router-link :to="getRoute('vocabulary')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.dictionary') }}
            </router-link>
            <router-link :to="getRoute('etiquette')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.etiquette') }}
            </router-link>
            <router-link :to="getRoute('i-can-do-it')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.iCan') }}
            </router-link>
            <router-link :to="getRoute('lessons')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.lessons') }}
            </router-link>
            <router-link :to="getRoute('books')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.books') }}
            </router-link>
            <router-link :to="getRoute('tests')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.tests') }}
            </router-link>
          </div>
        </div>

        <!-- Parents Dropdown -->
        <div class="relative" @mouseleave="parentsDropdownOpen = false">
          <button
            type="button"
            class="tap-target px-3 rounded-xl text-sm font-semibold whitespace-nowrap text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors flex items-center gap-1.5 cursor-pointer"
            @mouseenter="parentsDropdownOpen = true"
            @click="parentsDropdownOpen = !parentsDropdownOpen"
          >
            <span>{{ t('nav.parents') }}</span>
            <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': parentsDropdownOpen }" />
          </button>
          <div
            v-if="parentsDropdownOpen"
            class="absolute top-full left-0 w-60 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <router-link :to="getRoute('for-parents')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-bold text-[var(--brand-text)] hover:bg-[var(--surface-subtle)] transition-colors">
              {{ t('sections.parentsHubTitle') }}
            </router-link>
            <div class="my-1 border-t border-[var(--border-default)]"></div>
            <router-link :to="getRoute('for-parents-articles')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.articles') }}
            </router-link>
            <router-link :to="getRoute('for-parents-videos')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.videoLessons') }}
            </router-link>
            <router-link :to="getRoute('for-parents-legal')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.legalArticles') }}
            </router-link>
            <router-link :to="getRoute('for-parents-home-education')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.homeEducation') }}
            </router-link>
            <router-link :to="getRoute('for-parents-tests')" class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.tests') }}
            </router-link>
          </div>
        </div>

        <!--
          Nav ikki bosqichda yig'iladi — sig'magani "Ko'proq" ga tushadi:
            1024-1279  : Ko'ngillilar + Loyiha haqida + Murojaat -> Ko'proq
            1280-1535  : Loyiha haqida + Murojaat -> Ko'proq
            1536+      : hammasi to'g'ridan-to'g'ri, Ko'proq yashirinadi

          Aks holda elementlar yonma-yon sig'may, flex ularni siqadi va
          yozuvlar ikki qatorga bo'linib ketadi.
        -->
        <router-link
          :to="getRoute('volunteers')"
          class="hidden xl:inline-flex tap-target items-center px-3 rounded-xl text-sm font-semibold whitespace-nowrap text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
          active-class="!text-[var(--brand)] !bg-[var(--brand-subtle)] font-bold"
        >
          {{ t('nav.volunteers') }}
        </router-link>
        <router-link
          :to="getRoute('about-project')"
          class="hidden 2xl:inline-flex tap-target items-center px-3 rounded-xl text-sm font-semibold whitespace-nowrap text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
          active-class="!text-[var(--brand)] !bg-[var(--brand-subtle)] font-bold"
        >
          {{ t('nav.aboutProject') }}
        </router-link>

        <router-link
          :to="getRoute('contact')"
          class="hidden 2xl:inline-flex tap-target items-center px-3 rounded-xl text-sm font-semibold whitespace-nowrap text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
          active-class="!text-[var(--brand)] !bg-[var(--brand-subtle)] font-bold"
        >
          {{ t('nav.contact') }}
        </router-link>

        <!-- "Ko'proq" — faqat 2xl dan pastda -->
        <div class="relative 2xl:hidden" @mouseleave="moreDropdownOpen = false">
          <button
            type="button"
            :aria-expanded="moreDropdownOpen"
            class="tap-target px-3 rounded-xl text-sm font-semibold whitespace-nowrap text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors flex items-center gap-1.5 cursor-pointer"
            @mouseenter="moreDropdownOpen = true"
            @click="moreDropdownOpen = !moreDropdownOpen"
          >
            <span>{{ t('header.more') }}</span>
            <ChevronDown
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': moreDropdownOpen }"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="moreDropdownOpen"
            class="absolute top-full right-0 w-56 p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <router-link
              :to="getRoute('volunteers')"
              class="block xl:hidden px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors"
              active-class="text-[var(--brand)] font-bold"
              @click="moreDropdownOpen = false"
            >
              {{ t('nav.volunteers') }}
            </router-link>
            <router-link
              :to="getRoute('about-project')"
              class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors"
              active-class="text-[var(--brand)] font-bold"
              @click="moreDropdownOpen = false"
            >
              {{ t('nav.aboutProject') }}
            </router-link>
            <!--
              «Biz haqimizda» (TZ 3.2) faqat shu ro'yxatda: yuqori qatorga
              yettinchi havola sig'maydi — kengligi yetmay yozuvlar ikki
              qatorga bo'linib ketardi.
            -->
            <router-link
              :to="getRoute('about-us')"
              class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors"
              active-class="text-[var(--brand)] font-bold"
              @click="moreDropdownOpen = false"
            >
              {{ t('nav.aboutUs') }}
            </router-link>
            <router-link
              :to="getRoute('contact')"
              class="flex items-center min-h-[var(--tap-target-min)] px-3.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors"
              active-class="text-[var(--brand)] font-bold"
              @click="moreDropdownOpen = false"
            >
              {{ t('nav.contact') }}
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Right Controls -->
      <div class="flex items-center gap-2 shrink-0">
        <!--
          Mavzu va rang ko'rligi tugmalari header'da YO'Q — ikkalasi ham
          maxsus imkoniyatlar panelining ichida sozlanadi, shuning uchun
          yuqorida takrorlanishi joyni behuda egallardi.
        -->
        <AccessibilityPanel />

        <!-- Language Switcher -->
        <div class="relative">
          <button
            type="button"
            class="tap-target px-3 rounded-xl border border-[var(--border-default)] hover:bg-[var(--surface-subtle)] text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 cursor-pointer uppercase"
            @click="langDropdownOpen = !langDropdownOpen"
          >
            <Globe class="w-4 h-4 text-[var(--brand)]" />
            <span>{{ locale }}</span>
          </button>
          <div
            v-if="langDropdownOpen"
            class="absolute right-0 top-full mt-2 w-32 p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl animate-in fade-in duration-150 z-50"
          >
            <button
              type="button"
              class="w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
              :class="{ 'text-[var(--brand)] font-bold': locale === 'uz' }"
              @click="switchLanguage('uz')"
            >
              O'zbekcha
            </button>
            <button
              type="button"
              class="w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
              :class="{ 'text-[var(--brand)] font-bold': locale === 'ru' }"
              @click="switchLanguage('ru')"
            >
              Русский
            </button>
            <button
              type="button"
              class="w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
              :class="{ 'text-[var(--brand)] font-bold': locale === 'en' }"
              @click="switchLanguage('en')"
            >
              English
            </button>
          </div>
        </div>

        <!-- Become Volunteer CTA Button -->
        <button
          type="button"
          class="hidden sm:inline-flex tap-target items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-3 lg:px-4 font-bold text-sm whitespace-nowrap text-[var(--fg-on-brand)] shadow-md transition-all hover:bg-[var(--brand-hover)] hover:shadow-lg cursor-pointer"
          :aria-label="t('nav.becomeVolunteer')"
          @click="modalStore.openModal()"
        >
          <HeartHandshake class="w-5 h-5" aria-hidden="true" />
          <!-- Planshet kengligida faqat ikonka: yozuv nav'ni siqib qo'yardi -->
          <span class="hidden lg:inline">{{ t('nav.becomeVolunteer') }}</span>
        </button>

        <!-- Mobile Menu Toggle -->
        <button
          type="button"
          class="md:hidden tap-target flex items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--fg)] hover:bg-[var(--surface-subtle)] cursor-pointer"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-[var(--border-default)] bg-[var(--surface)] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
      <nav class="flex flex-col space-y-2">
        <router-link :to="getRoute('vocabulary')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.kidsItems.dictionary') }}
        </router-link>
        <router-link :to="getRoute('for-parents')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.parents') }}
        </router-link>
        <router-link :to="getRoute('volunteers')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.volunteers') }}
        </router-link>
        <router-link :to="getRoute('about-us')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.aboutUs') }}
        </router-link>
        <router-link :to="getRoute('contact')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.contact') }}
        </router-link>
      </nav>

      <div class="pt-4 border-t border-[var(--border-default)] space-y-1">
        <AccessibilityPanel variant="list" />
      </div>

      <div class="pt-4 border-t border-[var(--border-default)]">
        <button
          type="button"
          class="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#135f70] to-[#1b93a6] text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
          @click="modalStore.openModal(); mobileMenuOpen = false"
        >
          <HeartHandshake class="w-5 h-5 text-amber-300" />
          <span>{{ t('nav.becomeVolunteer') }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
