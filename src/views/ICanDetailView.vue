<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Award } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import { getTestForContentItem } from '@/lib/api/tests'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'
import VideoPlayer from '@/components/ui/VideoPlayer.vue'
import PagedPdfReader from '@/components/ui/PagedPdfReader.vue'

const route = useRoute()
const { t, locale } = useI18n()
const item = ref<ContentItemDto | null>(null)
const loading = ref(true)
const linkedTest = ref<TestDto | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  if (Number.isInteger(id)) {
    ;[item.value, linkedTest.value] = await Promise.all([
      fetchContentItemById(id),
      getTestForContentItem(id),
    ])
  }
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/i-can-do-it" class="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:underline">
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('common.back') }}</span>
    </router-link>

    <SkeletonArticle v-if="loading" :lines="4" />

    <div v-else-if="item" class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <VideoPlayer v-if="item.youtubeUrl" :item="item" :linked-test="linkedTest" />

      <!-- Videosi yo'q material ham shu bo'limga tushishi mumkin (maqola, PDF) -->
      <div
        v-else-if="item.coverImageUrl && !item.pdfFileUrl"
        class="h-72 rounded-2xl overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center p-6"
      >
        <img
          :src="item.coverImageUrl"
          :alt="localizedTitle(item, locale)"
          class="max-h-full max-w-full object-contain"
        />
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ localizedTitle(item, locale) }}</h1>
        <p v-if="item.description" class="text-base text-[var(--fg-muted)] leading-relaxed">{{ item.description }}</p>
      </div>

      <div
        v-if="item.fullText"
        class="text-base text-[var(--fg)] leading-relaxed font-light whitespace-pre-line"
      >
        {{ item.fullText }}
      </div>

      <PagedPdfReader
        v-if="item.pdfFileUrl"
        :url="item.pdfFileUrl"
        :title="localizedTitle(item, locale)"
        :content-item-id="item.id"
      />

      <!-- Video bo'lsa test tugmasi `VideoPlayer` ichida ko'rilganidan keyin ochiladi -->
      <div
        v-if="linkedTest && !item.youtubeUrl"
        class="pt-4 border-t border-[var(--border-default)] text-center space-y-2"
      >
        <p class="text-sm text-[var(--fg-muted)]">{{ t('reader.testPrompt') }}</p>
        <router-link
          :to="`/tests/${linkedTest.id}`"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold shadow-lg hover:opacity-90 transition-all"
        >
          <Award class="w-5 h-5" aria-hidden="true" />
          <span>{{ t('reader.goToTest') }}</span>
        </router-link>
      </div>
    </div>

    <div v-else class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
