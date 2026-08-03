<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight } from '@lucide/vue'
import { fetchVocabularyTopicById } from '@/lib/api/services'
import type { VocabularyTopicDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()

const topic = ref<VocabularyTopicDto | null>(null)
const currentIndex = ref(0)
const loading = ref(true)

function playAudio(url?: string | null) {
  if (!url) return
  const audio = new Audio(url)
  audio.play()
}

onMounted(async () => {
  const id = parseInt(route.params.topicId as string, 10)
  if (id) {
    topic.value = await fetchVocabularyTopicById(id)
  }
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/vocabulary" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>{{ t('vocab.backToTopics') }}</span>
    </router-link>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="topic" class="space-y-8">
      <div class="text-center space-y-2">
        <span class="text-xs font-bold text-[var(--brand)] uppercase tracking-wider">{{ t('vocab.learnEyebrow') }}</span>
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ topic.title }}</h1>
      </div>

      <!-- Flashcard Slide -->
      <div v-if="topic.vocabularyWords && topic.vocabularyWords.length > 0" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-2xl text-center space-y-6">
        <div class="h-64 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-6 mx-auto max-w-lg">
          <img
            v-if="topic.vocabularyWords[currentIndex].imageUrl"
            :src="topic.vocabularyWords[currentIndex].imageUrl!"
            :alt="topic.vocabularyWords[currentIndex].word"
            class="max-h-full max-w-full object-contain"
          />
        </div>

        <div class="space-y-3">
          <h2 class="text-3xl font-extrabold text-[var(--fg)] font-display">
            {{ topic.vocabularyWords[currentIndex].word }}
          </h2>
          <button
            v-if="topic.vocabularyWords[currentIndex].audioUrlUz"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] font-bold text-sm hover:bg-[var(--brand)] hover:text-white transition-all cursor-pointer"
            @click="playAudio(topic.vocabularyWords[currentIndex].audioUrlUz)"
          >
            <Volume2 class="w-4 h-4" />
            <span>{{ t('vocab.pronounce') }}</span>
          </button>
        </div>

        <!-- Pagination Controls -->
        <div class="pt-4 flex items-center justify-between border-t border-[var(--border-default)]">
          <button
            type="button"
            class="px-5 py-2.5 rounded-xl border border-[var(--border-default)] font-bold text-sm hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30"
            :disabled="currentIndex === 0"
            @click="currentIndex--"
          >
            <ChevronLeft class="w-4 h-4 inline mr-1" />
            {{ t('vocab.prev') }}
          </button>

          <span class="text-xs font-bold text-[var(--fg-muted)]">
            {{ currentIndex + 1 }} / {{ topic.vocabularyWords.length }}
          </span>

          <button
            type="button"
            class="px-5 py-2.5 rounded-xl border border-[var(--border-default)] font-bold text-sm hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30"
            :disabled="currentIndex === topic.vocabularyWords.length - 1"
            @click="currentIndex++"
          >
            {{ t('vocab.next') }}
            <ChevronRight class="w-4 h-4 inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
