const search = document.querySelector('#search');
let langList = [];
fetch("https://restcountries.com/v3.1/all").then(response => {

    if (response.status >= 200 && response.status < 300 && response.ok == true) {
        return response.json();
    } else {
        throw 'Fetch failed';
    }
}).then(data => {

    data.forEach(country => {
        if (country.languages != null) {
            let languages = Object.values(country.languages);
            languages.forEach(lang => {
                if (!langList.includes(lang.toLowerCase()))
                    langList.push(lang.toLowerCase());
            })

        }
    });
    console.log(langList);



}).catch(error => console.log(error));


const searchResults = document.querySelector('#search-results');

search.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    let search = e.target.value;
    clearSuggestions();
    if (search.length >= 2) {
        filterResults(search);
    }
});

let currentSearch;

function filterResults(input) {
    let suggestions = [];
    langList.forEach(lang => {
        if (lang.includes(input)) {
            if (!suggestions.includes(lang))
                suggestions.push(lang);
        }

    })

    clearSuggestions();
    suggestions.forEach(suggestion => {
        let result = document.createElement('p');

        result.innerText = suggestion;
        searchResults.append(result);

    })
    currentSearch = suggestions[0];
    console.log(currentSearch);
}

search.addEventListener('click', (e) => {
    e.target.value = "";
    clearSuggestions();
    searchFail = false;
})

searchResults.addEventListener('click', (e) => {
    if (!searchFail) {
        currentSearch = e.target.innerText;
        clearSuggestions();
        getCountryFromLang(currentSearch);
    }
})

function clearSuggestions() {
    searchResults.innerHTML = "";
}

const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearSuggestions();
    search.value = "";
    if (currentSearch != null) {
        searchFail = false;
        getCountryFromLang(currentSearch);
    } else {
        searchResults.innerHTML = "<h1>Could not find</h1>";
        searchFail = true;
    }
});

let searchFail;

function getCountryObject(country) {
    let capitalNames = country.capital != null ? country.capital.toString().replaceAll(',', ', ') : "No Capital";
    return { "name": country.name.official, "subregion": country.subregion != null ? country.subregion : "No subregion", "capital": capitalNames, "population": country.population, "image": country.flags.png};
}

function getCountryFromLang(language) {
    let countryObjArr = [];
    fetch(`https://restcountries.com/v3.1/lang/${language}`).then(response => {

        if (response.status >= 200 && response.status < 300 && response.ok == true) {
            return response.json();
        } else {
            throw 'Fetch failed';
        }
    }).then(data => {
        data.forEach(country => {
            countryObjArr.push(getCountryObject(country))
            updateView(countryObjArr);
        })

    }).catch(error => console.log(error));
    return countryObjArr;
}


let content = document.querySelector('#content');

function updateView(country) {
    content.innerHTML = "";
    country.sort((a, b) => b.population - a.population).forEach((countryObj, index) => {
        let div = document.createElement('div');
        content.append(div);
        let h1 = document.createElement('h1');
        h1.innerText = countryObj.name;
        div.append(h1);
        let capital = document.createElement('p');
        capital.innerText = "Capital: " + countryObj.capital;
        div.append(capital);
        let population = document.createElement('p');
        population.innerText = "Population: " + countryObj.population;
        if (index == 0) {
            population.style.fontWeight = "bold";
        }
        div.append(population);
        let subregion = document.createElement('p');
        subregion.innerText = "Subregion: " + countryObj.subregion;
        div.append(subregion);
        let img = document.createElement('img');
        img.src = countryObj.image;
        div.append(img);
    })

}

