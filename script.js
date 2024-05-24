const container = document.querySelector('.container');
const searchInput = document.querySelector('#search-country');
const searchCont = document.querySelector('.search__container');
const goBackBtn = document.querySelector('.back__btn');
// const regionsCont = document.querySelector('.regions__container');
// const regionsSelect = document.querySelector('#regions');
const filterBtn = document.querySelector('.filter__btn');
const dropdownMenu = document.querySelector('#filter__dropdown');
let isDropdownOpen = false;

//This will store all countries data
let allCountries = [];

//1. Make API request and fetch all countries
const fetchCountries = async function (url) {
  try {
    const request = await fetch(url);
    allCountries = await request.json();
    displayCountry(allCountries);
    console.log('all countries', allCountries);
  } catch (err) {
    console.error(err);
  }
};

//Initial call to fetch countries
fetchCountries('https://restcountries.com/v3.1/all');

//Function to create country card
const createCountryCard = function (country, isDetail = false) {
  const styling = isDetail ? 'country__detail' : 'country';

  const card = `<div class="${styling}" data-name="${country.name.common}">
  <img class="country__img" src="${country.flags.png}" alt="${country.flags.alt}"/>
  <div class="country__data">
    <h3 class="country__name">${country.name.common}</h3>
    <p class="country__population"><span>Population</span>: ${country.population}</p>
    <p class="country__region"><span>Region:</span> ${country.region}</p>
    <p class="country__capital"><span>Capital:</span> ${country.capital}</p>
  </div>
</div>`;

  const cardDetail = `<div class="${styling}" data-name="${country.name.common}">
<img class="country__img" src="${country.flags.png}" alt="${country.flags.alt}"/>
<div class="country__data">
  <h3 class="country__name">${country.name.common}</h3>
  <p><span>Native Name</span>: 
  </p>
  <p><span>Population</span>: ${country.population}</p>
  <p ><span>Region:</span> ${country.region}</p>
  <p><span>Region:</span> ${country.subregion}</p>
  <p><span>Capital:</span> ${country.capital}</p>
  <br>
  <p><span>Top Level Domain:</span> ${country.tld}</p>
  <p><span>Currencies:</span> </p>
  <p><span>Languages:</span> </p>
</div>
</div>`;

  const neighbors = displayNeighbors(country);

  if (!isDetail) {
    return card;
  } else {
    return `${cardDetail} ${neighbors}`;
  }
};

//Get country name based on country code
const getCountryName = function (name) {
  const country = allCountries.filter(country => country.cca3 === name);
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
  displayCountry(filteredCountries);
};

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
goBackBtn.addEventListener('click', function () {
  filterBtn.style.display = 'block';

  displayCountry(allCountries);
  goBackBtn.classList.remove('show');
  goBackBtn.classList.add('hide');
  searchCont.style.display = 'block';

  //Clear out input field
  searchInput.value = '';
});

//Open Detail View on click
container.addEventListener('click', function (e) {
  const countryEl = e.target.closest('.country');
  const neighborEl = e.target.classList.contains('country__neighbor');

  //Hide Filter by Region dropdown in Detail View
  filterBtn.style.display = 'none';

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

  searchCont.style.display = 'none';
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
