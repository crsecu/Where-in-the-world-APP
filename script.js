const container = document.querySelector('.container');

//1. Make API request and display all countries

const callAPI = async function (url) {
  try {
    const request = await fetch(url);
    const response = await request.json();
    displayCountry(response);
  } catch (err) {
    console.error(err);
  }
};

//When page loads, display all countries
callAPI('https://restcountries.com/v3.1/all');

const displayCountry = function (data) {
  console.log('data', data);
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
