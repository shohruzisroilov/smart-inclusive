import { onBeforeUnmount, watch, nextTick, type Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal/drawer uchun klaviatura va skroll xatti-harakati.
 *
 * - `Escape` yopadi
 * - `Tab` fokusni panel ichida ushlab turadi (WCAG 2.1.2 — fokus tuzog'i)
 * - ochilganda `body` skrolli qulflanadi
 * - yopilganda fokus ochgan elementga qaytadi
 */
export function useModalBehavior(
  isOpen: Ref<boolean>,
  panelRef: Ref<HTMLElement | null>,
  onClose: () => void,
) {
  let previouslyFocused: HTMLElement | null = null
  let savedOverflow = ''

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }

    if (event.key !== 'Tab' || !panelRef.value) return

    const items = Array.from(panelRef.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )
    if (items.length === 0) return

    const first = items[0]!
    const last = items[items.length - 1]!
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function lock() {
    previouslyFocused = document.activeElement as HTMLElement | null
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
    void nextTick(() => {
      panelRef.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    })
  }

  function unlock() {
    document.body.style.overflow = savedOverflow
    document.removeEventListener('keydown', onKeydown)
    previouslyFocused?.focus()
    previouslyFocused = null
  }

  watch(isOpen, (open) => (open ? lock() : unlock()))

  onBeforeUnmount(() => {
    if (isOpen.value) unlock()
  })
}
