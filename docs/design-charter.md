# Charte de design v2 : le portfolio suit le design system

Décidée dans l'[ADR-0012](adr/0012-charte-v2-design-system.md), qui remplace l'ADR-0006 (« CV d'abord »). Le portfolio
consomme les paquets publiés `@paulperigault/tokens`, `@paulperigault/css` et `@paulperigault/astro` (0.1.0, documentation
https://design.paulperigault.dev) : les valeurs vivent dans ces paquets, cette page explique ce qu'on en fait, ce qu'on
s'interdit et comment c'est vérifié.

## Identité

- **Lisibilité d'abord**, direction « encre bleue » : fond quasi blanc ou quasi noir, texte encre, un seul accent de teinte
  270,7. Clair et sombre sont définis une seule fois par le design system (`color-scheme: light dark`, `data-theme`
  force un thème).
- **Jetons publiés tels quels** : le portfolio ne redéfinit aucun jeton `--pp-*` et ne construit pas de jetons
  personnalisés. Il ajoute dans `src/styles/global.css`, avec ces jetons, les seuls utilitaires Tailwind absents du
  `theme.css` publié et réellement utilisés.
- **Une famille de texte** : Atkinson Hyperlegible Next, auto-hébergée via `@paulperigault/css`, aucune requête tierce.
- **Mono** : Atkinson Hyperlegible Mono, seulement là où le design system l'autorise : code, identifiants, empreintes,
  métadonnées. Jamais pour décorer un titre ou un libellé.
- **Formes** : rayons `--pp-radius-control` (0,25 rem) et `--pp-radius-surface` (0,5 rem), aucun autre. Filets d'un pixel
  pour structurer ; pas d'ombre. `rounded-control` pour les commandes (boutons, champs), `rounded-surface` pour les
  surfaces (`Card`, liste des compétences).
- **Structure de CV** conservée par le portfolio : titre de section à gauche, contenu à droite (`Section`).
- **Impression** : la feuille d'impression du design system supprime la décoration et écrit l'adresse des liens ; la page
  imprimée reste le CV papier.
- **Mouvement** : courtes transitions de couleur ; `prefers-reduced-motion` respecté.
- **Composants** : ceux de `@paulperigault/astro` quand ils couvrent le besoin ; navigation, pied de page, titre, icône,
  lien externe, lien d'évitement, texte masqué, bascules de langue et de thème, frise avec sous-titre et étiquettes
  restent dans le portfolio, restylés avec les jetons.

## Interdits (et pourquoi)

| Interdit                                                                                         | Raison                                                     |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Dégradés décoratifs                                                                              | Signature des pages générées                               |
| Ombres portées décoratives                                                                       | Profondeur artificielle ; on structure avec des filets     |
| Flou (`backdrop-filter`, `blur`)                                                                 | Effet de mode sans fonction                                |
| Couleur en dur, palette Tailwind, valeur arbitraire (`w-[13px]`, `bg-[#fff]`), `style` en ligne  | Une seule source : les jetons ; CSP sans `unsafe-inline`   |
| Majuscules en étiquettes (avec ou sans espacement), numéros de section (« 01 — »), pastilles-tags | Le design system n'en utilise pas ; marqueurs de gabarit   |
| Mono ou serif décoratifs (hors code, identifiants, empreintes, métadonnées)                      | Une seule voix typographique                               |
| Emoji comme icônes ou décoration, icône décorative par ligne                                     | Illisible aux lecteurs d'écran, générique                  |
| Rayon autre que 0,25 ou 0,5 rem, avatar ou pastille parfaitement ronds                           | Les deux rayons du design system suffisent                 |
| Formules creuses (« passionné par… », « cutting-edge », « solutions innovantes »)                 | On écrit des faits : employeur, technologies, dates        |

Vérification : `scripts/check-design.mjs` (règles `scripts/lib/design-rules.mjs`), `e2e/design-charter.spec.ts` (styles
calculés, FR/EN, clair/sombre), `e2e/print.spec.ts`, revue (checklist de PR). Règles de `check-design` : `gradient`,
`ombre`, `flou`, `couleur-en-dur`, `palette-tailwind`, `valeur-arbitraire`, `famille-typographique` (serif ; mono
sur titre, libellé, bouton, `Heading`, `Button`, `ButtonLink`, cherché dans tout le fichier pour une balise sur
plusieurs lignes), `rayon`, `etiquette-majuscules` (toute capitale, sans exception : `LangSwitch` écrit son code en capitales dans le texte),
`emoji`, `phrase-generique`. Le mono est accepté sur `code`, `kbd`, `samp`, `pre` dans l'e2e.

## Comment ajouter du design

1. Un nouveau rôle de couleur : il appartient au design system (jeton dans les deux thèmes). Le portfolio ne l'invente pas ;
   `src/lib/contrast.test.ts` contrôle les contrastes (4,5:1 texte, 3:1 contrôles).
2. Un motif répété : un composant du design system s'il existe, sinon une brique du portfolio dans
   `src/components/ui/` (voir `docs/ui.md`), stylée uniquement avec les jetons.
3. Un texte : concret, avec nom propre, technologie, date ou chiffre. Si la phrase pourrait s'appliquer à n'importe qui,
   la réécrire.
4. Lancer `npm run check:design` et `npm run e2e`.

## Checklist de revue « design anti-IA »

- [ ] Aucun texte laissé tel que généré : relu et réécrit à la main, sans placeholder.
- [ ] Un seul accent, tous les styles passent par les jetons.
- [ ] Aucun dégradé, ombre décorative, flou, emoji, étiquette en capitales.
- [ ] Provenance des assets connue (photo personnelle, logo `logo.svg`, polices sous licence OFL, icônes maison).
- [ ] Carte de partage et favicons régénérés (`scripts/generate-og-image.mjs`, skill `update-favicon`) si le design change.
- [ ] Contraste AA vérifié en clair **et** en sombre.
