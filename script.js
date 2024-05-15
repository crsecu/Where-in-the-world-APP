const container = document.querySelector('.container');
const searchInput = document.querySelector('#search-country');
const searchCont = document.querySelector('.search__container');
const goBackBtn = document.querySelector('.goBack__btn');

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

const createCountryCard = function (country, isDetail = false) {
  const card = `<div class="country" data-name="${country.name.common}">
  <img class="country__img" src="${country.flags.png}" alt="${country.flags.alt}"/>
  <div class="country__data">
    <h3 class="country__name">${country.name.common}</h3>
    <p class="country__population">${country.population}</p>
    <p class="country__region">${country.region}</p>
    <p class="country__capital">${country.capital}</p>
  </div>
</div>`;

  //Display neighbors on Country Detail
  let neighbours = `<div><h3>Neighbours</h3>`;
  if (country.borders && country.borders.length > 0) {
    neighbours += country.borders
      .map(neighbour => `<span class="country__neighbor">${neighbour}</span>`)
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

//Display all countries or a single country (per user's search)
const displayCountry = function (data, isDetail = false) {
  container.innerHTML = '';
  data.forEach(country => {
    container.insertAdjacentHTML(
      'beforeEnd',
      createCountryCard(country, isDetail)
    );
  });
};

//EVENT LISTENERS

//Give user real time feedback about queried country
searchInput.addEventListener('input', function () {
  let query = searchInput.value.toLowerCase();
  if (query) {
    filteredCountry(query);
    filteredCountry;

    // If input length is more than 3 characters, make an API call for exact matc
    if (query.length > 3) {
      searchCountry(query);
    }
  }
});

goBackBtn.addEventListener('click', function () {
  displayCountry(allCountries);
  goBackBtn.classList.remove('btn__show');
  goBackBtn.classList.add('btn__hide');
  searchCont.style.display = 'block';
});

//filter client-side data to find a country
const filteredCountry = function (query) {
  const filteredCountries = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(query)
  );

  displayCountry(filteredCountries);
};

const searchCountry = function (query) {
  //Exact match needed - here we are making another api call if there is no exact match for user input
  fetch(`https://restcountries.com/v3.1/name/${query}?fullText=true`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 404) {
        //No exact match found, fall back to partial matches
        filteredCountry(query);
      } else {
        //Exact match found
        displayCountry(data, true);
      }
    })
    .catch(err => console.error('Found an error ', err));
};

//Initial call to fetch countries
fetchCountries('https://restcountries.com/v3.1/all');

//Built functionality that opens up detail page on click
container.addEventListener('click', function (e) {
  const countryDiv = e.target.closest('.country');
  if (countryDiv) {
    countryData = countryDiv.getAttribute('data-name');
    console.log('CHECKING DATA', countryData);
    searchCountry(countryData.toLowerCase());
  }
});
