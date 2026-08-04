<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { HeartHandshake, Phone, Mail } from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import { CONTACT_EMAIL, TRUST_PHONE, TRUST_PHONE_TEL } from '@/lib/constants/contact'

const { t } = useI18n()
const modalStore = useVolunteerModalStore()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-[var(--surface-muted)] border-t border-[var(--border-default)] pt-12 pb-8 text-[var(--fg-muted)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[var(--border-default)]"
      >
        <!-- Brand column -->
        <div class="sm:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="Smart Inclusive" class="h-9 w-auto object-contain" />
            <span class="font-extrabold text-xl text-[var(--fg)] tracking-tight font-display">
              Smart <span class="text-[var(--brand)]">Inclusive</span>
            </span>
          </div>
          <p class="text-sm text-[var(--fg-subtle)] max-w-md leading-relaxed">
            {{ t('footer.description') }}
          </p>
          <div class="pt-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--brand)] text-white text-xs font-bold hover:bg-[var(--brand-hover)] transition-all cursor-pointer shadow-sm"
              @click="modalStore.openModal()"
            >
              <HeartHandshake class="w-4 h-4 text-amber-300" />
              <span>{{ t('nav.becomeVolunteer') }}</span>
            </button>
          </div>
        </div>

        <!-- Kids Links -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider">
            {{ t('nav.kids') }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/vocabulary" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.kidsItems.dictionary') }}
              </router-link>
            </li>
            <li>
              <router-link to="/etiquette" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.kidsItems.etiquette') }}
              </router-link>
            </li>
            <li>
              <router-link to="/i-can-do-it" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.kidsItems.iCan') }}
              </router-link>
            </li>
            <li>
              <router-link to="/lessons" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.kidsItems.lessons') }}
              </router-link>
            </li>
            <li>
              <router-link to="/books" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.kidsItems.books') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Parents & Volunteers -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider">
            {{ t('footer.sections') }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/for-parents" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.parents') }}
              </router-link>
            </li>
            <li>
              <router-link to="/volunteers" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.volunteers') }}
              </router-link>
            </li>
            <li>
              <router-link to="/about-project" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.aboutProject') }}
              </router-link>
            </li>
            <li>
              <router-link to="/about-us" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.aboutUs') }}
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="hover:text-[var(--brand)] transition-colors">
                {{ t('nav.contact') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!--
          Kontaktlar (TZ 3.3). Ishonch raqami header ustidagi panelda emas,
          faqat shu yerda — panel foydalanuvchi so'roviga ko'ra olib tashlangan.
          `tel:` va `mailto:` har qanday qurilmada ishlaydi, shuning uchun
          nusxalash mantiqi bu yerda takrorlanmaydi.
        -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider">
            {{ t('footer.contacts') }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                :href="TRUST_PHONE_TEL"
                class="inline-flex items-center gap-2 hover:text-[var(--brand)] transition-colors"
              >
                <Phone class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span class="whitespace-nowrap">{{ TRUST_PHONE }}</span>
              </a>
            </li>
            <li>
              <a
                :href="`mailto:${CONTACT_EMAIL}`"
                class="inline-flex items-center gap-2 hover:text-[var(--brand)] transition-colors break-all"
              >
                <Mail class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{{ CONTACT_EMAIL }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--fg-subtle)] gap-4">
        <p>© {{ year }} Smart Inclusive. {{ t('footer.rights') }}</p>
        <router-link to="/accessibility" class="hover:underline">
          {{ t('footer.accessibilityStatement') }}
        </router-link>
      </div>
    </div>
  </footer>
</template>
