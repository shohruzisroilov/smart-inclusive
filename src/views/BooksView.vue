<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOpen, ArrowRight, CheckCircle2, Award } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import { getTestsByContentItem } from '@/lib/api/tests'
import { localizedTitle } from '@/lib/api/content'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import { CONTENT_TYPE_KITOB } from '@/lib/api/constants'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'
import ContentListFilters from '@/components/ui/ContentListFilters.vue'
import { useContentFilters } from '@/composables/useContentFilters'

const { t, locale } = useI18n()
const books = ref<ContentItemDto[]>([])
const testsByContentItem = ref<Map<number, TestDto>>(new Map())
const loading = ref(true)

const { test, progressFilter, sort, filtered, clear, isFiltered, linkedTest, isDone } =
  useContentFilters(books, testsByContentItem)

onMounted(async () => {
  const [all, tests] = await Promise.all([fetchContentItems(), getTestsByContentItem()])
  books.value = all.filter((item) => item.typeId === CONTENT_TYPE_KITOB)
  testsByContentItem.value = tests
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <PageHero
      accent="books"
      :title="t('sections.booksTitle')"
      :subtitle="t('sections.booksSubtitle')"
    />

    <SkeletonCardGrid v-if="loading" />

    <template v-else-if="books.length > 0">
      <ContentListFilters
        v-model:test="test"
        v-model:progress="progressFilter"
        v-model:sort="sort"
        :shown="filtered.length"
        :total="books.length"
        @clear="clear"
      />

      <div v-if="filtered.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="book in filtered"
          :key="book.id"
          :to="`/books/${book.id}`"
          class="group relative p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-xl transition-all space-y-4"
        >
          <!-- «Topshirilgan» statusi — rang bilan emas, ikonka bilan ham (TZ 12.1) -->
          <span
            v-if="isDone(book)"
            class="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 text-xs font-bold"
          >
            <CheckCircle2 class="w-3.5 h-3.5" aria-hidden="true" />
            {{ t('content.card.done') }}
          </span>

          <div
            class="h-48 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4"
          >
            <img
              v-if="book.coverImageUrl"
              :src="book.coverImageUrl"
              :alt="localizedTitle(book, locale)"
              class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
            />
            <BookOpen v-else class="w-12 h-12 text-[var(--fg-subtle)]" aria-hidden="true" />
          </div>

          <div>
            <h3
              class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--brand)] transition-colors"
            >
              {{ localizedTitle(book, locale) }}
            </h3>
            <p class="text-xs text-[var(--fg-muted)] mt-1 line-clamp-2">{{ book.description }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span
              v-if="linkedTest(book)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] text-xs font-bold"
            >
              <Award class="w-3 h-3" aria-hidden="true" />
              {{ t('content.card.hasTest') }}
            </span>
            <span v-if="book.pages" class="text-xs text-[var(--fg-subtle)]">
              {{ t('content.card.pages', { count: book.pages }) }}
            </span>
          </div>

          <div class="pt-1 flex items-center justify-between text-xs font-bold text-[var(--brand)]">
            <span>{{ t('content.card.read') }}</span>
            <ArrowRight
              class="w-4 h-4 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </div>
        </router-link>
      </div>

      <!-- Filtr bo'yicha bo'sh (TZ 13.3 `empty-filtered`) -->
      <div
        v-else
        class="text-center py-16 space-y-3 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
      >
        <p class="font-bold text-[var(--fg)]">{{ t('content.list.filteredEmptyTitle') }}</p>
        <p class="text-sm max-w-md mx-auto">{{ t('content.list.filteredEmptyDesc') }}</p>
        <button
          type="button"
          class="mt-2 px-6 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold text-sm cursor-pointer"
          @click="clear"
        >
          {{ t('content.filters.clear') }}
        </button>
      </div>
    </template>

    <!-- Bo'lim umuman bo'sh (TZ 13.3 `empty-no-data`) -->
    <div
      v-else
      class="text-center py-16 space-y-2 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
    >
      <p class="font-bold text-[var(--fg)]">{{ t('content.list.emptyTitle') }}</p>
      <p class="text-sm">{{ t('content.list.emptyDesc') }}</p>
    </div>
  </div>
</template>
