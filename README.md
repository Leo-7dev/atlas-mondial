# 🌍 Atlas Mondial Interactif - TIC400

## 📝 Présentation du Projet
Ce projet a été réalisé dans le cadre du cours **TIC400 (Gestion des Bases de Données & Technologies Web) — Session Été 2026**. 
L'application est un **Atlas Mondial Interactif** qui permet à un utilisateur de saisir le nom d'un pays en français ou en anglais pour générer instantanément sa carte d'identité sémantique, visuelle et dynamique en interrogeant l'API internationale *REST Countries*.

## 🚀 Fonctionnalités Clés
- **Asynchronisme Avancé :** Utilisation de l'API moderne `fetch` couplée à l'architecture `async / await` structurée dans un bloc de capture robuste `try...catch`.
- **Accessibilité Numérique (A11Y) :** Gestion sémantique et dynamique des erreurs de saisie à l'aide des attributs universels `aria-invalid` and `aria-describedby` connectés structurellement au lecteur d'écran.
- **Sécurité et Protection XSS :** Exclusion stricte de la propriété vulnérable `innerHTML` pour l'injection des variables textuelles issues de l'API, remplacée exclusivement par la propriété sécurisée `textContent`.
- **Indicateur de Chargement :** Intégration d'un composant visuel dynamique (*Spinner animé*) s'activant durant les requêtes réseau.
- **Design Responsive :** Mise en page asymétrique moderne propulsée par CSS Grid et Flexbox, offrant une adaptation esthétique absolue sur smartphones, tablettes et ordinateurs.

## 📁 Structure de l'Arborescence
Le projet respecte scrupuleusement l'architecture de dossiers exigée par le barème académique :
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md

## 📡 API Mondiale Utilisée
L'application interroge en arrière-plan la version 3.1 de l'API globale :
`https://restcountries.com{nom_du_pays}`

### Données Extraites du JSON :
1. **Drapeau officiel :** Récupération de l'image vectorielle SVG (`flags.svg`) combinée à sa description textuelle alternative (`flags.alt`).
2. **Nom de la nation :** Extraction du nom commun officiel (`name.common`).
3. **Capitale administrative :** Lecture du premier index du tableau (`capital[0]`).
4. **Démographie :** Formatage de la population avec des espaces pour séparer les milliers via l'objet natif `Intl.NumberFormat`.
5. **Géographie :** Identification du continent ou de la région géographique (`region`).
6. **Économie & Langues :** Extraction dynamique des dictionnaires de monnaies (`currencies`) et des langues parlées (`languages`).

## ⚖️ Conformité et Validation W3C
Les codes sources de ce projet ont été validés avec succès par les instances officielles, garantissant un rendu sans aucune erreur de syntaxe ou de conformité :
- **Validateur HTML5 :** 100% conforme sur https://w3.org
- **Validateur CSS3 :** 100% conforme sur https://w3.org

## 🛠️ Instructions d'Installation Locale
1. Clonez ce dépôt public sur votre machine :
   ```bash
   git clone https://github.com
   ```
2. Ouvrez le dossier dans votre éditeur de code (Visual Studio Code).
3. Lancez le fichier `index.html` directement dans votre navigateur internet (Brave, Chrome, Safari).

---
*Projet individuel soumis sur la plateforme académique Moodle pour l'évaluation finale de TIC400.*
