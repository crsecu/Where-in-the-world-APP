const container = document.querySelector('.container');
const searchBar = document.querySelector('#search-country');
const searchBtn = document.querySelector('.search__btn');
const searchCont = document.querySelector('.search__container');
const goBackBtn = document.querySelector('.goBack__btn');

//1. Make API request and display all countries

const callAPI = async function (url, func) {
  try {
    const request = await fetch(url);
    const response = await request.json();
    func(response);
  } catch (err) {
    console.error(err);
  }
};

const displayCountry = function (data) {
  console.log('data is ', data);
  data.forEach(country => {
    const countryCard = `<div class="country">
    <img class="country__img" src="${country.flags.png}" alt="${country.flags.alt}"/>
    <div class="country__data">
      <h3 class="country__name">${country.name.official}</h3>
      <p class="country__population">${country.population}</p>
      <p class="country__region">${country.region}</p>
      <p class="country__capital">${country.capital}</p>
    </div>
  </div>`;

    container.insertAdjacentHTML('beforeEnd', countryCard);
  });
};

//When page loads, display all countries
callAPI('https://restcountries.com/v3.1/all', displayCountry);

//Function that displays the country that the user searched for
const displaySearchResult = function (data) {
  const country = data[0];
  const countryCard = `<div class="country">
      <img class="country__img" src="${country.flags.png}" alt="${country.flags.alt}"/>
      <div class="country__data">
        <h3 class="country__name">${country.name.official}</h3>
        <p class="country__population">${country.population}</p>
        <p class="country__region">${country.region}</p>
        <p class="country__capital">${country.capital}</p>
      </div>
    </div>`;
  container.innerHTML = '';
  container.insertAdjacentHTML('beforeEnd', countryCard);
  searchCont.style.display = 'none';
  goBackBtn.classList.remove('btn__hide');
  goBackBtn.classList.add('.btn__show');
};

searchBtn.addEventListener('click', function () {
  let searchValue = searchBar.value;
  searchBar.value = '';
  searchCountry(searchValue);
});

goBackBtn.addEventListener('click', function () {
  container.innerHTML = '';
  callAPI('https://restcountries.com/v3.1/all', displayCountry);
  goBackBtn.classList.remove('btn__show');
  goBackBtn.classList.add('btn__hide');
  searchCont.style.display = 'block';

  /* NOTE FOR LATER:
  Think of a way to avoid making a second API request to display all countries
  when Go Back btn is clicked*/
});

const searchCountry = function (country) {
  const getCountry = callAPI(
    `https://restcountries.com/v3.1/name/${country}`,
    displaySearchResult
  );
};
