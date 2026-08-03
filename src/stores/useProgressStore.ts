import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getBookmarks,
  getTestResults,
  getViewed,
  markViewed as persistViewed,
  saveTestResult as persistTestResult,
  setBookmark as persistBookmark,
  type TestResult,
} from '@/lib/storage/progress'

/**
 * Progressning REAKTIV qobig'i.
 *
 * `lib/storage/progress.ts` diskka yozadi, bu store esa uni Vue reaktivligiga
 * bog'laydi — aks holda test topshirilganda ro'yxatdagi «Topshirilgan» belgisi
 * sahifa qayta yuklanmaguncha paydo bo'lmasdi.
 */
export const useProgressStore = defineStore('progress', () => {
  const viewed = ref<Record<number, true>>(getViewed())
  const bookmarks = ref<Record<number, number>>(getBookmarks())
  const testResults = ref<Record<number, TestResult>>(getTestResults())

  function markViewed(contentItemId: number) {
    persistViewed(contentItemId)
    viewed.value = { ...viewed.value, [contentItemId]: true }
  }

  function isViewed(contentItemId: number): boolean {
    return viewed.value[contentItemId] === true
  }

  function setBookmark(contentItemId: number, pageNumber: number) {
    persistBookmark(contentItemId, pageNumber)
    bookmarks.value = { ...bookmarks.value, [contentItemId]: pageNumber }
  }

  function getBookmark(contentItemId: number): number | null {
    return bookmarks.value[contentItemId] ?? null
  }

  function saveTestResult(testId: number, score: number, total: number): TestResult {
    const result = persistTestResult(testId, score, total)
    testResults.value = { ...testResults.value, [testId]: result }
    return result
  }

  function getTestResult(testId: number): TestResult | null {
    return testResults.value[testId] ?? null
  }

  /** Kartochkadagi «Topshirilgan» belgisi shu yerdan hisoblanadi (TZ 5.1). */
  function isTestPassed(testId: number | null | undefined): boolean {
    if (testId == null) return false
    return testResults.value[testId]?.passed === true
  }

  return {
    viewed,
    bookmarks,
    testResults,
    markViewed,
    isViewed,
    setBookmark,
    getBookmark,
    saveTestResult,
    getTestResult,
    isTestPassed,
  }
})
