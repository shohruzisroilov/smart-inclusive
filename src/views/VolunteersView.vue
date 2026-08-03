<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { HeartHandshake, Users, MapPin, ArrowRight, Sparkles } from '@lucide/vue'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import { fetchVolunteerCases } from '@/lib/api/services'
import type { VolunteerCaseDto } from '@/lib/api/types'

const { t } = useI18n()
const modalStore = useVolunteerModalStore()
const cases = ref<VolunteerCaseDto[]>([])
const loading = ref(true)

onMounted(async () => {
  cases.value = await fetchVolunteerCases()
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
    <!-- Header Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#135f70] via-[#1b93a6] to-[#0a2932] p-8 sm:p-12 text-white shadow-2xl">
      <div class="relative z-10 max-w-2xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake class="w-4 h-4" />
          <span>{{ t('volunteersPage.badge') }}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
          {{ t('nav.volunteers') }}
        </h1>
        <p class="text-base text-white/80 leading-relaxed font-light">
          {{ t('home.ctaDesc') }}
        </p>
        <div class="pt-2">
          <button
            type="button"
            class="px-8 py-3.5 rounded-2xl bg-amber-400 text-slate-900 font-extrabold shadow-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer text-base"
            @click="modalStore.openModal()"
          >
            <Sparkles class="w-5 h-5" />
            <span>{{ t('volunteersPage.applyCta') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Stories / Cases Grid -->
    <div class="space-y-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">
          {{ t('volunteersPage.casesTitle') }}
        </h2>
        <p class="text-sm text-[var(--fg-muted)]">
          {{ t('volunteersPage.casesSubtitle') }}
        </p>
      </div>

      <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
        {{ t('common.loading') }}
      </div>

      <div v-else-if="cases.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="item in cases"
          :key="item.id"
          :to="`/volunteers/${item.id}`"
          class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-xl transition-all space-y-4"
        >
          <div class="h-48 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center">
            <img v-if="item.mediaUrl" :src="item.mediaUrl" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <Users v-else class="w-12 h-12 text-[var(--fg-subtle)]" />
          </div>

          <div class="space-y-2">
            <div v-if="item.region" class="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand)]">
              <MapPin class="w-3.5 h-3.5" />
              <span>{{ item.region }}</span>
            </div>
            <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--brand)] transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-xs text-[var(--fg-muted)] line-clamp-3 leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <div class="pt-2 flex items-center justify-between text-xs font-bold text-[var(--brand)]">
            <span>{{ t('volunteersPage.readMore') }}</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </router-link>
      </div>

      <div v-else class="text-center py-12 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
        {{ t('volunteersPage.emptyCases') }}
      </div>
    </div>
  </div>
</template>
