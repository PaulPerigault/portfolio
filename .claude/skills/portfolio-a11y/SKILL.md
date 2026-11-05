---
name: portfolio-a11y
description: À utiliser quand une page, un composant ou un jeton de couleur du portfolio change, pour garder zéro violation axe, un nom accessible, un focus visible et des contrastes conformes.
---

# Accessibilité du portfolio

## Quand

Création ou modification d'un composant, d'un lien, d'un formulaire, d'un menu, d'une couleur ou d'un texte alternatif.

## Règles

- Zéro violation axe sur `/fr/`, `/en/`, les mentions légales et la 404, en clair et en sombre, mobile et bureau
  (`e2e/accessibility.spec.ts`, étiquettes `wcag2a` à `wcag22aa`). Ajouter une page ou un état interactif à ce test.
- Tout contrôle a un nom accessible : texte visible, `aria-label` ou texte masqué (`VisuallyHidden`). Le libellé
  existe dans les deux `ui.json`.
- Le focus reste visible (`@paulperigault/css`, base) et l'ordre du clavier suit l'ordre visuel. Le menu mobile est un
  `<dialog>` natif : ne pas le remplacer par un composant maison.
- Contrastes : chaque nouvelle couleur est un jeton défini dans les deux thèmes, et `src/lib/contrast.test.ts` doit
  rester vert (4,5:1 pour le texte, 3:1 pour les contrôles).
- Un lien qui s'ouvre dans un nouvel onglet le dit : `ExternalLink` ajoute `a11y.new_tab` (« s'ouvre dans un nouvel
  onglet » / « opens in a new tab ») et `rel` sûr (`src/components/ui/content-primitives.test.ts`).
- Mouvement : respecter `prefers-reduced-motion` (`base.css`). Tout fonctionne sans JavaScript.
- Sur les critères WCAG 2.2, citer la règle par son nom (cible de pointeur, contraste, focus visible) et ne donner un
  numéro de critère que s'il a été vérifié sur w3.org pendant la session ; aucun numéro n'est écrit ici.

## Interdits

- Retirer ou assouplir une règle axe, ou une exclusion de test, pour faire passer la page.
- Information portée par la couleur seule, emoji comme icône, image porteuse de sens sans alternative.
- `tabindex` positif, `outline: none` sans remplaçant.

## Procédure

1. Écrire le changement avec des éléments natifs (`button`, `a`, `dialog`, `label`).
2. Ajouter les chaînes à `fr/ui.json` et `en/ui.json`.
3. `npm test` (contrastes), puis `npm run build` et `npm run e2e -- accessibility`.
4. Relever ce que l'audit automatique ne couvre pas (lecteur d'écran, zoom, clavier complet) : `docs/audit-ia.md`
   (A6) rappelle qu'il ne voit qu'une partie des défauts. Le noter comme non vérifié plutôt que de le déclarer bon.

## Sources du dépôt

- `e2e/accessibility.spec.ts`, `src/lib/contrast.test.ts`, `src/styles/global.css`, `@paulperigault/tokens`
- `src/components/ui/ExternalLink.astro`, `docs/ui.md`, `docs/audit-ia.md`, `CLAUDE.md` (Conventions)
