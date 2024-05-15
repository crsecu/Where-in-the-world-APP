const container = document.querySelector('.container');
const searchInput = document.querySelector('#search-country');
const searchCont = document.querySelector('.search__container');
const goBackBtn = document.querySelector('.goBack__btn');
const regionsSelect = document.querySelector('#regions');

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
  const card = `<div class="country" data-name="${country.name.common}">
  <img class="country__img" src="${country.flags.png}" alt="${country.flags.alt}"/>
  <div class="country__data">
    <h3 class="country__name">${country.name.common}</h3>
    <p class="country__population">Population:${country.population}</p>
    <p class="country__region">Region:${country.region}</p>
    <p class="country__capital">Capital:${country.capital}</p>
  </div>
</div>`;

  //Display neighbors on Country Detail
  let neighbours = `<div class="country__neighbors"><h3>Neighbours</h3>`;
  if (country.borders && country.borders.length > 0) {
    neighbours += country.borders
      .map(
        neighbour =>
          `<span class="country__neighbor" data-name="${neighbour}">${neighbour}</span>`
      )
      .join('');
  } else {
    neighbours += 'No neighbouring countries';
  }

  neighbours += '</div>';

  if (!isDetail) {
    return card;
  } else {
    return `${card} ${neighbours}`;
  }
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
  displayCountry(allCountries);
  goBackBtn.classList.remove('btn__show');
  goBackBtn.classList.add('btn__hide');
  searchCont.style.display = 'block';
});

//Open detail page on click
container.addEventListener('click', function (e) {
  const countryEl = e.target.closest('.country');
  const neighborEl = e.target.classList.contains('country__neighbor');

  //Open Detail Page
  if (countryEl) {
    countryData = countryEl.getAttribute('data-name');
    const country = allCountries.filter(
      country => country.name.common === countryData
    );
    displayCountry(country, true);
  }

  //Open Neighbor Detail Page
  if (neighborEl) {
    neighborData = e.target.getAttribute('data-name');
    const findNeighbor = allCountries.filter(
      country => country.cca3 === neighborData
    );
    displayCountry(findNeighbor, true);
  }

  searchCont.style.display = 'none';
  goBackBtn.classList.remove('btn__hide');
  goBackBtn.classList.add('btn__show');
});

//Filter countries by region
regionsSelect.addEventListener('change', function () {
  const selectedRegion = regionsSelect.value;
  if (selectedRegion === 'All') {
    displayCountry(allCountries);
  } else {
    const filterRegion = allCountries.filter(
      country => country.region === selectedRegion
    );
    displayCountry(filterRegion);
  }
});
