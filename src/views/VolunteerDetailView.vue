<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { MapPin, HeartHandshake, Users } from '@lucide/vue'
import { fetchVolunteerCaseById } from '@/lib/api/services'
import type { VolunteerCaseDto } from '@/lib/api/types'
import { useVolunteerModalStore } from '@/stores/useVolunteerModalStore'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'

const route = useRoute()
const { t } = useI18n()
const modalStore = useVolunteerModalStore()

const volunteerCase = ref<VolunteerCaseDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.caseId as string, 10)
  if (id) {
    volunteerCase.value = await fetchVolunteerCaseById(id)
  }
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <SkeletonArticle v-if="loading" />

    <div v-else-if="volunteerCase" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] space-y-6">
      <div v-if="volunteerCase.mediaUrl" class="h-80 rounded-2xl overflow-hidden bg-[var(--surface-subtle)]">
        <img :src="volunteerCase.mediaUrl" :alt="volunteerCase.title" class="w-full h-full object-cover" />
      </div>

      <div class="space-y-3">
        <div v-if="volunteerCase.region" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] text-xs font-bold uppercase">
          <MapPin class="w-3.5 h-3.5" />
          <span>{{ volunteerCase.region }}</span>
        </div>
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ volunteerCase.title }}</h1>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed whitespace-pre-line">{{ volunteerCase.description }}</p>
      </div>

      <div class="pt-6 border-t border-[var(--border-default)]">
        <button
          type="button"
          class="px-8 py-3.5 rounded-xl bg-[var(--brand)] text-white font-bold transition-all cursor-pointer flex items-center gap-2"
          @click="modalStore.openModal()"
        >
          <HeartHandshake class="w-5 h-5 text-[var(--accent-platform)]" />
          <span>{{ t('volunteersPage.applyCta') }}</span>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20 text-[var(--fg-muted)]">
      {{ t('volunteersPage.notFoundTitle') }}
    </div>
  </div>
</template>
