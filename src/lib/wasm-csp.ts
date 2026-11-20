/** Mot-clé CSP qui autorise la compilation WebAssembly, sans ouvrir `eval` ni `unsafe-inline`. */
const WASM_SOURCE = "'wasm-unsafe-eval'";

/** Sous-ensemble de `Astro.csp` utilisé ici (syntaxe de méthode : accepte l'API typée d'Astro). */
interface CspApi {
  insertScriptResource(resource: string): void;
}

/**
 * Autorise l'instanciation du `.wasm` de la scène 3D des certifications. À appeler dans le
 * frontmatter de la **page** (la balise `<meta>` précède le rendu des composants du `<body>`).
 * `insertScriptResource` remplace la source par défaut, d'où `'self'` redonné explicitement.
 */
export function allowWasm(csp: CspApi | undefined): void {
  csp?.insertScriptResource("'self'");
  csp?.insertScriptResource(WASM_SOURCE);
}
