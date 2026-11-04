---
name: portfolio-voix
description: À utiliser pour écrire, relire ou réécrire un texte du portfolio (contenu, ui.json, README, PR), afin qu'il soit factuel, sans tic d'IA, et équivalent en français et en anglais.
---

# Voix des textes du portfolio

## Quand

Tout texte lu par un visiteur ou un recruteur, et toute relecture d'un texte produit par un modèle.

## Règles

- Chaque phrase porte un nom, une date, un outil ou un chiffre qu'une source du dépôt confirme
  (`src/content/{fr,en}/*.json`). Sans fait, la phrase part.
- Ne pas répéter ce qu'une autre section dit. `docs/audit-ia.md` (B2) a relevé le même paragraphe trois fois ; la
  répétition volontaire est réservée aux machines : nom, rôle, employeur, école restent identiques partout
  (`CLAUDE.md`, GEO).
- L'anglais est réécrit, jamais calqué : il suit le sens, pas l'ordre des mots, et garde les mêmes faits.
- Une convention par texte : apostrophes (droites `'` ou courbes `’`), guillemets (« » avec espaces insécables en
  français), vouvoiement ou tutoiement. Le site vouvoie et dit « je » (`contact.form.*`).
- Tiret cadratin : le compter, car `docs/audit-ia.md` (A2) le range parmi les tics, titres compris.

## Catalogue de tics (à repérer)

| Tic | Exemple à éviter | Réécriture |
| --- | --- | --- |
| Intitulé gonflé | « Ingénieur DevOps » pour un alternant (`audit-ia.md`, B2) | « Alternant DevOps Cloud » |
| Fait absent | « J'interviens en école » sans école ni date (B2) | nom de l'école, date, sujet, ou rien |
| Inventaire sans preuve | 42 technologies sans projet associé (A3) | trois outils reliés à un projet |
| Solennité | « il convient de », « au cœur de » | le verbe direct |
| Intensif creux | « véritable », « réellement », « de nombreux » | le nombre, ou rien |
| Faux contraste | « n'est pas seulement X, mais Y » / « it's not just X, it's Y » | dire Y |
| Série de trois | « fiable, scalable et performant » | le seul adjectif mesuré |
| Formule d'accueil | « N'hésitez pas à », « Que vous soyez… » | l'adresse e-mail et ce qu'on peut demander |
| Formule refusée par le dépôt | « passionné par », « cutting-edge », « delve into » | liste dans `scripts/lib/design-rules.mjs` |
| Conclusion-écho | dernière phrase qui répète la première | la supprimer |

Cas voisin : une affirmation qui se contredit entre sections (`about.body` dit ne pas intervenir en école, le
sous-titre du contact propose d'y intervenir). Le signaler.

## Interdits

- Ajouter un fait qui n'est pas dans la source pour « donner du corps » ; deviner un chiffre ou un nom.
- Corriger un texte du site hors du lot qui le concerne.

## Procédure

1. **Repérer** : relire le texte avec le tableau, lister chaque phrase suspecte et la raison. Ne rien modifier.
2. **Réécrire** : phrase par phrase, avec uniquement les faits de la source ; si un fait manque, poser la question
   au lieu de l'inventer. Garder le même sens en FR et en EN.
3. `npm run check:design` (formules refusées), `npm test` (parité FR/EN), `npm run e2e`.

## Sources du dépôt

- `docs/audit-ia.md`, `docs/design-charter.md`, `scripts/lib/design-rules.mjs`
- `src/content/fr/ui.json`, `src/content/en/ui.json`, `src/lib/i18n.test.ts`, `e2e/geo-entity.spec.ts`
