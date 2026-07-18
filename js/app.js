
'use strict';

/* ==========================================================================
   Atlas Mondial Interactif — Logique applicative
   Source de données : REST Countries API (v3.1)
   ========================================================================== */

const API_BASE_URL = 'https://restcountries.com/v3.1/name/';

// Références aux éléments du DOM
const form = document.getElementById('country-form');
const input = document.getElementById('country-input');
const errorMessage = document.getElementById('country-error');
const loadingIndicator = document.getElementById('loading');
const statusMessage = document.getElementById('message');
const countryCard = document.getElementById('country-card');

const flagEl = document.getElementById('country-flag');
const nameEl = document.getElementById('country-name');
const capitalEl = document.getElementById('country-capital');
const populationEl = document.getElementById('country-population');
const regionEl = document.getElementById('country-region');
const currencyEl = document.getElementById('country-currency');
const languagesEl = document.getElementById('country-languages');

/**
 * Formate un nombre en ajoutant des espaces comme séparateurs de milliers.
 * Ex: 11402533 -> "11 402 533"
 * @param {number} value
 * @returns {string}
 */
function formatPopulation(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Active l'état d'erreur d'accessibilité sur le champ de recherche.
 * @param {string} text
 */
function showInputError(text) {
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', 'country-error');
  errorMessage.textContent = text;
}

/**
 * Réinitialise l'état d'erreur d'accessibilité sur le champ de recherche.
 */
function clearInputError() {
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  errorMessage.textContent = '';
}

/**
 * Affiche l'indicateur de chargement et masque les autres blocs.
 */
function showLoading() {
  loadingIndicator.hidden = false;
}

/**
 * Masque l'indicateur de chargement.
 */
function hideLoading() {
  loadingIndicator.hidden = true;
}

/**
 * Affiche un message de statut (erreur API ou réseau).
 * @param {string} text
 */
function showStatusMessage(text) {
  statusMessage.textContent = text;
  statusMessage.hidden = false;
}

/**
 * Masque et vide le message de statut.
 */
function hideStatusMessage() {
  statusMessage.textContent = '';
  statusMessage.hidden = true;
}

/**
 * Construit la liste des monnaies officielles sous forme de texte lisible.
 * @param {Object|undefined} currencies
 * @returns {string}
 */
function buildCurrencyText(currencies) {
  if (!currencies || typeof currencies !== 'object') {
    return 'Non disponible';
  }
  const entries = Object.values(currencies).map((currency) => {
    if (currency && currency.name) {
      return currency.symbol ? `${currency.name} (${currency.symbol})` : currency.name;
    }
    return null;
  }).filter(Boolean);

  return entries.length > 0 ? entries.join(', ') : 'Non disponible';
}

/**
 * Construit la liste des langues parlées sous forme de texte lisible.
 * @param {Object|undefined} languages
 * @returns {string}
 */
function buildLanguagesText(languages) {
  if (!languages || typeof languages !== 'object') {
    return 'Non disponible';
  }
  const entries = Object.values(languages);
  return entries.length > 0 ? entries.join(', ') : 'Non disponible';
}

/**
 * Injecte les données d'un pays dans la carte d'identité, en utilisant
 * exclusivement textContent (et les propriétés src/alt pour l'image)
 * afin d'éviter tout risque de faille XSS via innerHTML.
 * @param {Object} country
 */
function renderCountry(country) {
  const commonName = (country.name && country.name.common) || 'Nom inconnu';

  if (country.flags && country.flags.svg) {
    flagEl.src = country.flags.svg;
    flagEl.alt = country.flags.alt || `Drapeau de ${commonName}`;
  } else {
    flagEl.src = '';
    flagEl.alt = `Drapeau de ${commonName} non disponible`;
  }

  nameEl.textContent = commonName;

  const capital = (Array.isArray(country.capital) && country.capital.length > 0)
    ? country.capital[0]
    : 'Non disponible';
  capitalEl.textContent = capital;

  populationEl.textContent = typeof country.population === 'number'
    ? `${formatPopulation(country.population)} habitants`
    : 'Non disponible';

  regionEl.textContent = country.region || 'Non disponible';
  currencyEl.textContent = buildCurrencyText(country.currencies);
  languagesEl.textContent = buildLanguagesText(country.languages);

  countryCard.hidden = false;
}

/**
 * Récupère les données d'un pays depuis l'API REST Countries et met à
 * jour l'interface (chargement, résultat ou message d'erreur).
 * @param {string} countryName
 */
async function fetchCountry(countryName) {
  showLoading();
  hideStatusMessage();
  countryCard.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}${encodeURIComponent(countryName)}`);

    if (!response.ok) {
      showStatusMessage("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      showStatusMessage("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
      return;
    }

    renderCountry(data[0]);
  } catch (error) {
    showStatusMessage('Connexion impossible. Veuillez vérifier votre accès à internet.');
  } finally {
    hideLoading();
  }
}

// Réinitialise l'état d'erreur dès que l'utilisateur saisit un caractère valide.
input.addEventListener('input', () => {
  if (input.value.trim().length > 0) {
    clearInputError();
  }
});

// Interception de la soumission du formulaire.
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const query = input.value.trim();

  if (query === '') {
    showInputError('Veuillez entrer le nom d\'un pays avant de lancer la recherche.');
    input.focus();
    return;
  }

  clearInputError();
  fetchCountry(query);
});