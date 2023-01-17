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
  const units = 'imperial';
  const geocoding = await getGeocoding(city, apiKey);
  let weatherData = await getWeatherData(geocoding, units, apiKey);
  weatherData = processWeatherData(weatherData);
  console.log(weatherData);
}

async function getGeocoding(city, apiKey) {
  let r = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`);
  r = await r.json();
  return {
    lat: r[0].lat,
    lon: r[0].lon,
  };
}

async function getWeatherData(geocoding, units, apiKey) {
  const lat = geocoding.lat;
  const lon = geocoding.lon;
  r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`);
  return await r.json();
}

function processWeatherData(weatherData) {
  weatherType = weatherData.weather[0].description;
  temp = weatherData.main.temp;
  feelsLike = weatherData.main.feels_like;
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
