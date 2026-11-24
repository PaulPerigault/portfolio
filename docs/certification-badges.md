# Badges des certifications

Les deux badges affichés dans la section certifications sont les images publiées par l'émetteur sur
Credly. Elles sont servies par le site lui-même (`/image/badges/`), jamais depuis Credly : aucune
requête tierce à l'ouverture de la page.

## Origine (relevé du 2026-11-23)

| Certification                    | Page Credly vérifiée                                     | Titre de la page                              | Image (identifiant Credly)             | Fichier                           | Taille                | SHA-256                                                            |
| -------------------------------- | -------------------------------------------------------- | --------------------------------------------- | -------------------------------------- | --------------------------------- | --------------------- | ------------------------------------------------------------------ |
| Google Cloud Digital Leader      | `credly.com/badges/a81cf9bc-edf9-4859-a17d-431b3dafcfc6` | « Cloud Digital Leader - Credly »             | `5fbd238e-eb8f-4ad9-aabe-2ea225fedf36` | `google-cloud-digital-leader.png` | 97 890 o, 1040 x 1040 | `6c2f0d59db9f78c312d83213491033ef4398a93d5ef9819becf54ad027b0d689` |
| AWS Certified Cloud Practitioner | `credly.com/badges/1aa201ac-3fde-4114-ac05-54418c2e9b84` | « AWS Certified Cloud Practitioner - Credly » | `00634f82-b07f-4bbd-a6bb-53de397fc3a6` | `aws-cloud-practitioner.png`      | 44 876 o, 600 x 600   | `eefa1b3f5751d05b55a82b7ca266fec564451350a023ae29318c0253589fb1c7` |

Méthode : l'identifiant de l'image vient de la balise Open Graph de chaque page (`og:image`, dont
`og:title` et `og:image:alt` nomment la certification et l'émetteur). Les vignettes Open Graph
(`linkedin_thumb_image.png`, 672 x 352, encadrées de blanc) sont des dérivés : le fichier retenu est
l'image d'origine du même identifiant (`image.png`, carrée). Octets conservés tels quels : aucun
redimensionnement, filtre, recadrage ni réencodage (les deux fichiers sont sous 250 Ko). Le test
`e2e/certification-path.spec.ts` vérifie les dimensions naturelles de chaque image.

Les certifications planifiées n'ont pas de badge : le schéma (`src/domain/certification.ts`) refuse un
badge sur une certification `planned`, et la scène affiche alors un fantôme filaire.

## Conditions d'usage lues

Reprises de la page « Conditions d'usage des badges » du composant `Milestones3D`
(`design.paulperigault.dev/components/milestones-3d/`, sources lues le 2026-11-21, ADR-0013 du design
system) :

- AWS (politiques générales de certification, Brand Usage and Guidelines) : badge non modifié, sur fond
  blanc ou très clair, ni superposition ni combinaison avec d'autres symboles ou logos, usage réservé à
  la personne certifiée.
- Credly (User Terms of Service) : l'affichage public d'un badge obtenu est permis (2.e), aucune
  affiliation ni soutien ne doit être suggéré (4), l'émetteur peut révoquer un badge (6.c).
- Google Cloud (Exam Terms and Conditions, section 4) : la certification indique que la personne est
  certifiée, selon les Google Brand Feature Guidelines en vigueur.

Règles appliquées ici : badge intact sur une pastille claire fixe (y compris dans le thème sombre),
rien posé dessus, nom complet de la certification écrit en HTML à côté, lien « Vérifier sur Credly »
vers la page de l'émetteur (reflète une révocation), usage à titre personnel de la personne certifiée.

Ces lectures ne sont pas un avis juridique. À revérifier si un émetteur change ses conditions.

## Conformité Google (lecture du 2026-11-24)

Pages lues en entier ce jour (WebFetch) :

- `cloud.google.com/certification/terms` (version courante, modifiée le 2025-10-08) ;
  `cloud.google.com/legal/archive/certification/terms/index-20251008` (même texte, archive) ;
- `support.google.com/cloud-certification/answer/10220719` (politiques du programme) ;
- `support.google.com/qwiklabs/answer/14779166` (badges Credly de Google Skills) ;
- `partnermarketinghub.withgoogle.com/brands/google/trademarks-and-terms/trademark-guidelines-for-proper-usage/`
  et `.../terms-and-conditions/` (les anciennes adresses `google.com/permissions/guidelines.html`,
  `google.com/permissions/trademark/rules` et `.../brand-terms/` y redirigent).

Non relue : la page « User Terms » de Credly (les adresses essayées répondent 404). Les clauses Credly
citées plus haut datent de la lecture du 2026-11-21 et ne sont pas confirmées ce jour.

### Ce qui est permis

- Exam Terms, section 4 : utiliser la certification « only to represent that you as an individual are
  accredited, certified, or credentialed by Google for passing an Exam », conformément aux Google Brand
  Feature Guidelines en vigueur. Les entités non individuelles ne le peuvent pas.
- Google Skills : partager le badge Credly sur un CV, des réseaux ou d'autres supports ; la page ne fixe
  aucune règle d'intégration sur un site.
- Brand Feature Guidelines : citer la marque sans la déformer, ne l'utiliser qu'avec l'artwork approuvé.

### Ce qui est interdit

- Exam Terms 5.a.viii : fausser son statut de certification. Section 8 : Google peut invalider et
  révoquer une certification.
- Brand Feature Guidelines : retirer, déformer ou altérer un élément d'un Brand Feature ; le combiner
  avec autre chose ; l'afficher comme l'élément le plus en vue du contenu ; suggérer une relation,
  une affiliation, un parrainage ou un soutien de Google ; imiter sa marque.
- Brand Terms : toute utilisation d'un Brand Feature hors de la permission écrite de Google, laquelle
  est limitée à l'objet de la demande et révocable ; mention que ce sont des marques de Google LLC.

Les guidelines lues ne mentionnent pas les badges de certification : aucune règle spécifique de taille,
de fond ou de distance n'est publiée pour eux. La règle des 25 px de marge appartient à une autre page
(logos accordés sur demande) et n'a pas été retrouvée dans les textes lus.

### Comparaison avec l'affichage réel

| Point                       | Affichage                                                                                                                                                        | Verdict          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Usage personnel             | portfolio d'une personne, la certification est la sienne                                                                                                         | conforme         |
| Badge intact (octets)       | fichier Credly d'origine, aucun recadrage ni filtre                                                                                                              | conforme         |
| Fond clair                  | pastille claire fixe, y compris en thème sombre                                                                                                                  | conforme         |
| Affiliation suggérée        | aucun logo Google hors du badge, texte « Vérifier sur Credly », pas de mention de partenariat                                                                    | conforme         |
| Lien                        | page Credly de l'émetteur, nouvel onglet                                                                                                                         | conforme         |
| Statut                      | « Obtenue novembre 2024 », certification de niveau Foundational valable 3 ans (section 1.c) : à retirer ou à renouveler avant novembre 2027                      | à suivre         |
| Badge dans la scène 3D      | texture posée sur une médaille en perspective, ombrée, rapetissée : le badge Google paraît pâle et son anneau de texte n'est pas lisible sur mobile              | **point ouvert** |
| Mention de marque           | mentions légales, section « Propriété intellectuelle » (FR et EN) : noms et badges propriété de Google LLC et d'Amazon Web Services, site ni affilié ni approuvé | conforme         |
| Permission écrite de Google | aucune demandée ; le texte de la section 4 des Exam Terms l'autorise pour la certification, pas pour d'autres Brand Features                                     | **point ouvert** |

### Points ouverts

1. Dans la scène, le badge n'est pas affiché tel quel : mis en perspective, éclairé et réduit sur une
   médaille. La règle « ne pas déformer ni altérer » peut s'appliquer. Le panneau de détail et la liste
   montrent le badge intact. Options : laisser tel quel (lecture de bonne foi : la certification est
   représentée, le badge intact est à côté) ; ne montrer dans la scène que le nom et la date pour les
   badges Google ; demander l'avis de Google Cloud Certification
   (`support.google.com/cloud-certification/contact/cloud_certifications`).
2. Mention de marque : faite (#414), voir le tableau. Texte : « Les noms et badges de certification
   appartiennent à leurs propriétaires (Google LLC, Amazon Web Services). Ce site n'est ni affilié ni
   approuvé par eux. »
3. Calendrier : retirer ou renouveler la certification Google avant novembre 2027 (issue #415).

Seule la mention de marque (point 2) est faite sur le site ; les points 1 et 3 restent ouverts.

## Remplacer un badge

Si l'émetteur révoque ou remplace un badge : retirer ou remplacer le fichier de `public/image/badges/`,
mettre à jour `badge` dans `src/content/{fr,en}/certifications.json` (mêmes valeurs dans les deux
langues) et ce tableau. Les images ont un nom stable : `public/_headers` les met en cache une semaine.
