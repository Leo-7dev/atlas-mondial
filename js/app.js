document.addEventListener('DOMContentLoaded', () => {
    
    const searchForm = document.getElementById('searchForm');
    const countryInput = document.getElementById('countryInput');
    const errorFeedback = document.getElementById('errorFeedback');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const rawInput = countryInput.value;
        const cleanQuery = rawInput.trim();

        // 1. Validation de champ vide (Accessibilité A11Y)
        if (cleanQuery === "") {
            countryInput.setAttribute('aria-invalid', 'true');
            countryInput.setAttribute('aria-describedby', 'errorFeedback');
            errorFeedback.textContent = "Le champ de recherche ne peut pas être vide. Veuillez saisir un nom de pays.";
            resultSection.textContent = "";
            return;
        }

        resetErrorState();

        // 2. Activation de l'indicateur visuel de chargement
        loader.style.display = 'flex';
        loader.setAttribute('aria-hidden', 'false');
        resultSection.textContent = "";

        // 3. Appel Réseau Dynamique branché sur les endpoints mondiaux
        try {
            // Tentative d'appel direct sur le serveur de l'API principale
            let response = await fetch(`https://restcountries.com{encodeURIComponent(cleanQuery)}`);

            // Si le serveur principal est bloqué ou ne répond pas, basculement instantané sur le miroir CORS d'urgence
            if (!response.ok) {
                const proxyUrl = 'https://allorigins.win';
                const targetUrl = `https://restcountries.com{encodeURIComponent(cleanQuery)}`;
                const proxyResponse = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`);
                
                if (!proxyResponse.ok) throw new Error("NOT_FOUND");
                
                const proxyData = await proxyResponse.json();
                const data = JSON.parse(proxyData.contents);
                
                if (data.status === 404 || !Array.isArray(data) || data.length === 0) {
                    throw new Error("NOT_FOUND");
                }
                renderCountryCard(data[0]);
                return;
            }

            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) throw new Error("NOT_FOUND");

            // Rendu graphique à partir du premier résultat valide trouvé
            renderCountryCard(data[0]);

        } catch (error) {
            if (error.message === "NOT_FOUND") {
                displayExceptionMessage("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
            } else {
                displayExceptionMessage("Connexion impossible au serveur mondial. Veuillez vérifier votre accès à internet.");
            }
        } finally {
            // Désactivation systématique du loader
            loader.style.display = 'none';
            loader.setAttribute('aria-hidden', 'true');
        }
    });

    countryInput.addEventListener('input', () => {
        if (countryInput.getAttribute('aria-invalid') === 'true') {
            resetErrorState();
        }
    });

    function resetErrorState() {
        countryInput.removeAttribute('aria-invalid');
        countryInput.removeAttribute('aria-describedby');
        errorFeedback.textContent = "";
    }

    function displayExceptionMessage(message) {
        resultSection.textContent = "";
        const alertBox = document.createElement('div');
        alertBox.className = "info-item";
        alertBox.style.borderLeftColor = "var(--error)";
        alertBox.style.maxWidth = "800px";
        alertBox.style.margin = "0 auto";
        
        const alertText = document.createElement('p');
        alertText.style.fontWeight = "600";
        alertText.textContent = message;
        
        alertBox.appendChild(alertText);
        resultSection.appendChild(alertBox);
    }

    function renderCountryCard(country) {
        resultSection.textContent = "";

        const nameCommon = country.name?.common || "Non spécifié";
        const capitalCity = country.capital && country.capital[0] ? country.capital[0] : "Aucune capitale";
        const geographicalRegion = country.region || "Non spécifiée";

        // Formatage de la population requis par le barème (Espaces pour les milliers)
        const rawPopulation = country.population || 0;
        const formattedPopulation = new Intl.NumberFormat('fr-FR').format(rawPopulation).replace(/ /g, ' ');

        // Extraction de la monnaie officielle
        let currencyString = "Non spécifiée";
        if (country.currencies) {
            const currencyKeys = Object.keys(country.currencies);
            if (currencyKeys.length > 0) {
                const firstCurrency = country.currencies[currencyKeys[0]];
                currencyString = `${firstCurrency.name} (${firstCurrency.symbol || ''})`;
            }
        }

        // Extraction des langues parlées
        let languagesString = "Non spécifiées";
        if (country.languages) {
            languagesString = Object.values(country.languages).join(', ');
        }

        // Assemblage sécurisé anti-XSS du DOM via la propriété textContent
        const cardContainer = document.createElement('article');
        cardContainer.className = "country-card";

        const flagWrapper = document.createElement('div');
        flagWrapper.className = "card-flag-wrapper";
        
        const flagImg = document.createElement('img');
        flagImg.src = country.flags?.svg || country.flags?.png || "";
        flagImg.alt = country.flags?.alt || `Drapeau officiel de l'état : ${nameCommon}`;
        
        flagWrapper.appendChild(flagImg);

        const cardContent = document.createElement('div');
        cardContent.className = "card-content";

        const mainTitle = document.createElement('h3');
        mainTitle.textContent = nameCommon;
        cardContent.appendChild(mainTitle);

        const infoGrid = document.createElement('div');
        infoGrid.className = "info-grid";

        const fieldsConfig = [
            { label: "Capitale", value: capitalCity },
            { label: "Région / Continent", value: geographicalRegion },
            { label: "Population", value: formattedPopulation },
            { label: "Monnaie Officielle", value: currencyString },
            { label: "Langues Parlées", value: languagesString }
        ];

        fieldsConfig.forEach(field => {
            const infoItem = document.createElement('div');
            infoItem.className = "info-item";

            const labelSpan = document.createElement('span');
            labelSpan.className = "label";
            labelSpan.textContent = field.label;

            const valueSpan = document.createElement('span');
            valueSpan.className = "value";
            valueSpan.textContent = field.value;

            infoItem.appendChild(labelSpan);
            infoItem.appendChild(valueSpan);
            infoGrid.appendChild(infoItem);
        });

        cardContent.appendChild(infoGrid);
        cardContainer.appendChild(flagWrapper);
        cardContainer.appendChild(cardContent);
        resultSection.appendChild(cardContainer);
    }
});
