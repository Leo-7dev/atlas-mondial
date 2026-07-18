# Atlas Mondial Interactif

Application web (HTML5 / CSS3 / JavaScript vanilla) réalisée dans le cadre du **Devoir 2 — LOG3500 (Été 2026)**, sur le thème des applications web asynchrones connectées à une API réelle.

## Description

L'utilisateur saisit le nom d'un pays dans un formulaire de recherche. L'application interroge en arrière-plan la **REST Countries API (v3.1)**, affiche un indicateur de chargement pendant la requête, puis génère une carte d'identité visuelle et dynamique du pays trouvé.

## Fonctionnalités

- Recherche d'un pays par son nom.
- Carte d'identité affichant :
  - le drapeau officiel (image SVG) avec texte alternatif descriptif ;
  - le nom commun du pays ;
  - la capitale ;
  - la population, formatée avec des espaces comme séparateurs de milliers (ex. `11 402 533`) ;
  - la région géographique ;
  - la ou les monnaies officielles ;
  - la ou les langues parlées.
- Indicateur de chargement (spinner animé) pendant l'appel réseau.
- Validation accessible du formulaire : `aria-invalid`, message d'erreur relié via `aria-describedby`, réinitialisation automatique dès correction de la saisie.
- Gestion des erreurs :
  - Aucun résultat / recherche invalide → *"Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe."*
  - Erreur réseau ou serveur inaccessible → *"Connexion impossible. Veuillez vérifier votre accès à internet."*
- Utilisation exclusive de `fetch()` avec `async/await` et blocs `try...catch`.
- Sécurité du DOM : toutes les données issues de l'API sont injectées via `textContent` (jamais `innerHTML`), afin d'éviter tout risque de faille XSS.
- Mise en page responsive (Flexbox / CSS Grid) adaptée aux smartphones, tablettes et ordinateurs via des *media queries*.

## Structure du projet

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

## Technologies

- HTML5 sémantique (`header`, `nav`, `main`, `section`, `footer`).
- CSS3 (Flexbox, CSS Grid, Media Queries, animations).
- JavaScript ES6+ (fetch, async/await, manipulation du DOM).
- [REST Countries API v3.1](https://restcountries.com/) — source de données.

## Utilisation

1. Cloner ou télécharger le dépôt.
2. Ouvrir le fichier `index.html` dans un navigateur (ou servir le dossier via un serveur local, ex. l'extension "Live Server" de VS Code).
3. Saisir le nom d'un pays (en anglais ou dans sa langue courante, ex. `Haiti`, `France`, `Japan`) et cliquer sur **Rechercher**.

## Conformité W3C

Le document HTML et la feuille de style CSS ont été validés respectivement via :

- [validator.w3.org](https://validator.w3.org/)
- [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/)

Le rapport détaillé des erreurs initiales et des captures d'écran de conformité finale est fourni séparément en PDF, tel que requis par la consigne de remise.

## Auteur

Devoir individuel — LOG3500, ISTEAH, Été 2026.
