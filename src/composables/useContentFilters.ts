import { computed, ref, type Ref } from 'vue'
import { useProgressStore } from '@/stores/useProgressStore'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import type {
  ProgressFilter,
  SortOrder,
  TestFilter,
} from '@/components/ui/ContentListFilters.vue'

/**
 * Ro'yxat filtrlari va saralashi (TZ 5.1).
 *
 * Filtrlar BIRLASHADI va hammasi klient tomonda hisoblanadi:
 *   - «test bor/yo'q» — `contentItemId -> test` xaritasidan;
 *   - «topshirilgan» — localStorage'dagi test natijasidan yoki materialning
 *     o'zi ko'rilgan deb belgilanganidan;
 *   - saralash — `publishedDate` bo'yicha, sanasi yo'qlar oxiriga tushadi.
 *
 * Bekendda filtr yo'q — `ContentItemFilterParams` faqat `page/pageSize/search`
 * beradi, shuning uchun bu yerda bajariladi.
 */
export function useContentFilters(
  items: Ref<ContentItemDto[]>,
  testsByContentItem: Ref<Map<number, TestDto>>,
) {
  const progress = useProgressStore()

  const test = ref<TestFilter>('any')
  const progressFilter = ref<ProgressFilter>('any')
  const sort = ref<SortOrder>('newest')

  function linkedTest(item: ContentItemDto): TestDto | undefined {
    return testsByContentItem.value.get(item.id)
  }

  /** Material «bajarilgan» — testi topshirilgan yoki o'zi ko'rilgan bo'lsa. */
  function isDone(item: ContentItemDto): boolean {
    const linked = linkedTest(item)
    if (linked) return progress.isTestPassed(linked.id)
    return progress.isViewed(item.id)
  }

  const filtered = computed(() => {
    let list = [...items.value]

    if (test.value === 'with') list = list.filter((i) => linkedTest(i) !== undefined)
    else if (test.value === 'without') list = list.filter((i) => linkedTest(i) === undefined)

    if (progressFilter.value === 'done') list = list.filter(isDone)
    else if (progressFilter.value === 'todo') list = list.filter((i) => !isDone(i))

    const time = (i: ContentItemDto) =>
      i.publishedDate ? new Date(i.publishedDate).getTime() : null

    list.sort((a, b) => {
      const ta = time(a)
      const tb = time(b)
      // Sanasi yo'q yozuv har doim oxirida — saralash yo'nalishidan qat'i nazar.
      if (ta === null && tb === null) return 0
      if (ta === null) return 1
      if (tb === null) return -1
      return sort.value === 'newest' ? tb - ta : ta - tb
    })

    return list
  })

  function clear() {
    test.value = 'any'
    progressFilter.value = 'any'
    sort.value = 'newest'
  }

  const isFiltered = computed(() => test.value !== 'any' || progressFilter.value !== 'any')

  return { test, progressFilter, sort, filtered, clear, isFiltered, linkedTest, isDone }
}
