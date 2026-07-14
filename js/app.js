document.addEventListener('DOMContentLoaded', () => {
    
    const searchForm = document.getElementById('searchForm');
    const countryInput = document.getElementById('countryInput');
    const errorFeedback = document.getElementById('errorFeedback');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');

    // Base de données de secours intégrée (Mock local) en cas de blocage réseau total
    const localBackup = {
        "haiti": {
            name: { common: "Haiti" },
            capital: ["Port-au-Prince"],
            region: "Americas",
            population: 11402533,
            currencies: { HTG: { name: "Gourde haïtienne", symbol: "G" } },
            languages: { hat: "Créole haïtien", fra: "Français" },
            flags: { svg: "https://flagcdn.com", alt: "Drapeau d'Haïti." }
        },
        "canada": {
            name: { common: "Canada" },
            capital: ["Ottawa"],
            region: "Americas",
            population: 38005238,
            currencies: { CAD: { name: "Dollar canadien", symbol: "$" } },
            languages: { eng: "Anglais", fra: "Français" },
            flags: { svg: "https://flagcdn.com", alt: "Drapeau du Canada." }
        },
        "france": {
            name: { common: "France" },
            capital: ["Paris"],
            region: "Europe",
            population: 67391582,
            currencies: { EUR: { name: "Euro", symbol: "€" } },
            languages: { fra: "Français" },
            flags: { svg: "https://flagcdn.com", alt: "Drapeau de la France." }
        },
        "usa": {
            name: { common: "United States" },
            capital: ["Washington, D.C."],
            region: "Americas",
            population: 332278200,
            currencies: { USD: { name: "Dollar des États-Unis", symbol: "$" } },
            languages: { eng: "Anglais" },
            flags: { svg: "https://flagcdn.com", alt: "Drapeau des États-Unis." }
        },
        "brazil": {
            name: { common: "Brazil" },
            capital: ["Brasília"],
            region: "Americas",
            population: 214326223,
            currencies: { BRL: { name: "Réal brésilien", symbol: "R$" } },
            languages: { por: "Portugais" },
            flags: { svg: "https://flagcdn.com", alt: "Drapeau du Brésil." }
        }
    };

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const rawInput = countryInput.value;
        const cleanQuery = rawInput.trim().toLowerCase();

        // Validation A11Y champ vide
        if (cleanQuery === "") {
            countryInput.setAttribute('aria-invalid', 'true');
            countryInput.setAttribute('aria-describedby', 'errorFeedback');
            errorFeedback.textContent = "Le champ de recherche ne peut pas être vide. Veuillez saisir un nom de pays.";
            resultSection.textContent = "";
            return;
        }

        resetErrorState();

        // Activation du loader visuel
        loader.style.display = 'flex';
        loader.setAttribute('aria-hidden', 'false');
        resultSection.textContent = "";

        try {
            // Appel réseau direct
            const response = await fetch(`https://restcountries.com{encodeURIComponent(cleanQuery)}`);

            if (!response.ok) {
                throw new Error("NOT_FOUND");
            }

            const data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("NOT_FOUND");
            }

            // Si l'API en ligne répond, on affiche les données distantes
            renderCountryCard(data[0]);

        } catch (error) {
            // Basculement miroir automatique vers la base locale en cas d'erreur ou blocage réseau
            if (localBackup[cleanQuery]) {
                console.log("Protocole de secours activé pour : " + cleanQuery);
                renderCountryCard(localBackup[cleanQuery]);
            } else if (error.message === "NOT_FOUND") {
                displayExceptionMessage("Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.");
            } else {
                displayExceptionMessage("Connexion impossible au serveur mondial. Veuillez vérifier votre accès à internet.");
            }
        } finally {
            // Désactivation du loader
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

        // Assemblage sécurisé anti-XSS du DOM via textContent
        const cardContainer = document.createElement('article');
        cardContainer.className = "country-card";

        const flagWrapper = document.createElement('div');
        flagWrapper.className = "card-flag-wrapper";
        
        const flagImg = document.createElement('img');
        flagImg.src = country.flags?.svg || "";
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
