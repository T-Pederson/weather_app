const apiKey = 'ef3d247a1b61d1160024768943d53ab9';

const search = document.getElementById('search');
const input = document.getElementById('city');
search.addEventListener('click', main);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    input.blur();
    main();
  }
});

async function main() {
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  let country = document.getElementById('country').value;
  const geocoding = await getGeocoding(city, state, country, apiKey);
  country = geocoding.country;
  let weatherData = await getWeatherData(geocoding, apiKey);
  weatherData = processWeatherData(weatherData);
  weatherTypeGif(weatherData.weatherType);
  console.log(weatherData);
}

async function getGeocoding(city, state, country, apiKey) {
  let r = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${apiKey}`);
  r = await r.json();
  console.log(r);
  return {
    lat: r[0].lat,
    lon: r[0].lon,
    country: r[0].country
  };
}

async function getWeatherData(geocoding, apiKey) {
  const lat = geocoding.lat;
  const lon = geocoding.lon;
  r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
  return await r.json();
}

function processWeatherData(weatherData) {
  weatherType = weatherData.weather[0].main;
  temp = Math.round(weatherData.main.temp);
  feelsLike = Math.round(weatherData.main.feels_like);
  humidity = weatherData.main.humidity;
  city = weatherData.name;
  return {
    weatherType,
    temp,
    feelsLike,
    humidity,
    city
  };
}

function convertToCelsius(f) {
  return Math.round((parseInt(f) - 32) * (5/9));
}

// function updateDisplay(weatherData) {}

