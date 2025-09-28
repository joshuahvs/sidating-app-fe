/* Allow importing .vue files in TypeScript
   This file provides a minimal module declaration so tools like
   vue-tsc and the TypeScript language server accept imports of
   single-file Vue components.
*/
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
