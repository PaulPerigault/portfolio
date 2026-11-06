# Primitives UI

Composants Astro **sans logique métier** de `src/components/ui/`. Ils reçoivent des props typées (`interface Props`), n'importent que `lib/` et ne connaissent ni le contenu, ni les services, ni les sections (règle de couches vérifiée par `npm run check:layers`). Toutes les couleurs, tailles et espacements viennent des jetons de `@paulperigault/tokens` — jamais de valeur en dur.

Il n'y a plus de vitrine : les pages `/fr/styleguide/` et `/en/styleguide/` ont été retirées (#295), le catalogue de la documentation du design system (https://design.paulperigault.dev) montre les composants publiés. Ces briques-ci sont vérifiées sur les vraies pages.

| Composant                   | Rôle                                                                                                                     | Props principales                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `Container`                 | Largeur max de page + gouttière                                                                                          | `as` (`div`, `header`, `nav`, `footer`), `class`                                                             |
| `Section`                   | Section ancrée, nommée par son titre (`aria-labelledby`)                                                                 | `id`, `title` (titre à gauche, contenu à droite)                                                             |
| `Heading`                   | Titre h1–h4 ; **niveau sémantique découplé de la taille**                                                                | `level`, `size` (`display`, `2xl`, `xl`, `lg`), `id`, `class`                                                |
| `Card`                      | Surface à filet et rayon `rounded-surface`, sans ombre                                                                   | `as` (`div`, `li`, `article`), `interactive`                                                                 |
| `ButtonLink`                | Lien stylé en bouton ; lien externe → `target`/`rel` sûrs automatiques                                                   | `href`, `variant` (`primary`, `secondary`), `icon`, `newTabLabel`, `download`                                |
| `ExternalLink`              | Lien de texte sortant + annonce « nouvel onglet »                                                                        | `href`, `newTabLabel`                                                                                        |
| `Icon`                      | SVG décoratif (`aria-hidden`), jeu défini dans `lib/icons.ts`                                                            | `name`                                                                                                       |
| `DescriptionList`           | `<dl>` terme/description                                                                                                 | `items`                                                                                                      |
| `Timeline` / `TimelineItem` | Liste ordonnée chronologique (titre puis date, en ligne à partir de `sm`)                                                | `title`, `subtitle`, `period`, `dateTime`                                                                    |
| `FormField`                 | `Field` du design system + champ (`input`/`textarea`) + zone d'erreur reliée par `aria-describedby` (remplie par le script du formulaire) | `id`, `name`, `label`, `type` (`text`, `email`, `textarea`), `maxlength`, `autocomplete`, `required`, `rows` |
| `VisuallyHidden`            | Texte réservé aux lecteurs d'écran                                                                                       | slot                                                                                                         |
| `SkipLink`                  | Lien d'évitement (premier arrêt clavier)                                                                                 | `label`, `target`                                                                                            |

## Composants du design system utilisés

Importés de `@paulperigault/astro` 0.1.0 (version de `package.json`). La liste vient des imports présents dans `src/` :

| Composant | Importé par | Usage |
| --------- | ----------- | ----- |
| `Photo`   | `sections/Hero.astro` | Photo du hero (AVIF, WebP, repli JPEG) |
| `Prose`   | `sections/LegalDocument.astro` | Paragraphes des mentions légales |
| `Button`  | `interactive/ContactForm.astro` | Bouton d'envoi du formulaire |
| `Field`   | `ui/FormField.astro` | Libellé, aide et erreur autour des champs natifs |

Le reste de `src/components/` est propre au portfolio : les primitives ci-dessus, la navigation, le pied de page, les
sections et `ButtonLink` (le `Button` publié n'a ni `target`, ni `rel`, ni `download`).

## Règles d'usage

- **Un motif répété = une primitive.** Si un bloc de classes apparaît deux fois, il devient un composant ici.
- **Textes traduits en amont** : les primitives reçoivent des chaînes (`newTabLabel`, `period`…), elles n'appellent pas `t()`.
- **Liens** : `lib/links.ts` (`linkAttributes`) décide de `target="_blank" rel="noopener noreferrer"` ; ne jamais l'écrire à la main.
- **Icônes** : ajouter le tracé dans `lib/icons.ts` (grille 24, trait 1.5) ; les icônes restent décoratives, le sens passe par du texte.
- **Nouvelle primitive** : props typées, courte (convention ; la limite contrôlée par `npm run check:size` est de 120 lignes), test de rendu (`*.test.ts` avec `src/test/render.ts`), usage réel dans une section, ligne dans ce tableau.

## Tests

- Rendu : Container API d'Astro (`src/components/ui/*.test.ts`) — props → HTML.
- E2E : `e2e/ui-primitives.spec.ts` sur `/<lang>/` et `/<lang>/legal/` (hiérarchie des titres, repères nommés, liens sûrs, liens internes, icônes décoratives) et navigation clavier avec focus visible sur les mentions légales, FR et EN.
