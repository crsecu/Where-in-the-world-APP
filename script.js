const container = document.querySelector('.container');
const cardTemplate = document.getElementById('card-template');
const searchInput = document.getElementById('search-country');
const searchCont = document.querySelector('.search__container');
const goBackBtn = document.querySelector('.back__btn');
// const regionsCont = document.querySelector('.regions__container');
// const regionsSelect = document.querySelector('#regions');
const filterBtn = document.querySelector('.filter__btn');
const dropdownMenu = document.getElementById('filter__dropdown');
const logo = document.querySelector('.title');
let isDropdownOpen = false;

// Render skeleton screen/placeholder cards
const renderPlaceholderCards = count => {
  for (let i = 0; i < count; i++) {
    container.append(cardTemplate.content.cloneNode(true));
  }
};

//Render placeholders
renderPlaceholderCards(20);

//This will store all countries data
let allCountries = [];

//1. Make API request and fetch all countries
const fetchCountries = async function (url) {
  try {
    const request = await fetch(url);
    allCountries = await request.json();
    console.log('HERE ARE ALL COUNTRIES', allCountries);
    displayCountry(allCountries);
  } catch (err) {
    console.error('CHECK ERROR ', err);
  }
};

// //Initial call to fetch countries
// fetchCountries('https://restcountries.com/v3.1/all');
fetchCountries(
  'https://restcountries.com/v3.1/all?fields=name,flags,borders,capital,population,region,subregion,tld,currencies,languages,cca3'
);

//Function to create country card
const createCountryCard = function (country, isDetail = false) {
  const styling = isDetail ? 'country__detail' : 'country';

  if (isDetail) {
    const getCurrencies = Object.values(country.currencies)[0].name;
    const getNativeName = Object.values(country.name.nativeName);
    const nativeName = Object.values(getNativeName);
    const getLanguages = Object.values(country.languages);

    //Country Detail
    const neighbors = displayNeighbors(country);
    const cardDetail = `<div class="${styling}" data-name="${
      country.name.common
    }">
          <div class="detail__imgContainer"><img class="country__img" src="${
            country.flags.png
          }" alt="${country.flags.alt}"/> </div>
    
          <div class="country__data">
          <h3 class="country__name">${country.name.common}</h3>
              <div class="col__wrapper">
              <div class="col__1">
                <p><span>Native Name</span>: ${nativeName[0].common}
                </p>
                <p><span>Population</span>: ${country.population.toLocaleString()}</p>
                <p><span>Region:</span> ${country.region}</p>
                <p><span>Sub Region:</span> ${country.subregion}</p>
                <p><span>Capital:</span> ${
                  country.capital ? country.capital : 'N/A'
                }</p>
              </div>
            <br>
              <div class="col__2">
                  <p><span>Top Level Domain:</span> ${country.tld}</p>
                  <p><span>Currencies:</span> ${getCurrencies}</p>
                  <p><span>Languages:</span> ${getLanguages.join(', ')}</p>
              </div>
              
              </div>
              ${neighbors}
          </div>
          </div>`;

    return `${cardDetail}`;
  } else {
    const card = `<div class="${styling}" data-name="${country.name.common}">
    <div class="img__container"><img class="country__img lazy" src="images/lazy-image.png" alt="${
      country.flags.alt
    }" data-src="${country.flags.png}"/> </div>
          <div class="country__data">
            <h3 class="country__name">${country.name.common}</h3>
            <p class="country__population"><span>Population</span>: ${country.population.toLocaleString()}</p>
            <p class="country__region"><span>Region:</span> ${
              country.region
            }</p>
            <p class="country__capital"><span>Capital:</span> ${
              country.capital ? country.capital : 'N/A'
            }</p>
          </div>
        </div>`;

    return card;
  }
};

//Get country name based on country code
const getCountryName = function (name) {
  const country = allCountries.filter(country => country.cca3 === name);
  console.log('1', country);
  const result = country[0].name.common;

  return result;
};

const displayNeighbors = function (country) {
  //Display neighbors on Country Detail
  let neighbours = `<div class="country__neighbors"><h3>Border Countries:</h3><div class="neighbors__container">`;
  if (country.borders && country.borders.length > 0) {
    neighbours += country.borders
      .map(
        neighbour =>
          `<span class="country__neighbor" data-name="${neighbour}">${getCountryName(
            neighbour
          )}</span>`
      )
      .join('');
  } else {
    neighbours += 'No neighbouring countries';
  }

  neighbours += '</div></div>';

  return neighbours;
};

// Display either all countries or a single country based on the user's search.
// When 'isDetail' is set to true, the country card will also show neighboring countries.
const displayCountry = function (data, isDetail = false) {
  container.innerHTML = '';
  data.forEach(country => {
    container.insertAdjacentHTML(
      'beforeEnd',
      createCountryCard(country, isDetail)
    );
  });

  //Lazy Loading Images
  const imgTargets = document.querySelectorAll('img[data-src]');

  const loadImg = function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Replace src with data-src
      entry.target.src = entry.target.dataset.src;

      // Remove data-src attribute
      entry.target.removeAttribute('data-src');

      // Unobserve the image
      observer.unobserve(entry.target);
    });
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
  });

  imgTargets.forEach(img => imgObserver.observe(img));
};

//Debounce Fn
function debounce(func, delay) {
  let timeout = null;
  return function () {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func();
    }, delay);
  };
}

//Filter client-side data to find a country
const findCountry = function (query) {
  const filteredCountries = allCountries.filter(
    country =>
      country.name.common.toLowerCase().includes(query) ||
      country.name.official.toLowerCase().includes(query)
  );
  console.log(filteredCountries);
  displayCountry(filteredCountries);
};

function goBack() {
  filterBtn.classList.remove('hide');

  displayCountry(allCountries);
  goBackBtn.classList.remove('show');
  goBackBtn.classList.add('hide');
  searchCont.classList.add('show__me');

  //Clear out input field
  searchInput.value = '';
}

//EVENT LISTENERS
//Give user real time feedback about queried country
searchInput.addEventListener(
  'input',
  debounce(function () {
    let query = searchInput.value.trim().toLowerCase();
    console.log('query', query);

    if (query) {
      findCountry(query);
    } else {
      displayCountry(allCountries);
    }
  }, 300)
);

//Go back to main page
goBackBtn.addEventListener('click', goBack);
logo.addEventListener('click', goBack);

//Open Detail View on click
container.addEventListener('click', function (e) {
  const countryEl = e.target.closest('.country');
  const neighborEl = e.target.classList.contains('country__neighbor');
  if (!countryEl && !neighborEl) return;

  //Hide Filter by Region dropdown in Detail View
  filterBtn.classList.add('hide');
  searchCont.classList.remove('show__me');

  //Open Detail View
  if (countryEl) {
    countryData = countryEl.getAttribute('data-name');
    const country = allCountries.filter(
      country => country.name.common === countryData
    );
    //getCountryName(country);
    displayCountry(country, true);
  }

  //Open Neighbor Detail View
  if (neighborEl) {
    neighborData = e.target.getAttribute('data-name');
    const findNeighbor = allCountries.filter(
      country => country.cca3 === neighborData
    );
    displayCountry(findNeighbor, true);
  }

  searchCont.classList.add('hide');
  goBackBtn.classList.remove('hide');
  goBackBtn.classList.add('show');
});

// Filter country by region
filterBtn.addEventListener('click', function () {
  isDropdownOpen = true;
  document.getElementById('filter__dropdown').classList.toggle('show');
});

dropdownMenu.addEventListener('click', function (e) {
  if (e.target.classList.contains('option')) {
    const selectedRegion = e.target.dataset.value;
    dropdownMenu.classList.remove('show');

    if (selectedRegion === 'All') {
      displayCountry(allCountries);
    } else {
      const filterRegion = allCountries.filter(
        country => country.region === selectedRegion
      );
      displayCountry(filterRegion);
    }
  }
});

// Close dropdown when clicking outside of it
window.addEventListener('click', function (event) {
  if (isDropdownOpen && !event.target.closest('.dropdown')) {
    dropdownMenu.classList.remove('show');
    isDropdownOpen = false;
  }
});
