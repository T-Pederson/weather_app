const apiKey = 'ef3d247a1b61d1160024768943d53ab9';
const search = document.getElementById('search');
const input = document.getElementById('city');
const unitToggle = document.getElementById('units');
search.addEventListener('click', main);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    input.blur();
    main();
  }
});
unitToggle.addEventListener('click', main);

async function main() {
  try {
    const geocoding = await getGeocoding();
    const weatherData = await getWeatherData(geocoding);
    updateDisplay(geocoding, weatherData);
  } catch(error) {
    alert('City not found.');
    return;
  }
}

async function getGeocoding() {
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const country = document.getElementById('country').value;
  let r = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${apiKey}`);
  r = await r.json();
  return {
    lat: r[0].lat,
    lon: r[0].lon,
    city: r[0].name,
    state: r[0].state,
    country: r[0].country
  }
}

async function getWeatherData(geocoding) {
  let units;
  if (document.getElementById('units').checked) {
    units = 'metric';
  } else {
    units = 'imperial';
  }
  let r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geocoding.lat}&lon=${geocoding.lon}&units=${units}&appid=${apiKey}`);
  r = await r.json();
  return {
    weatherType: r.weather[0].main,
    temp: Math.round(r.main.temp),
    feelsLike: Math.round(r.main.feels_like),
    humidity: r.main.humidity
  }
}

function updateDisplay(geocoding, weatherData) {
  document.querySelector('.weather').style.display = 'inline-block';
  document.querySelector('.temp').textContent = `Temp: ${weatherData.temp}°F`;
  document.querySelector('.feelsLike').textContent = `Feels Like: ${weatherData.feelsLike}°F`;
  document.querySelector('.humidity').textContent = `Humidity: ${weatherData.humidity}%`;
  const location = document.querySelector('.location');
  if (geocoding.state === '') {
    location.textContent = `${geocoding.city}, ${geocoding.country}`;
  } else {
    location.textContent = `${geocoding.city}, ${geocoding.state} ${geocoding.country}`;
  }
  const weatherType = document.querySelector('.weatherType');
  switch(weatherData.weatherType) {
    case 'Thunderstorm':
    case 'Tornado':
      weatherType.src = 'images/thunderstorm.svg';
      break;
    case 'Drizzle':
    case 'Rain':
      weatherType.src = 'images/rainy.svg';
      break;
    case 'Snow':
      weatherType.src = 'images/snow.svg';
      break;
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Fog':
    case 'Sand':
    case 'Dust':
    case 'Ash':
    case 'Squall':
      weatherType.src = 'images/foggy.svg';
      break;
    case 'Clear':
      weatherType.src = 'images/sunny.svg';
      break;
    case 'Clouds':
      weatherType.src = 'images/cloudy.svg';
      break;
  }
}
