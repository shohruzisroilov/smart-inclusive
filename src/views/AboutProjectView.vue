<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Sparkles, HeartHandshake } from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'

const { t } = useI18n()
const modalStore = useVolunteerModalStore()
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] space-y-6">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] text-xs font-bold uppercase tracking-wider">
        <Sparkles class="w-4 h-4 text-[var(--accent-kids)]" />
        <span>{{ t('nav.aboutProject') }}</span>
      </div>

      <h1 class="text-3xl sm:text-4xl font-extrabold text-[var(--fg)] font-display">
        {{ t('aboutProject.title') }}
      </h1>

      <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
        {{ t('aboutProject.desc') }}
      </p>

      <div class="pt-4">
        <button
          type="button"
          class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#135f70] to-[#1b93a6] text-white font-bold transition-all cursor-pointer flex items-center gap-2"
          @click="modalStore.openModal()"
        >
          <HeartHandshake class="w-5 h-5 text-[var(--accent-kids-on-dark)]" />
          <span>{{ t('nav.becomeVolunteer') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
