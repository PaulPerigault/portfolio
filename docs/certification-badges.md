# Badges des certifications

Les deux badges affichés dans la section certifications sont les images publiées par l'émetteur sur
Credly. Elles sont servies par le site lui-même (`/image/badges/`), jamais depuis Credly : aucune
requête tierce à l'ouverture de la page.

## Origine (relevé du 2026-11-23)

| Certification                    | Page Credly vérifiée                                     | Titre de la page                              | Image (identifiant Credly)             | Fichier                           | Taille                | SHA-256                                 |
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

Non établi : les Google Brand Feature Guidelines n'ont pas été lues, et ces lectures ne sont pas un avis
juridique. À revérifier si un émetteur change ses conditions.

## Remplacer un badge

Si l'émetteur révoque ou remplace un badge : retirer ou remplacer le fichier de `public/image/badges/`,
mettre à jour `badge` dans `src/content/{fr,en}/certifications.json` (mêmes valeurs dans les deux
langues) et ce tableau. Les images ont un nom stable : `public/_headers` les met en cache une semaine.
