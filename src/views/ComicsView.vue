<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOpen, ArrowRight } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import { CONTENT_TYPE_KOMIKS } from '@/lib/api/constants'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'
import ContentListFilters from '@/components/ui/ContentListFilters.vue'
import { getTestsByContentItem } from '@/lib/api/tests'
import { useContentFilters } from '@/composables/useContentFilters'

const { t } = useI18n()
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

      <div v-if="filtered.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="c in filtered"
        :key="c.id"
        :to="`/comics/${c.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-xl transition-all space-y-4"
      >
        <div class="h-48 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4">
          <img v-if="c.coverImageUrl" :src="c.coverImageUrl" :alt="c.titleUz" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
          <BookOpen v-else class="w-12 h-12 text-[var(--fg-subtle)]" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--brand)] transition-colors">{{ c.titleUz }}</h3>
          <p class="text-xs text-[var(--fg-muted)] mt-1 line-clamp-2">{{ c.description }}</p>
        </div>
        <div class="pt-2 flex items-center justify-between text-xs font-bold text-[var(--brand)]">
          <span>{{ t('sections.comicsRead') }}</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </router-link>
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
