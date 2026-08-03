<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Award } from '@lucide/vue'
import AudioPlayer from '@/components/ui/AudioPlayer.vue'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'
import { fetchComicPages, fetchContentItemById } from '@/lib/api/services'
import { getTestForContentItem } from '@/lib/api/tests'
import { useProgressStore } from '@/stores/useProgressStore'
import type { ComicPageDto, ContentItemDto, TestDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()
const progress = useProgressStore()

const contentItemId = Number(route.params.id)
const comic = ref<ContentItemDto | null>(null)
const pages = ref<ComicPageDto[]>([])
const linkedTest = ref<TestDto | null>(null)
const currentPage = ref(0)
const loading = ref(true)

const page = computed(() => pages.value[currentPage.value])
const isLastPage = computed(() => currentPage.value === pages.value.length - 1)

/** Xatcho'p — sahifa RAQAMI saqlanadi, massiv indeksi emas (TZ 13.5). */
const bookmarkedPage = computed(() => progress.getBookmark(contentItemId))
const isOnBookmark = computed(() => page.value?.pageNumber === bookmarkedPage.value)

function saveBookmark() {
  if (page.value) progress.setBookmark(contentItemId, page.value.pageNumber)
}

function goToBookmark() {
  const idx = pages.value.findIndex((p) => p.pageNumber === bookmarkedPage.value)
  if (idx >= 0) currentPage.value = idx
}

/** Oxirgi sahifaga yetganda material «o'qildi» deb belgilanadi (TZ 3.4). */
function next() {
  if (isLastPage.value) return
  currentPage.value++
  if (isLastPage.value) progress.markViewed(contentItemId)
}

onMounted(async () => {
  if (Number.isInteger(contentItemId)) {
    const [item, pageList, test] = await Promise.all([
      fetchContentItemById(contentItemId),
      fetchComicPages(contentItemId),
      getTestForContentItem(contentItemId),
    ])
    comic.value = item
    pages.value = pageList
    linkedTest.value = test
    if (pageList.length === 1) progress.markViewed(contentItemId)
  }
  loading.value = false
})
</script>

<template>
  <div class="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <div class="flex items-center justify-between gap-4">
      <router-link
        :to="`/comics/${route.params.id}`"
        class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
      >
        <ArrowLeft class="w-4 h-4" aria-hidden="true" />
        <span>{{ t('reader.backToLibrary') }}</span>
      </router-link>

      <div v-if="pages.length > 0" class="text-xs font-bold text-[var(--fg-muted)] tabular-nums">
        {{ t('reader.pageCounter', { current: currentPage + 1, total: pages.length }) }}
      </div>
    </div>

    <SkeletonArticle v-if="loading" :lines="3" />

    <div
      v-else-if="pages.length > 0 && page"
      class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-2xl space-y-6"
    >
      <div
        class="h-96 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4"
      >
        <img
          v-if="page.imageUrl"
          :src="page.imageUrl"
          :alt="`${comic?.titleUz ?? ''} — ${page.pageNumber}`"
          class="max-h-full max-w-full object-contain"
        />
        <div v-else class="text-center text-[var(--fg-subtle)] text-sm">
          {{ t('reader.noImage') }}
        </div>
      </div>

      <p v-if="page.script" class="text-lg text-[var(--fg)] leading-relaxed whitespace-pre-line">
        {{ page.script }}
      </p>

      <!-- Ovoz uch tilda, interfeys tilidan mustaqil (TZ 11) -->
      <div class="flex flex-wrap items-center gap-3">
        <AudioPlayer
          :uz="page.audioUrlUz"
          :ru="page.audioUrlRu"
          :en="page.audioUrlEn"
          :status-uz="page.audioGenerationStatusIdUz"
          :status-ru="page.audioGenerationStatusIdRu"
          :status-en="page.audioGenerationStatusIdEn"
        />

        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border-default)] text-sm font-bold text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
          :aria-pressed="isOnBookmark"
          @click="saveBookmark"
        >
          <component
            :is="isOnBookmark ? BookmarkCheck : Bookmark"
            class="w-4 h-4"
            aria-hidden="true"
          />
          <span>{{ isOnBookmark ? t('reader.bookmarkSaved') : t('reader.bookmarkSave') }}</span>
        </button>

        <!-- Faqat xatcho'p bor VA boshqa sahifada turgan bo'lsa (TZ 10.2) -->
        <button
          v-if="bookmarkedPage !== null && !isOnBookmark"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--surface-subtle)] text-sm font-bold text-[var(--brand)] hover:opacity-80 transition-opacity cursor-pointer"
          @click="goToBookmark"
        >
          {{ t('reader.bookmarkReturn', { page: bookmarkedPage }) }}
        </button>
      </div>

      <div class="pt-4 flex items-center justify-between border-t border-[var(--border-default)]">
        <button
          type="button"
          class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === 0"
          @click="currentPage--"
        >
          <ChevronLeft class="w-4 h-4 inline mr-1" aria-hidden="true" />
          {{ t('reader.prev') }}
        </button>

        <button
          type="button"
          class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="isLastPage"
          @click="next"
        >
          {{ t('reader.next') }}
          <ChevronRight class="w-4 h-4 inline ml-1" aria-hidden="true" />
        </button>
      </div>

      <!--
        TZ 10.4: test bo'lmasa tugma UMUMAN chiqmaydi; bor-u lekin oxirgi
        sahifaga yetilmagan bo'lsa — nofaol va sababi yozib qo'yiladi.
      -->
      <div
        v-if="linkedTest"
        class="pt-4 border-t border-[var(--border-default)] text-center space-y-2"
      >
        <p class="text-sm text-[var(--fg-muted)]">
          {{ isLastPage ? t('reader.testPrompt') : t('reader.readToEnd') }}
        </p>
        <router-link
          v-if="isLastPage"
          :to="`/tests/${linkedTest.id}`"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold shadow-lg hover:opacity-90 transition-all"
        >
          <Award class="w-5 h-5" aria-hidden="true" />
          <span>{{ t('reader.goToTest') }}</span>
        </router-link>
        <span
          v-else
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--surface-muted)] text-[var(--fg-subtle)] font-bold cursor-not-allowed"
          aria-disabled="true"
        >
          <Award class="w-5 h-5" aria-hidden="true" />
          <span>{{ t('reader.goToTest') }}</span>
        </span>
      </div>
    </div>

    <div
      v-else
      class="text-center py-20 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
    >
      {{ t('reader.emptyPages') }}
    </div>
  </div>
</template>
