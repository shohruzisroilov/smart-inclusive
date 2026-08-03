<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOpen, ArrowRight } from '@lucide/vue'
import { fetchVocabularyTopics } from '@/lib/api/services'
import type { VocabularyTopicDto } from '@/lib/api/types'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'

const { t } = useI18n()
const topics = ref<VocabularyTopicDto[]>([])
const loading = ref(true)

onMounted(async () => {
  topics.value = await fetchVocabularyTopics()
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <div class="bg-gradient-to-r from-[#135f70] to-[#1b93a6] p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
        <BookOpen class="w-4 h-4" />
        <span>{{ t('nav.kidsItems.dictionary') }}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold font-display">
        {{ t('vocab.title') }}
      </h1>
      <p class="text-white/80 max-w-xl text-sm leading-relaxed font-light">
        {{ t('vocab.subtitle') }}
      </p>
    </div>

    <SkeletonCardGrid v-if="loading" />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="topic in topics"
        :key="topic.id"
        :to="`/vocabulary/${topic.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-xl transition-all space-y-4"
      >
        <div class="h-44 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4">
          <BookOpen class="w-12 h-12 text-[var(--fg-subtle)]" />
        </div>

        <div>
          <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--brand)] transition-colors">
            {{ topic.title }}
          </h3>
          <p class="text-xs text-[var(--fg-muted)] mt-1">
            {{ topic.vocabularyWords?.length || 0 }} {{ t('vocab.cardDesc') }}
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
