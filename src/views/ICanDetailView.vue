<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import type { ContentItemDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'
import VideoPlayer from '@/components/ui/VideoPlayer.vue'
import { getTestForContentItem } from '@/lib/api/tests'
import type { TestDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()
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
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>

    <SkeletonArticle v-if="loading" :lines="4" />

    <div v-else-if="item" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <VideoPlayer v-if="item.youtubeUrl" :item="item" :linked-test="linkedTest" />
      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ item.titleUz }}</h1>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>
