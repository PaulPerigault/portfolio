# Changelog

## [2.3.0](https://github.com/PaulPerigault/portfolio/compare/v2.2.0...v2.3.0) (2026-11-06)


### Features

* **design:** garde-fous de la charte v2 et cible du lien de navigation ([07a9d6d](https://github.com/PaulPerigault/portfolio/commit/07a9d6da1fda8dd9328d7253839778aba72e4394)), closes [#296](https://github.com/PaulPerigault/portfolio/issues/296)
* **design:** socle jetons et css du design system ([44d658d](https://github.com/PaulPerigault/portfolio/commit/44d658def56f4627903861f9e97e42da78fedc4d))
* **infra:** brique github, dépôt et protections en opentofu ([#259](https://github.com/PaulPerigault/portfolio/issues/259)) ([6825db3](https://github.com/PaulPerigault/portfolio/commit/6825db3c7077cc2537a946eda6906d25dab1fa02)), closes [#255](https://github.com/PaulPerigault/portfolio/issues/255)
* **infra:** clés r2 du state en lecture seule pour la ci ([#253](https://github.com/PaulPerigault/portfolio/issues/253)) ([fa19090](https://github.com/PaulPerigault/portfolio/commit/fa1909003903e0d0a07c511a58ef8e6d26bb35ef))
* **infra:** dépôt design-system en iac, pages et dns des docs ([#269](https://github.com/PaulPerigault/portfolio/issues/269)) ([e34c22b](https://github.com/PaulPerigault/portfolio/commit/e34c22b23473c5da14fa5d8b51a9f5d0969677fc)), closes [#268](https://github.com/PaulPerigault/portfolio/issues/268)
* **infra:** paulperigault.fr servi par cloudflare pages ([#248](https://github.com/PaulPerigault/portfolio/issues/248)) ([f89b669](https://github.com/PaulPerigault/portfolio/commit/f89b669069cd637e334b7453beafb6d1f5cb1a18))
* **infra:** source git et previews par pr pour les docs du design system ([fb9d1f0](https://github.com/PaulPerigault/portfolio/commit/fb9d1f05f60891afc9a7ac6234c7ac65aa85147e))
* **layout:** coque aux jetons et lien vers le design system ([1b97d09](https://github.com/PaulPerigault/portfolio/commit/1b97d097f8b56226c06bc520f30ac78dd7a38f09))
* **projects:** carte design system dans la section projets ([807b55f](https://github.com/PaulPerigault/portfolio/commit/807b55f63e6dec14bbce93d6db196b46311e28e7)), closes [#335](https://github.com/PaulPerigault/portfolio/issues/335)
* **sections:** chronologies aux jetons du design system ([c1418d8](https://github.com/PaulPerigault/portfolio/commit/c1418d8b0350cfabb85537e2b12715bea0d3d421))
* **sections:** competences et projets aux jetons du design system ([860404d](https://github.com/PaulPerigault/portfolio/commit/860404d4367ccda63eaed04c79784b2323d4947f))
* **sections:** hero, contact et champs du design system ([6467c33](https://github.com/PaulPerigault/portfolio/commit/6467c33dd436d7269dfaf72eb35bd44ed7edc445))
* **worker:** limitation de débit par adresse ip (binding cloudflare) ([#219](https://github.com/PaulPerigault/portfolio/issues/219)) ([ec353fb](https://github.com/PaulPerigault/portfolio/commit/ec353fb5afc9726d3a8bb5a4ad1e25ea482c1c1b))


### Bug Fixes

* **ci:** jeton github en lecture seule de la ci, nommé iac_github_readonly_token ([#260](https://github.com/PaulPerigault/portfolio/issues/260)) ([032ec1a](https://github.com/PaulPerigault/portfolio/commit/032ec1a849301607c53bb5adcc347d074eefa23c))
* **content:** corrige les textes du site (hebergeur, ecole, iut, termes) ([991416e](https://github.com/PaulPerigault/portfolio/commit/991416ea355d07de4182201fd7f7676f60560586)), closes [#327](https://github.com/PaulPerigault/portfolio/issues/327)
* **content:** etat vide des projets sans tournure de remplissage ([994da47](https://github.com/PaulPerigault/portfolio/commit/994da4735e51d8b15229f5540d2feb8d579dc9ea)), closes [#359](https://github.com/PaulPerigault/portfolio/issues/359)
* **content:** objectif d'intervention en école, démo accentué ([69ad9a9](https://github.com/PaulPerigault/portfolio/commit/69ad9a9d68ad0013de65da86e7ada3df3b700a4a))
* **deps:** minimatch 11.0.1 en override, lockfile avec libc ([#378](https://github.com/PaulPerigault/portfolio/issues/378)) ([e3bcc04](https://github.com/PaulPerigault/portfolio/commit/e3bcc04af9dc1e673bc1c8749d99456448aa9b90))
* **deps:** vite 8.3.5, avis de sécurité de launch-editor ([#271](https://github.com/PaulPerigault/portfolio/issues/271)) ([8900cdd](https://github.com/PaulPerigault/portfolio/commit/8900cdd73d79c99150538718a14f2a197de0d072))
* **hero:** le bouton contact amene au formulaire ([fae9f70](https://github.com/PaulPerigault/portfolio/commit/fae9f70604a8c2eee08a0c35eba04371efb882e1)), closes [#348](https://github.com/PaulPerigault/portfolio/issues/348)
* **layout:** langswitch ne remplace que le prefixe de langue ([3dffdaa](https://github.com/PaulPerigault/portfolio/commit/3dffdaaf065b1e22cdccb47a83fa9b07742aba82)), closes [#321](https://github.com/PaulPerigault/portfolio/issues/321)
* **seo:** echapper l'antislash dans le texte markdown des depots ([#371](https://github.com/PaulPerigault/portfolio/issues/371)) ([fe40ea5](https://github.com/PaulPerigault/portfolio/commit/fe40ea5e1b8b9647341f1ce7be87c7696e5208a1)), closes [#368](https://github.com/PaulPerigault/portfolio/issues/368)
* **seo:** humans.txt cite le depot sous son nom actuel ([3101879](https://github.com/PaulPerigault/portfolio/commit/310187937b46f3b3c422968d4d097d7a19d444ea)), closes [#329](https://github.com/PaulPerigault/portfolio/issues/329)
* **seo:** pathforlang ne remplace que le prefixe de langue ([8e637ab](https://github.com/PaulPerigault/portfolio/commit/8e637abcccdcc953a45b29ad1309665ab64e90eb))

## [2.2.0](https://github.com/PaulPerigault/PaulPerigault.github.io/compare/v2.1.1...v2.2.0) (2026-10-20)


### Features

* **contact:** formulaire de contact accessible avec turnstile au focus ([#146](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/146)) ([2c5e708](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/2c5e708cd6bd40b5e9a48c502a634a3e2bfe695d)), closes [#136](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/136)
* formulaire de contact (worker, turnstile, resend, terraform) ([#160](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/160)) ([a30de24](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/a30de24b403eb63f5ffedc81df8b706b88a69d54)), closes [#133](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/133)
* formulaire de contact en production ([#163](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/163)) ([4c78ac6](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/4c78ac6da8ac00182277871a8ace260d6e618e73))
* **infra:** dmarc en observation, doc dns du .dev, accès au state ([#157](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/157)) ([45c4c36](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/45c4c36c9c39f5126598da89d82869a07130b761)), closes [#156](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/156)
* **infra:** terraform du formulaire de contact et import resend ([#154](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/154)) ([96202e2](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/96202e271962fb436f3d25739aa07d72c595d3c0)), closes [#138](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/138)
* **worker:** worker cloudflare du formulaire de contact ([#145](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/145)) ([d90d5cb](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/d90d5cb79bdd9bbcb455bf13848d263420a5ab80)), closes [#135](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/135)


### Bug Fixes

* **deps:** versions corrigées de http-cache-semantics et source-map-js ([#149](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/149)) ([1a6e720](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/1a6e720db896c0421108da13ecfc70a8f9d6dcf9)), closes [#144](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/144)
* **scripts:** check-layers échoue sans couverture, build rejeté si non lancé ([#153](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/153)) ([a8ba32b](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/a8ba32b3098ebe7a40e8e51830cd36ae3030488f)), closes [#150](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/150)
* **scripts:** garde-fous et builds de test fonctionnels sous windows ([#142](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/142)) ([d46fa51](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/d46fa5112fa16c339970d65ead8f7dba36d4534e)), closes [#141](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/141)
* **scripts:** garde-fous et builds de test fonctionnels sous windows ([#148](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/148)) ([fd65884](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/fd65884e152b8355a11a1638e7546dd94f4e360a)), closes [#141](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/141)

## [2.1.1](https://github.com/PaulPerigault/PaulPerigault.github.io/compare/v2.1.0...v2.1.1) (2026-09-30)


### Bug Fixes

* **content:** textes à la première personne, majeure esiea et retour en haut ([#123](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/123)) ([7280ac4](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/7280ac4b9a2846878891307aca68b9657028c355))
* textes à la première personne, majeure esiea et retour en haut ([5e38a10](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/5e38a104078553be705a1e3a3247a39d60ad7b63))

## [2.1.0](https://github.com/PaulPerigault/PaulPerigault.github.io/compare/v2.0.0...v2.1.0) (2026-09-30)


### Features

* **content:** intitulé alternant devops cloud et cv hébergé sur le site ([#113](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/113)) ([640dabe](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/640dabef990b48dda0da9226d9ffc6b1661ab633))
* **design:** identité cv d'abord, police auto-hébergée et impression ([#115](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/115)) ([99bedb0](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/99bedb09772649c1db8ccad8fe3cdcd32b13e9a8))
* livrer l'identité cv d'abord, l'intitulé exact et le cv sur le site ([fcccd99](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/fcccd99d5f175034fa7d894cf4674048b5f1a79a))
* livrer l'identité cv d'abord, l'intitulé exact et le cv sur le site ([#117](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/117)) ([fcccd99](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/fcccd99d5f175034fa7d894cf4674048b5f1a79a))


### Bug Fixes

* **seo:** dater le sitemap par le contenu et ajouter l'audit du site ([#111](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/111)) ([6bec50a](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/6bec50aeac889be6bd98e740e59066a38cb5434c))

## [2.0.0](https://github.com/PaulPerigault/PaulPerigault.github.io/compare/v1.1.1...v2.0.0) (2026-09-30)


### ⚠ BREAKING CHANGES

* le site passe d'Angular à Astro ; les URLs de langue ont désormais un slash final (/fr/, /en/).

### Features

* livrer la migration astro 7 et effect en production ([#105](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/105)) ([edbbf46](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/edbbf467a0b1e99905a3f4dde3b8747ab5ed7ce3))

## [1.1.1](https://github.com/PaulPerigault/PaulPerigault.github.io/compare/v1.1.0...v1.1.1) (2026-09-17)


### Bug Fixes

* **ci:** ignore github squash-merge subjects in commitlint ([#44](https://github.com/PaulPerigault/PaulPerigault.github.io/issues/44)) ([cd34035](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/cd34035927fa44c883e861537f92db429ba0fbb9))
* **ci:** use the repo's token secret for release-please ([713fbe3](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/713fbe3783afc014c7f6578a730b519aa569ae01))
* **ci:** use the repo's token secret for release-please ([1f17e21](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/1f17e21782397f648607f6ee797b6644b8c5f011))
* **perf-a11y:** resolve issues found in pre-main production validation ([8a78ad1](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/8a78ad15585111852322e903ee25e61db27e13b1))
* **perf-a11y:** resolve issues found in pre-main production validation ([c6d3610](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/c6d3610ad908137edbcd517c4a8cc178ea576e3d))

## [1.1.0](https://github.com/PaulPerigault/PaulPerigault.github.io/compare/v1.0.0...v1.1.0) (2026-09-17)


### Features

* add all components, portfolio facade, tests and i18n ([0d085e7](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/0d085e73e4240c7e3e208610d2b879a4f5e3041f))
* add component tests, fix github service, deduplicate config ([c5336ab](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/c5336ab5226dd40e87cfd6544d63954ed895382f))
* add content models, services and data json files ([05d917d](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/05d917d0a164b228b06276c019b2568217947216))
* add content models, services and data json files ([16b095d](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/16b095d29bdea9b214fb197e65f3c8363531468e))
* add e2e tests, fix dark mode, hero photo, projects and cv link ([daeb8c9](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/daeb8c96241708fab5580e03b4739abc1e00a390))
* **seo:** add ssr prerendering, per-language routes and structured metadata ([b51c321](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/b51c321c9b7964c2464f6ea09bf2a85954ad349b))
* **seo:** ssr prerendering, per-language routes and structured metadata ([2cac5e0](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/2cac5e0045c7cb44fa9de6ada3307dde98dbe632))
* update email to contact@paulperigault.fr ([8a948e1](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/8a948e14294816509a97f1322732ea3520f484b6))
* update email to contact@paulperigault.fr ([ffb1082](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/ffb1082887e5e37e4677612b3222be3e8e8a9f4d))


### Bug Fixes

* apply copilot suggestions on services ([fd2fad5](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/fd2fad5d702fc1d81d3cb1a44c00380e3c11c5a4))
* improve accessibility, fix lighthouse thresholds, nginx cache headers ([923cf55](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/923cf559fce42cf24e275c8be4f234cfc3496639))
* pin release-please target branch to main ([2b28e9b](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/2b28e9babf4a4ae316a5eabbf54108087e192512))
* pin release-please target branch to main ([7181a68](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/7181a68567f9c9f7e9a96ef0fffe880120156c6b))
* pin release-please target branch to main ([ee075af](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/ee075afc88356083e9d6e6f67e0590a3c63fd05c))
* resolve merge conflicts, fix copilot review issues ([4e985c9](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/4e985c9ed6acce69f7e55c0a53794503f418c5fd))
* update wording to reflect mentoring role ([c340413](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/c340413064406c27dd97154c81cbdcd1f1349fbc))
* update wording to reflect mentoring role ([11dd9df](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/11dd9dfd7762bee454fe049c109b0f0c3eb4e90d))
* **ux:** improve accessibility and resilience (contrast, nav, focus, lcp) ([ea0a091](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/ea0a091d39ca03cacedd5598b35c03e193c9a65f))
* **ux:** improve accessibility and resilience (contrast, nav, focus, lcp) ([4a05eae](https://github.com/PaulPerigault/PaulPerigault.github.io/commit/4a05eae006e18668bd710fca34cee21d097a8ccc))
