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

        // 3. Appel de l'API avec double protocole réseau de secours
        try {
            let data = null;

            try {
                // Premier essai : API directe principale
                const response = await fetch(`https://restcountries.com{encodeURIComponent(cleanQuery)}`);
                if (response.ok) {
                    data = await response.json();
                }
            } catch (networkError) {
                console.log("Serveur principal injoignable, basculement sur le miroir réseau.");
            }

            // Deuxième essai : Si le premier a échoué ou a été bloqué par Brave/CORS
            if (!data) {
                const backupResponse = await fetch(`https://allorigins.win{encodeURIComponent('https://restcountries.com' + encodeURIComponent(cleanQuery))}`);
                if (!backupResponse.ok) throw new Error("NOT_FOUND");
                const proxyData = await backupResponse.json();
                data = JSON.parse(proxyData.contents);
            }

            // Sécurité : On s'assure que le résultat contient un tableau valide
            if (data.status === 404 || !Array.isArray(data) || data.length === 0) {
                throw new Error("NOT_FOUND");
            }

            // Extraction cruciale du premier index du pays trouvé
            const countryData = data[0];
            
            // Rendu de la carte d'identité sémantique
            renderCountryCard(countryData);

        } catch (error) {
            if (error.message === "NOT_FOUND") {
                displayExceptionMessage("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
            } else {
                displayExceptionMessage("Connexion impossible au serveur mondial. Veuillez vérifier votre accès à internet.");
            }
        } finally {
            // Désactivation automatique du loader
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

        // Formatage de la population avec des espaces requis par votre barème (ex: 11 402 533)
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

        // Assemblage 100% sécurisé anti-XSS du DOM via la propriété textContent
        const cardContainer = document.createElement('article');
        cardContainer.className = "country-card";

        const flagWrapper = document.createElement('div');
        flagWrapper.className = "card-flag-wrapper";
        
        const flagImg = document.createElement('img');
        flagImg.src = country.flags?.svg || country.flags?.png || "";
        flagImg.alt = country.flags?.alt || `Drapeau officiel : ${nameCommon}`;
        
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
