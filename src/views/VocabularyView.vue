<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOpen, ArrowRight } from '@lucide/vue'
import { fetchVocabularyTopics } from '@/lib/api/services'
import type { VocabularyTopicDto } from '@/lib/api/types'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'

const { t } = useI18n()
const topics = ref<VocabularyTopicDto[]>([])
const loading = ref(true)

onMounted(async () => {
  topics.value = await fetchVocabularyTopics()
  loading.value = false
})
</script>

<template>
  <div class="pt-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <PageHero
      accent="vocabulary"
      :title="t('vocab.title')"
      :subtitle="t('vocab.subtitle')"
    />

    <SkeletonCardGrid v-if="loading" />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="topic in topics"
        :key="topic.id"
        :to="`/vocabulary/${topic.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--brand)] transition-all space-y-4"
      >
        <div class="h-44 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4">
          <BookOpen class="w-12 h-12 text-[var(--fg-subtle)]" />
        </div>

        <div>
          <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--brand)] transition-colors">
            {{ topic.title }}
          </h3>
          <!--
            So'z soni va tavsif ALOHIDA qatorlarda. Ilgari ikkalasi bitta
            qatorga ulanib, «1 Ushbu to'plam orqali…» degan ma'nosiz matn
            chiqardi. `wordsCount` kaliti («{count} ta so'z») shu uchun bor
            edi, lekin ishlatilmagan.
          -->
          <p class="text-xs font-semibold text-[var(--brand)] mt-1">
            {{ t('vocab.wordsCount', { count: topic.vocabularyWords?.length || 0 }) }}
          </p>
          <p class="text-xs text-[var(--fg-muted)] mt-1.5 line-clamp-2">
            {{ t('vocab.cardDesc') }}
          </p>
        </div>

        <div class="pt-2 flex items-center justify-between text-xs font-bold text-[var(--brand)]">
          <span>{{ t('vocab.start') }}</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </router-link>
    </div>
  </div>
</template>
