---
name: portfolio-ux
description: À utiliser pour écrire ou revoir un libellé de bouton, un message d'erreur, un état vide ou une clé de ui.json du portfolio, en français et en anglais.
---

# Textes d'interface du portfolio

## Quand

Ajout ou changement d'une chaîne de `src/content/{fr,en}/ui.json`, d'un message du formulaire de contact ou d'un état
vide.

## Règles

- Un bouton fait une seule chose, nommée par un verbe : « Envoyer » / « Send », « Télécharger le CV » /
  « Download the CV » (`hero.cta_cv`, `contact.form.submit`).
- Une erreur dit quoi, pourquoi, comment corriger. Modèle du dépôt : « Indiquez une adresse e-mail complète, par
  exemple nom@domaine.fr. » / « Enter a full email address, for example name@example.com. »
  (`contact.form.error_email`). Une erreur serveur donne une autre voie : `contact.form.unavailable` offre l'e-mail.
- Un état vide propose une suite : lien, action ou explication de ce qui l'alimente (`projects.empty`).
- Même mot pour la même chose, dans une langue et d'une langue à l'autre : « Contact » / « Contact », « Stack »
  / « Stack ». Relever les clés voisines avant d'en créer une.
- Clé modifiée ou ajoutée : dans `fr/ui.json` **et** `en/ui.json`, même forme (`src/lib/i18n.ts` et
  `src/lib/i18n.test.ts` échouent sinon). Anglais réécrit, pas traduit mot à mot.
- Vouvoiement et « je » dans le formulaire, comme les chaînes existantes ; ne pas mêler tutoiement et vouvoiement.
- Un état est annoncé (`role="status"`) et le focus va au premier champ invalide (`CLAUDE.md`, contact form).

## Interdits

- « Soumettre » / « Submit », « Oups » / « Oops », « pour le moment », point d'exclamation.
- Message d'erreur qui blâme (« Vous avez mal saisi… ») ou qui ne dit pas quoi faire.
- Texte dans une image, libellé « Cliquez ici », bouton à deux actions.

## Procédure

1. Chercher la chaîne voisine dans `fr/ui.json` et reprendre son vocabulaire.
2. Écrire FR puis EN, vérifier que les deux disent la même chose avec les mêmes faits.
3. `npm run check` (types des clés), `npm test` (`i18n.test.ts`, parité), `npm run e2e` (`i18n.spec.ts`,
   `contact-form.spec.ts` si le formulaire change).
4. Signaler dans la PR toute chaîne existante qui enfreint ces règles sans la corriger hors périmètre. Exemples lus
   aujourd'hui : « Aucun projet à afficher pour le moment. » (`projects.empty`) emploie « pour le moment », et
   `fr/ui.json` mélange apostrophes droites et courbes.

## Sources du dépôt

- `src/content/fr/ui.json`, `src/content/en/ui.json`, `src/lib/i18n.ts`, `src/lib/i18n.test.ts`
- `e2e/i18n.spec.ts`, `docs/design-charter.md`, `CLAUDE.md` (Contact form, Sections)
