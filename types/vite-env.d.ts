/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add more environment variables here if you need them later
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}