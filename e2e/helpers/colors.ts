/**
 * Les navigateurs sérialisent une couleur oklch avec leur propre précision : WebKit relit 270.7
 * comme 270.700012 (flottant 32 bits). On compare donc les nombres arrondis à 4 décimales.
 */
export const normalizeColor = (color: string): string =>
  color.replace(/\d+\.\d+/g, (value) => String(Number(Number(value).toFixed(4))));
