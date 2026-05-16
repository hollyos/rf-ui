/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

// Vite's vite/client reference already declares modules for .png, .svg,
// .css, .scss (as string URLs), but it does not declare CSS Modules. The
// shim below makes `import styles from './X.module.scss'` typecheck as a
// `Record<string, string>` so `styles.someClass` is allowed without
// dropping to `any`.
declare module '*.module.scss' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
