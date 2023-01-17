const apiKey = 'ef3d247a1b61d1160024768943d53ab9';

const search = document.getElementById('search');
search.addEventListener('click', main);

async function main() {
  // Assign variables based on user's search
  let city = document.getElementById('city').value;
  let state = document.getElementById('state').value;
  let country = document.getElementById('country').value;
  if (city == '' || state == '' || country == '') {
    console.log('unknown location');
    return;
  }
  const units = 'imperial';
  const geocoding = await getGeocoding(city, state, country, apiKey);
  // Reassign location variables based on geocoding response to keep information uniform when displaying
  city = geocoding[0].name;
  state = geocoding[0].state;
  country = geocoding[0].country;
  let weatherData = await getWeatherData(geocoding, units, apiKey);
  weatherData = processWeatherData(weatherData, city, state, country);
  console.log(weatherData);
}

async function getWeatherData(geocoding, units, apiKey) {
  const lat = geocoding[0].lat;
  const lon = geocoding[0].lon;
  r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`);
  return await r.json();
}

async function getGeocoding(city, state, country, apiKey) {
  let r = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${apiKey}`);
  return await r.json();
}

function processWeatherData(weatherData, city, state, country) {
  weatherType = weatherData.weather[0].main;
  temp = weatherData.main.temp;
  return new Weather(weatherType, temp, city, state, country);
}

class Weather {
  constructor(weatherType, temp, city, state, country) {
    this.weatherType = weatherType;
    this.temp = temp;
    this.city = city;
    this.state = state;
    this.country = country;
  }
}
