<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from '@lucide/vue'
import SelectField from './SelectField.vue'

/**
 * Ro'yxatlar uchun filtr va saralash paneli (TZ 5.1).
 *
 * Filtrlar BIRLASHADI — «Test bor» + «Topshirilmagan» ikkalasiga ham mos
 * yozuvlarni qoldiradi.
 *
 * KONTENT TILI FILTRI YO'Q, garchi TZ 2.2 uni talab qilsa ham: backenddagi
 * `ContentItemDto` da `language_id` maydoni umuman yo'q (u faqat `Test`,
 * `VocabularyTopic` va `Slide` da bor). Ya'ni kontent birligining tilini
 * bilishning imkoni yo'q — bekendga maydon qo'shilgach shu yerga yana bitta
 * `SelectField` qo'shiladi.
 */
export type TestFilter = 'any' | 'with' | 'without'
export type ProgressFilter = 'any' | 'done' | 'todo'
export type SortOrder = 'newest' | 'oldest'

const props = defineProps<{
  test: TestFilter
  progress: ProgressFilter
  sort: SortOrder
  /** Filtrlangan va umumiy yozuvlar soni. */
  shown: number
  total: number
}>()

const emit = defineEmits<{
  'update:test': [TestFilter]
  'update:progress': [ProgressFilter]
  'update:sort': [SortOrder]
  clear: []
}>()

const { t } = useI18n()

const testOptions = computed(() => [
  { value: 'any', label: t('content.filters.any') },
  { value: 'with', label: t('content.filters.withTest') },
  { value: 'without', label: t('content.filters.withoutTest') },
])

const progressOptions = computed(() => [
  { value: 'any', label: t('content.filters.any') },
  { value: 'done', label: t('content.filters.completed') },
  { value: 'todo', label: t('content.filters.uncompleted') },
])

const sortOptions = computed(() => [
  { value: 'newest', label: t('content.filters.newest') },
  { value: 'oldest', label: t('content.filters.oldest') },
])

const isDirty = computed(
  () => props.test !== 'any' || props.progress !== 'any' || props.sort !== 'newest',
)
</script>

<template>
  <section
    class="p-4 sm:p-5 rounded-3xl bg-[var(--surface-subtle)] border border-[var(--border-default)] flex flex-wrap items-start gap-4"
    :aria-label="t('content.filters.panelLabel')"
  >
    <SelectField
      class="min-w-44"
      :model-value="test"
      :options="testOptions"
      :label="t('content.filters.testStatus')"
      @update:model-value="emit('update:test', $event as TestFilter)"
    />

    <SelectField
      class="min-w-44"
      :model-value="progress"
      :options="progressOptions"
      :label="t('content.filters.progress')"
      @update:model-value="emit('update:progress', $event as ProgressFilter)"
    />

    <SelectField
      class="min-w-44"
      :model-value="sort"
      :options="sortOptions"
      :label="t('content.filters.sort')"
      @update:model-value="emit('update:sort', $event as SortOrder)"
    />

    <div class="flex items-center gap-3 ml-auto self-end pb-3">
      <button
        v-if="isDirty"
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[var(--brand)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
        @click="emit('clear')"
      >
        <X class="w-4 h-4" aria-hidden="true" />
        <span>{{ t('content.filters.clear') }}</span>
      </button>

      <span class="text-xs font-semibold text-[var(--fg-muted)] tabular-nums">
        {{ shown }} / {{ total }}
      </span>
    </div>
  </section>
</template>
