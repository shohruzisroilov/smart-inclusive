<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, BookOpen, Award } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import { getTestForContentItem } from '@/lib/api/tests'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'

const route = useRoute()
const { t, locale } = useI18n()

const book = ref<ContentItemDto | null>(null)
const linkedTest = ref<TestDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (id) {
    ;[book.value, linkedTest.value] = await Promise.all([
      fetchContentItemById(id),
      getTestForContentItem(id),
    ])
  }
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/books" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('reader.backToLibrary') }}</span>
    </router-link>

    <SkeletonArticle v-if="loading" :lines="4" />

    <div v-else-if="book" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <div v-if="book.coverImageUrl" class="h-80 rounded-2xl overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center p-6">
        <img :src="book.coverImageUrl" :alt="localizedTitle(book, locale)" class="max-h-full max-w-full object-contain" />
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ localizedTitle(book, locale) }}</h1>
        <p v-if="book.description" class="text-base text-[var(--fg-muted)] leading-relaxed">{{ book.description }}</p>
        <p v-if="book.author" class="text-sm text-[var(--fg-muted)]">{{ book.author }}</p>
      </div>

      <div class="pt-4 flex flex-wrap items-center gap-4">
        <router-link
          :to="`/books/${book.id}/read`"
          class="px-8 py-3.5 rounded-xl bg-[var(--brand)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all shadow-md flex items-center gap-2"
        >
          <BookOpen class="w-5 h-5" aria-hidden="true" />
          <span>{{ t('content.card.read') }}</span>
        </router-link>

        <router-link
          v-if="linkedTest"
          :to="`/tests/${linkedTest.id}`"
          class="px-8 py-3.5 rounded-xl border border-[var(--brand)] text-[var(--brand)] font-bold hover:bg-[var(--brand-subtle)] transition-all flex items-center gap-2"
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
