const container = document.querySelector('.container');
const searchBar = document.querySelector('#search-country');
const searchBtn = document.querySelector('.search__btn');
const searchCont = document.querySelector('.search__container');
const goBackBtn = document.querySelector('.goBack__btn');

//This will store all countries data
let allCountries = [];

//1. Make API request and fetch all countries
const fetchCountries = async function (url, func) {
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
  const card = `<div class="country">
  <img class="country__img" src="${country.flags.png}" alt="${country.flags.alt}"/>
  <div class="country__data">
    <h3 class="country__name">${country.name.official}</h3>
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

//Display all countries or a singler country (per user's search)
const displayCountry = function (data, isDetail = false) {
  container.innerHTML = '';
  data.forEach(country => {
    container.insertAdjacentHTML(
      'beforeEnd',
      createCountryCard(country, isDetail)
    );
  });
};

//Event Listeners
searchBtn.addEventListener('click', function () {
  let searchValue = searchBar.value.toLowerCase();
  searchBar.value = '';
  searchCountry(searchValue);

  searchCont.style.display = 'none';
  goBackBtn.classList.remove('btn__hide');
  goBackBtn.classList.add('btn__show');
});

goBackBtn.addEventListener('click', function () {
  displayCountry(allCountries);
  goBackBtn.classList.remove('btn__show');
  goBackBtn.classList.add('btn__hide');
  searchCont.style.display = 'block';
});

const searchCountry = function (searchedValue) {
  const filteredCountries = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(searchedValue)
  );
  displayCountry(filteredCountries, true);
  console.log('country', filteredCountries);
};

//Initial call to fetch countries
fetchCountries('https://restcountries.com/v3.1/all');
