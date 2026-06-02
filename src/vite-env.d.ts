/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORKOS_CLIENT_ID: string
  readonly VITE_WORKOS_REDIRECT_URI: string
  readonly VITE_IS_DEV_MODE: boolean
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
