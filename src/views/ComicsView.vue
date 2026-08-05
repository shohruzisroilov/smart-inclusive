<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOpen } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import { CONTENT_TYPE_KOMIKS } from '@/lib/api/constants'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'
import ContentCard from '@/components/ui/ContentCard.vue'
import ContentListFilters from '@/components/ui/ContentListFilters.vue'
import { getTestsByContentItem } from '@/lib/api/tests'
import { useContentFilters } from '@/composables/useContentFilters'

const { t, locale } = useI18n()
const comics = ref<ContentItemDto[]>([])
const loading = ref(true)
const testsByContentItem = ref<Map<number, TestDto>>(new Map())

const { test, progressFilter, sort, filtered, clear, linkedTest, isDone } =
  useContentFilters(comics, testsByContentItem)

onMounted(async () => {
  const [all, tests] = await Promise.all([fetchContentItems(), getTestsByContentItem()])
  testsByContentItem.value = tests
  comics.value = all.filter((item) => item.typeId === CONTENT_TYPE_KOMIKS)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <PageHero
      accent="comics"
      :title="t('sections.comicsTitle')"
      :subtitle="t('sections.comicsSubtitle')"
    />

    <SkeletonCardGrid v-if="loading" />

    <template v-else-if="comics.length > 0">
      <ContentListFilters
        v-model:test="test"
        v-model:progress="progressFilter"
        v-model:sort="sort"
        :shown="filtered.length"
        :total="comics.length"
        @clear="clear"
      />

      <!--
        Planshet asosiy qurilma: 768px dan boshlab ikki ustun, 1024px dan uch.
        Kartochka maketi `ContentCard` da — beshta ro'yxat uchun bitta manba.
      -->
      <div v-if="filtered.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <ContentCard
          v-for="c in filtered"
          :key="c.id"
          :item="c"
          :to="`/comics/${c.id}`"
          section="comics"
          :action-label="t('sections.comicsRead')"
          :has-test="linkedTest(c) !== undefined"
          :done="isDone(c)"
        >
          <template #placeholder>
            <BookOpen class="h-12 w-12 text-[var(--fg-subtle)]" aria-hidden="true" />
          </template>
        </ContentCard>
      </div>

      <div
        v-else
        class="text-center py-16 space-y-3 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
      >
        <p class="font-bold text-[var(--fg)]">{{ t('content.list.filteredEmptyTitle') }}</p>
        <button type="button" class="px-6 py-2.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold text-sm cursor-pointer" @click="clear">
          {{ t('content.filters.clear') }}
        </button>
      </div>
    </template>

    <div v-else class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
