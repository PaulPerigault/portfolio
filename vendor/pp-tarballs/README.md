# Tarballs provisoires

Ce dossier est provisoire. Il contient les paquets `@paulperigault/*` du design system que le
portfolio installe par dépendance `file:` tant qu'ils ne sont pas publiés sur npm (compte npm
suspendu jusqu'au 2026-11-23). Suivi de la bascule vers les versions npm : issue #402.

| Tarball         | Version | Rôle                                                               |
| --------------- | ------- | ------------------------------------------------------------------ |
| `astro`         | 0.4.0   | composants Astro, dont `Milestones3D`                              |
| `milestones-3d` | 0.1.0   | scène 3D en WebGL2 et WebAssembly (le `.wasm` est dans le tarball) |
| `css`           | 0.3.0   | feuilles de style et thème (dépendance exacte de `astro`)          |
| `dataviz`       | 0.1.2   | dépendance exacte de `astro`                                       |

`@paulperigault/tokens` 0.2.1 vient déjà de npm. Les autres paquets du design system ne servent pas
au portfolio et ne sont pas ici.

Ne pas modifier ces fichiers : les empreintes sont dans `package-lock.json`.

`@paulperigault/dataviz` est déclaré dans `package.json` sans être importé : npm ne trouverait pas
sa version exacte (0.1.2, dépendance de `astro`) sur le registre, donc elle doit venir du tarball.
Pour cette raison, `knip.json` l'ignore. Les deux lignes disparaissent avec la bascule vers npm.
