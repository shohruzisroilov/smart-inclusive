/**
 * YouTube IFrame API bilan ishlash (TZ 13.1).
 *
 * NEGA API, oddiy `<iframe>` emas: TZ 10.3 pauza/ijro tugmalarini va tezlik
 * pereklyuchatelini talab qiladi. Oddiy embed'da tezlikni faqat URL parametri
 * bilan berish mumkin edi, u esa iframe'ni QAYTA yuklaydi — ya'ni bola videoni
 * boshidan ko'rishga majbur bo'lardi. API `setPlaybackRate()` ni ijro
 * to'xtamasdan bajaradi.
 */

/** Bizga kerak bo'lgan qismigina — butun YT tiplar to'plamini tortmaslik uchun. */
export interface YouTubePlayer {
  playVideo(): void
  pauseVideo(): void
  setPlaybackRate(rate: number): void
  destroy(): void
}

export const YT_STATE_ENDED = 0
export const YT_STATE_PLAYING = 1
export const YT_STATE_PAUSED = 2

interface YouTubeApi {
  Player: new (
    el: HTMLElement | string,
    options: {
      videoId: string
      playerVars?: Record<string, string | number>
      events?: {
        onReady?: () => void
        onStateChange?: (event: { data: number }) => void
      }
    },
  ) => YouTubePlayer
}

declare global {
  interface Window {
    YT?: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

const API_SRC = 'https://www.youtube.com/iframe_api'

/**
 * Skript BIR MARTA yuklanadi va natijasi keshlanadi.
 *
 * `onYouTubeIframeAPIReady` — global callback, ya'ni YouTube uni bitta marta
 * chaqiradi. Ikkita pleyer bir vaqtda ochilsa, ikkinchisi shu promise'ni
 * kutadi, skriptni qayta ulamaydi.
 */
let apiPromise: Promise<YouTubeApi> | null = null

export function loadYouTubeApi(): Promise<YouTubeApi> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    window.onYouTubeIframeAPIReady = () => {
      if (window.YT?.Player) resolve(window.YT)
      else reject(new Error('YouTube API yuklandi, lekin YT.Player topilmadi'))
    }

    const script = document.createElement('script')
    script.src = API_SRC
    script.async = true
    script.onerror = () => reject(new Error('YouTube API yuklanmadi'))
    document.head.appendChild(script)
  }).catch((error) => {
    // Keshni tozalaymiz, aks holda tarmoq tiklangach ham qayta urinib bo'lmasdi.
    apiPromise = null
    throw error
  })

  return apiPromise
}

/**
 * Havoladan video ID sini ajratadi.
 *
 * Adminka `youtu.be/ID` shaklini beradi, lekin muharrir `watch?v=ID` yoki
 * `embed/ID` ni ham qo'yishi mumkin — uchalasi ham qabul qilinadi.
 */
export function extractVideoId(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url, window.location.origin)

    if (parsed.hostname.endsWith('youtu.be')) {
      return parsed.pathname.slice(1).split('/')[0] || null
    }

    const fromQuery = parsed.searchParams.get('v')
    if (fromQuery) return fromQuery

    const match = /\/(?:embed|shorts|v)\/([^/?#]+)/.exec(parsed.pathname)
    return match?.[1] ?? null
  } catch {
    return null
  }
}
