<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Expand,
  FileDown,
  Shrink,
} from '@lucide/vue'
import { pdfjs, type PdfDocument } from '@/lib/pdf/pdfjs'
import { useProgressStore } from '@/stores/useProgressStore'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'

/**
 * Sahifama-sahifa PDF o'quvchisi (TZ 10.1–10.2).
 *
 * TZ material PDF sifatida yuklanishini va reader uni SAHIFAMA-SAHIFA
 * ko'rsatishini talab qiladi: «X / N sahifa» hisoblagichi, «Orqaga»/«Oldinga»,
 * xatcho'p. Brauzerning o'z PDF ko'ruvchisi bularning hech birini bermaydi va
 * uni boshqarib ham bo'lmaydi, shuning uchun sahifa `pdf.js` bilan canvas'ga
 * chiziladi.
 *
 * Yuklab olish va yangi oynada ochish havolalari HAR DOIM qoladi — ba'zi
 * qurilmalarda canvas og'ir kelishi mumkin va foydalanuvchi hech qachon
 * faylsiz qolmasligi kerak.
 */
const props = defineProps<{
  url: string
  title: string
  /** Xatcho'p va «o'qildi» statusi shu yozuvga bog'lanadi. */
  contentItemId: number
}>()

/** Oxirgi sahifaga yetilgani — ota komponent test tugmasini shunga qarab ochadi. */
const emit = defineEmits<{ 'update:atEnd': [boolean] }>()

const { t } = useI18n()
const progress = useProgressStore()

const canvas = ref<HTMLCanvasElement | null>(null)
const frame = ref<HTMLElement | null>(null)

/**
 * `shallowRef` — SHART, oddiy `ref` emas.
 *
 * `ref()` obyektni chuqur reaktiv Proxy'ga o'raydi. pdf.js hujjati esa private
 * maydonlardan (`#field`) foydalanadi va ular Proxy orqali o'qilganda
 * «Cannot read private member ... from an object whose class did not declare
 * it» xatosi tashlanadi — natijada sahifa umuman chizilmaydi. `shallowRef`
 * obyektni xom holida saqlaydi.
 */
const doc = shallowRef<PdfDocument | null>(null)
const pageCount = ref(0)
const currentPage = ref(1)
const loading = ref(true)
const failed = ref(false)

/**
 * To'liq ekranli o'qish rejimi.
 *
 * Kitobni SAYTNING O'ZIDA oxirigacha o'qish uchun. Avval bu yerda «yangi
 * oynada ochish» tugmasi turardi va u foydalanuvchini brauzerning PDF
 * ko'ruvchisiga olib chiqib ketardi — u yerda na xatcho'p, na progress, na
 * saytning o'zi qoladi.
 *
 * Brauzerning `requestFullscreen` API'si ishlatilmaydi: iOS Safari uni
 * videodan boshqa elementga bermaydi, planshet esa asosiy qurilma. O'rniga
 * o'quvchi butun ekranni egallaydigan qatlamga aylanadi — natija bir xil,
 * lekin hamma joyda ishlaydi.
 */
const isFullscreen = ref(false)
let savedOverflow = ''

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = savedOverflow
  }

  // O'lcham o'zgardi — sahifa qayta chiziladi.
  void nextTick(() => renderPage(currentPage.value))
}

const isFirst = computed(() => currentPage.value <= 1)
const isLast = computed(() => pageCount.value > 0 && currentPage.value >= pageCount.value)

const bookmarkedPage = computed(() => progress.getBookmark(props.contentItemId))
const isOnBookmark = computed(() => bookmarkedPage.value === currentPage.value)

/**
 * Chizish navbati. `page.render()` bir canvas ustida ikki marta parallel
 * chaqirilsa pdf.js xato beradi, shuning uchun avvalgi vazifa bekor qilinadi.
 */
let renderTask: { cancel: () => void; promise: Promise<void> } | null = null

async function renderPage(pageNumber: number) {
  const pdf = doc.value
  const el = canvas.value
  if (!pdf || !el) return

  renderTask?.cancel()

  const page = await pdf.getPage(pageNumber)
  const containerWidth = frame.value?.clientWidth ?? el.clientWidth ?? 800

  // Ekran zichligini hisobga olamiz, aks holda Retina'da sahifa xira chiqadi.
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const base = page.getViewport({ scale: 1 })

  /*
     Odatda sahifa KENGLIKKA moslashadi va pastga aylantiriladi. To'liq
     ekranda esa balandlik ham cheklangan: sahifa to'liq ko'rinishi kerak,
     aks holda «to'liq ekran» degani shunchaki kattaroq skroll bo'lardi.
  */
  const availableHeight = frame.value?.clientHeight ?? 0
  const widthScale = containerWidth / base.width
  const scale =
    isFullscreen.value && availableHeight > 0
      ? Math.min(widthScale, availableHeight / base.height)
      : widthScale

  const viewport = page.getViewport({ scale: scale * dpr })

  el.width = Math.floor(viewport.width)
  el.height = Math.floor(viewport.height)
  if (isFullscreen.value) {
    el.style.width = 'auto'
    el.style.height = '100%'
  } else {
    el.style.width = '100%'
    el.style.height = 'auto'
  }

  const context = el.getContext('2d')
  if (!context) return

  const task = page.render({ canvas: el, canvasContext: context, viewport })
  renderTask = task
  try {
    await task.promise
  } catch (error) {
    // Bekor qilingan vazifa xato emas — foydalanuvchi shunchaki sahifani almashtirdi.
    if ((error as { name?: string })?.name !== 'RenderingCancelledException') throw error
  }
}

function go(pageNumber: number) {
  if (pageNumber < 1 || pageNumber > pageCount.value) return
  currentPage.value = pageNumber
}

/** Oxirgi sahifaga yetilsa material «o'qildi» deb belgilanadi (TZ 3.4). */
watch(
  [currentPage, pageCount],
  () => {
    void renderPage(currentPage.value)
    const atEnd = isLast.value
    emit('update:atEnd', atEnd)
    if (atEnd) progress.markViewed(props.contentItemId)
  },
  { flush: 'post' },
)

// --- Svayp (TZ 13.6): planshet va telefonda tugmalardan tashqari ---------
let touchStartX = 0
let touchStartY = 0

function onTouchStart(event: TouchEvent) {
  const touch = event.changedTouches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

function onTouchEnd(event: TouchEvent) {
  const touch = event.changedTouches[0]
  if (!touch) return
  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY
  // Vertikal harakat kattaroq bo'lsa — bu skroll, sahifa almashtirish emas.
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return
  go(currentPage.value + (dx < 0 ? 1 : -1))
}

// --- Klaviatura: o'q tugmalari bilan sahifalash --------------------------
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') go(currentPage.value + 1)
  else if (event.key === 'ArrowLeft') go(currentPage.value - 1)
  else if (event.key === 'Escape' && isFullscreen.value) toggleFullscreen()
}

let resizeTimer: ReturnType<typeof setTimeout> | undefined
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => void renderPage(currentPage.value), 150)
}

/**
 * Yuklash vazifasi saqlanadi: tarmoq so'rovlarini to'xtatib, vorkerni bo'shatish
 * aynan SHU obyektning `destroy()` i orqali bo'ladi (hujjatning o'zida bu metod
 * yo'q), aks holda sahifadan chiqilgach vorker osilib qolaverardi.
 */
let loadingTask: ReturnType<typeof pdfjs.getDocument> | null = null

onMounted(async () => {
  try {
    loadingTask = pdfjs.getDocument({ url: props.url })
    doc.value = await loadingTask.promise
    pageCount.value = doc.value.numPages
    // Xatcho'p bo'lsa o'sha sahifadan boshlanadi.
    const saved = progress.getBookmark(props.contentItemId)
    currentPage.value = saved && saved <= pageCount.value ? saved : 1
    // Bir sahifali material darhol o'qilgan hisoblanadi.
    if (pageCount.value === 1) progress.markViewed(props.contentItemId)
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  document.body.style.overflow = savedOverflow
  window.removeEventListener('resize', onResize)
  clearTimeout(resizeTimer)
  renderTask?.cancel()
  void loadingTask?.destroy()
})
</script>

<template>
  <!--
    To'liq ekranda o'quvchi butun oynani egallaydi: sahifa katta ko'rinadi,
    boshqaruvlar esa o'z joyida qoladi — xatcho'p, sahifalash, progress
    hammasi ishlayveradi. Bu «yangi oynada ochish» dan farqi: u foydalanuvchini
    brauzerning PDF ko'ruvchisiga chiqarib yuborardi va u yerda bularning
    hech biri qolmasdi.
  -->
  <section
    :class="
      isFullscreen
        ? 'fixed inset-0 z-[var(--z-modal)] flex flex-col gap-3 bg-[var(--page-bg)] p-3 sm:p-4'
        : 'space-y-4'
    "
  >
    <SkeletonArticle v-if="loading" :lines="3" />

    <!-- pdf.js ocha olmadi: fayl baribir yuklab olinadi -->
    <p
      v-else-if="failed"
      class="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-subtle)] py-10 text-center text-sm text-[var(--fg-muted)]"
    >
      {{ t('reader.pdfError') }}
    </p>

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span class="text-xs font-bold tabular-nums text-[var(--fg-muted)]">
          {{ t('reader.pageCounter', { current: currentPage, total: pageCount }) }}
        </span>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] px-4 py-2 text-xs font-bold text-[var(--fg)] transition-colors hover:bg-[var(--surface-subtle)] cursor-pointer"
            :aria-pressed="isOnBookmark"
            @click="progress.setBookmark(contentItemId, currentPage)"
          >
            <component
              :is="isOnBookmark ? BookmarkCheck : Bookmark"
              class="h-3.5 w-3.5"
              aria-hidden="true"
            />
            <span>{{ isOnBookmark ? t('reader.bookmarkSaved') : t('reader.bookmarkSave') }}</span>
          </button>

          <!-- Faqat xatcho'p bor VA boshqa sahifada turgan bo'lsa (TZ 10.2) -->
          <button
            v-if="bookmarkedPage !== null && !isOnBookmark"
            type="button"
            class="rounded-full bg-[var(--surface-subtle)] px-4 py-2 text-xs font-bold text-[var(--brand-text)] transition-opacity hover:opacity-80 cursor-pointer"
            @click="go(bookmarkedPage!)"
          >
            {{ t('reader.bookmarkReturn', { page: bookmarkedPage }) }}
          </button>

          <button
            type="button"
            :aria-pressed="isFullscreen"
            class="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-xs font-bold text-[var(--brand-text)] transition-colors hover:bg-[var(--brand)] hover:text-[var(--fg-on-brand)] cursor-pointer"
            @click="toggleFullscreen"
          >
            <component :is="isFullscreen ? Shrink : Expand" class="h-3.5 w-3.5" aria-hidden="true" />
            <span>{{ isFullscreen ? t('reader.exitFullscreen') : t('reader.fullscreen') }}</span>
          </button>
        </div>
      </div>

      <div
        ref="frame"
        class="flex items-center justify-center overflow-hidden border border-[var(--border-default)] bg-[var(--surface-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
        :class="isFullscreen ? 'min-h-0 flex-1 rounded-xl' : 'rounded-2xl'"
        tabindex="0"
        role="group"
        :aria-label="t('reader.pdfFrameTitle', { title })"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
        @keydown="onKeydown"
      >
        <canvas ref="canvas" class="block" :class="isFullscreen ? 'max-h-full' : 'w-full'" />
      </div>

      <div class="flex items-center justify-between gap-4">
        <button
          type="button"
          class="si-btn si-btn-quiet px-6 text-sm disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="isFirst"
          @click="go(currentPage - 1)"
        >
          <ChevronLeft class="h-4 w-4" aria-hidden="true" />
          <span>{{ t('reader.prev') }}</span>
        </button>

        <button
          type="button"
          class="si-btn si-btn-quiet px-6 text-sm disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="isLast"
          @click="go(currentPage + 1)"
        >
          <span>{{ t('reader.next') }}</span>
          <ChevronRight class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </template>

    <!-- Yuklab olish to'liq ekranda ortiqcha: u yerda odam o'qiyapti. -->
    <a
      v-if="!isFullscreen"
      :href="url"
      download
      class="si-btn si-btn-quiet inline-flex w-fit items-center gap-2 rounded-full px-5 text-sm font-bold"
    >
      <FileDown class="h-4 w-4" aria-hidden="true" />
      <span>{{ t('reader.downloadPdf') }}</span>
    </a>
  </section>
</template>
