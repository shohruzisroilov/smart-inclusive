/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API manzili (oxirida "/" bo'lmasin). */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
