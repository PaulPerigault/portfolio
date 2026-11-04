---
name: portfolio-persuasion
description: À utiliser pour rédiger ou relire un titre, un chiffre, une preuve ou un appel à l'action du portfolio, afin de convaincre par des faits vérifiables sans manipuler.
---

# Persuasion honnête du portfolio

## Quand

Un texte cherche à faire agir ou à faire croire : titre de section, appel à l'action, chiffre, mise en avant d'un
projet ou d'une certification.

## Règles

- La preuve passe avant l'affirmation : lien, date, nom d'employeur ou de projet, mesure. Une affirmation sans preuve
  visible est retirée ou reformulée plus bas.
- Un titre ou un intitulé se limite à ce que les données disent (`hero.role`, expériences, certifications). Le
  décalage entre « ingénieur » et « alternant » est le cas d'école relevé par `docs/audit-ia.md` (B2).
- Un chiffre est exact, daté et sourcé : mesure du dépôt (`docs/perf-baseline-migration.md`), donnée GitHub lue au
  build, date de certification. Pas d'arrondi flatteur.
- Un appel à l'action est un verbe qui annonce ce qui se passe (« Télécharger le CV » / « Download CV »,
  « Me contacter » / « Get in touch » : `hero.cta_cv`, `hero.cta_contact`) et ne promet rien d'autre.
- Test « persuader ou manipuler » : le visiteur, informé de ma technique, déciderait-il de la même façon ? Si la
  réponse dépend de son ignorance, c'est de la manipulation : réécrire.
- Un manque se dit au lieu de se masquer : ce qui n'existe pas encore est écrit tel quel, sans formule qui le
  contourne.

## Interdits

- Rareté (« places limitées »), compte à rebours, urgence inventée.
- Preuve sociale fabriquée : faux témoignage, logos de clients sans accord, compteur gonflé.
- Superlatif sans preuve (« meilleur », « expert en tout », « le plus rapide »).
- Culpabilisation, pression, case pré-cochée, bouton qui cache l'option contraire.
- Chiffre non mesuré, ou mesuré dans d'autres conditions que celles dites.

## Procédure

1. Pour chaque phrase qui cherche à convaincre, écrire à côté la source du dépôt qui la prouve.
2. Sans source : la supprimer, la déplacer là où la preuve existe, ou demander le fait à Paul.
3. Passer le test « persuader ou manipuler » sur le titre et sur l'appel à l'action.
4. Vérifier la parité FR/EN et que les formules refusées par `npm run check:design` sont absentes.

## Hors périmètre

Le récit, les résultats et le CV ne se rédigent pas ici : ce sont les faits de Paul (`docs/passation-portfolio.md`,
mission). Ce skill relit, il n'invente pas.

## Sources du dépôt

- `docs/audit-ia.md` (A2, A3, B2), `docs/design-charter.md`, `docs/passation-portfolio.md`
- `docs/perf-baseline-migration.md`, `scripts/lib/design-rules.mjs`, `src/content/{fr,en}/ui.json`
