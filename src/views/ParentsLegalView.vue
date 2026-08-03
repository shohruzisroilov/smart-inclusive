<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ShieldCheck } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import type { ContentItemDto } from '@/lib/api/types'
import { CONTENT_CATEGORY_HUQUQIY } from '@/lib/api/constants'

const { t, locale } = useI18n()
const items = ref<ContentItemDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const all = await fetchContentItems()
  items.value = all.filter((i) => i.categoryId === CONTENT_CATEGORY_HUQUQIY)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/for-parents" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>

    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-3">
      <h1 class="text-3xl sm:text-4xl font-extrabold font-display">{{ t('sections.legalTitle') }}</h1>
      <p class="text-white/90 max-w-xl text-sm leading-relaxed font-light">{{ t('sections.legalSubtitle') }}</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">{{ t('common.loading') }}</div>

    <div v-else-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="item in items"
        :key="item.id"
        :to="`/for-parents/legal/${item.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-sm hover:border-blue-500 hover:shadow-xl transition-all space-y-3"
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
