<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { HeartHandshake, Menu, X, ChevronDown, Globe } from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import ThemeToggle from '@/components/settings/ThemeToggle.vue'
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
      <!-- Logo -->
      <router-link :to="getRoute('home')" class="flex items-center gap-3 group cursor-pointer">
        <img src="/logo.png" alt="Smart Inclusive" class="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
        <span class="font-extrabold text-xl text-[var(--fg)] tracking-tight font-display hidden sm:inline-block">
          Smart <span class="text-[var(--brand)]">Inclusive</span>
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-1">
        <router-link
          :to="getRoute('home')"
          class="px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
          active-class="!text-[var(--brand)] !bg-[var(--brand-subtle)] font-bold"
        >
          {{ t('nav.home') }}
        </router-link>

        <!-- Kids Dropdown -->
        <div class="relative" @mouseleave="kidsDropdownOpen = false">
          <button
            type="button"
            class="px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors flex items-center gap-1.5 cursor-pointer"
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
            <router-link :to="getRoute('vocabulary')" class="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.dictionary') }}
            </router-link>
            <router-link :to="getRoute('etiquette')" class="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.etiquette') }}
            </router-link>
            <router-link :to="getRoute('i-can-do-it')" class="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.iCan') }}
            </router-link>
            <router-link :to="getRoute('lessons')" class="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.lessons') }}
            </router-link>
            <router-link :to="getRoute('books')" class="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.books') }}
            </router-link>
            <router-link :to="getRoute('tests')" class="block px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.kidsItems.tests') }}
            </router-link>
          </div>
        </div>

        <!-- Parents Dropdown -->
        <div class="relative" @mouseleave="parentsDropdownOpen = false">
          <button
            type="button"
            class="px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors flex items-center gap-1.5 cursor-pointer"
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
            <router-link :to="getRoute('for-parents')" class="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--brand)] hover:bg-[var(--surface-subtle)] transition-colors">
              {{ t('sections.parentsHubTitle') }}
            </router-link>
            <div class="my-1 border-t border-[var(--border-default)]"></div>
            <router-link :to="getRoute('for-parents-articles')" class="block px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.articles') }}
            </router-link>
            <router-link :to="getRoute('for-parents-videos')" class="block px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.videoLessons') }}
            </router-link>
            <router-link :to="getRoute('for-parents-legal')" class="block px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.legalArticles') }}
            </router-link>
            <router-link :to="getRoute('for-parents-home-education')" class="block px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)] transition-colors">
              {{ t('nav.parentsItems.homeEducation') }}
            </router-link>
          </div>
        </div>

        <router-link
          :to="getRoute('volunteers')"
          class="px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
          active-class="!text-[var(--brand)] !bg-[var(--brand-subtle)] font-bold"
        >
          {{ t('nav.volunteers') }}
        </router-link>

        <router-link
          :to="getRoute('about-project')"
          class="px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
          active-class="!text-[var(--brand)] !bg-[var(--brand-subtle)] font-bold"
        >
          {{ t('nav.aboutProject') }}
        </router-link>

        <router-link
          :to="getRoute('contact')"
          class="px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors"
          active-class="!text-[var(--brand)] !bg-[var(--brand-subtle)] font-bold"
        >
          {{ t('nav.contact') }}
        </router-link>
      </nav>

      <!-- Right Controls -->
      <div class="flex items-center gap-3">
        <!-- Accessibility & Theme -->
        <ThemeToggle />
        <AccessibilityPanel />

        <!-- Language Switcher -->
        <div class="relative">
          <button
            type="button"
            class="px-3 py-2 rounded-xl border border-[var(--border-default)] hover:bg-[var(--surface-subtle)] text-sm font-semibold flex items-center gap-1.5 cursor-pointer uppercase"
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
          class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#135f70] to-[#1b93a6] hover:opacity-95 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          @click="modalStore.openModal()"
        >
          <HeartHandshake class="w-4 h-4 text-amber-300" />
          <span>{{ t('nav.becomeVolunteer') }}</span>
        </button>

        <!-- Mobile Menu Toggle -->
        <button
          type="button"
          class="lg:hidden p-2 rounded-xl border border-[var(--border-default)] text-[var(--fg)] hover:bg-[var(--surface-subtle)] cursor-pointer"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div v-if="mobileMenuOpen" class="lg:hidden border-t border-[var(--border-default)] bg-[var(--surface)] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
      <nav class="flex flex-col space-y-2">
        <router-link :to="getRoute('home')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.home') }}
        </router-link>
        <router-link :to="getRoute('vocabulary')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.kidsItems.dictionary') }}
        </router-link>
        <router-link :to="getRoute('for-parents')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.parents') }}
        </router-link>
        <router-link :to="getRoute('volunteers')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.volunteers') }}
        </router-link>
        <router-link :to="getRoute('contact')" class="px-4 py-3 rounded-xl text-base font-semibold hover:bg-[var(--surface-subtle)]" @click="mobileMenuOpen = false">
          {{ t('nav.contact') }}
        </router-link>
      </nav>

      <div class="pt-4 border-t border-[var(--border-default)] space-y-1">
        <ThemeToggle variant="list" />
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
