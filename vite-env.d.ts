/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string; // Define your custom environment variables here
  // Add more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}