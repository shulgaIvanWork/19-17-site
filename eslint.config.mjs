// Линтер по документации Next 16: команда next lint из этой версии убрана,
// конфигурация плоская. core-web-vitals добавляет правила Next, React и хуков,
// typescript - правила typescript-eslint.
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
