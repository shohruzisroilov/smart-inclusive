<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, FileText, ArrowRight } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import type { ContentItemDto } from '@/lib/api/types'
import { CONTENT_CATEGORY_PSIXOLOGIYA, CONTENT_CATEGORY_TALIM } from '@/lib/api/constants'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'

const { t, locale } = useI18n()
const articles = ref<ContentItemDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const all = await fetchContentItems()
  articles.value = all.filter(
    (i) => i.categoryId === CONTENT_CATEGORY_PSIXOLOGIYA || i.categoryId === CONTENT_CATEGORY_TALIM
  )
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/for-parents" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>

    <PageHero
      accent="parents"
      :title="t('sections.articlesTitle')"
      :subtitle="t('sections.articlesSubtitle')"
    />

    <SkeletonCardGrid v-if="loading" />

    <div v-else-if="articles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="a in articles"
        :key="a.id"
        :to="`/for-parents/articles/${a.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-sm hover:border-emerald-500 hover:shadow-xl transition-all space-y-3"
      >
        <div v-if="a.coverImageUrl" class="h-40 rounded-2xl overflow-hidden">
          <img
            :src="a.coverImageUrl"
            :alt="localizedTitle(a, locale)"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div v-else class="h-40 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <FileText class="w-10 h-10 text-emerald-600" aria-hidden="true" />
        </div>
        <h3
          class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-emerald-600 transition-colors"
        >
          {{ localizedTitle(a, locale) }}
        </h3>
        <p class="text-xs text-[var(--fg-muted)] leading-relaxed line-clamp-3">
          {{ a.description }}
        </p>
        <div class="pt-1 flex items-center justify-between text-xs font-bold text-emerald-600">
          <span>{{ t('volunteersPage.readMore') }}</span>
          <ArrowRight
            class="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </div>
      </router-link>
    </div>

    <div v-else class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
