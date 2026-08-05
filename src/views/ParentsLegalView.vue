<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ShieldCheck } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import { inArticleCategory, localizedTitle } from '@/lib/api/content'
import type { ContentItemDto } from '@/lib/api/types'
import { ARTICLE_CATEGORY_HUQUQIY, CONTENT_CATEGORY_HUQUQIY } from '@/lib/api/constants'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'

const { t, locale } = useI18n()
const items = ref<ContentItemDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const all = await fetchContentItems()
  // Ikkala turkumlash usuli ham qabul qilinadi — sababi `inArticleCategory` da.
  items.value = all.filter((i) =>
    inArticleCategory(i, CONTENT_CATEGORY_HUQUQIY, ARTICLE_CATEGORY_HUQUQIY),
  )
  loading.value = false
})
</script>

<template>
  <div class="pt-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <router-link to="/for-parents" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>{{ t('common.back') }}</span>
    </router-link>

    <PageHero
      accent="parents"
      :title="t('sections.legalTitle')"
      :subtitle="t('sections.legalSubtitle')"
    />

    <SkeletonCardGrid v-if="loading" />

    <div v-else-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="item in items"
        :key="item.id"
        :to="`/for-parents/legal/${item.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-blue-500 transition-all space-y-3"
      >
        <ShieldCheck class="w-8 h-8 text-blue-600" aria-hidden="true" />
        <h3
          class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-blue-600 transition-colors"
        >
          {{ localizedTitle(item, locale) }}
        </h3>
        <p class="text-xs text-[var(--fg-muted)] leading-relaxed line-clamp-3">
          {{ item.description }}
        </p>
      </router-link>
    </div>

    <div v-else class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
