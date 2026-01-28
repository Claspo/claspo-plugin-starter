/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STATIC_RESOURCES_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
