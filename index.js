// Set up global variables and event listeners
const apiKey = 'ef3d247a1b61d1160024768943d53ab9';
const errorMessage = document.getElementById('errorMessage');
const input = document.getElementById('locationSearch');
const unitToggle = document.getElementById('units');
unitToggle.addEventListener('click', toggleUnits);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    main(input.value);
    input.blur();
    input.value = '';
  }
});

// Run a search for Las Vegas on initial page load
main('Las Vegas, Nevada, US');

// Main function to carry out searching and displaying weather info
async function main(location) {
  try {
    const units = document.getElementById('units').className;
    const geocoding = await getGeocoding(location);
    const weatherData = await getWeatherData(geocoding, units);
    updateDisplay(geocoding, weatherData, units);
    errorMessage.style.display = 'none';
  } catch(error) {
    errorMessage.style.display = 'inline-block';
  }
}

// Get location information via geocoding api
async function getGeocoding(location) {
  let r = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`);
  r = await r.json();
  return {
    lat: r[0].lat,
    lon: r[0].lon,
    city: r[0].name,
    state: r[0].state,
    country: r[0].country
  }
}

// Get weather information via current weather api
async function getWeatherData(geocoding, units) {
  let r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geocoding.lat}&lon=${geocoding.lon}&units=${units}&appid=${apiKey}`);
  r = await r.json();
  return {
    weatherType: r.weather[0].main,
    weatherDescription: r.weather[0].description,
    temp: Math.round(r.main.temp),
    feelsLike: Math.round(r.main.feels_like),
    humidity: r.main.humidity,
    windSpeed: r.wind.speed
  }
}

// Update all DOM elements given the location and weather information from api requests
function updateDisplay(geocoding, weatherData, units) {
  // Set up variables for units
  let tempUnits;
  let speedUnits;
  if (units === 'imperial') {
    tempUnits = 'F';
    speedUnits = 'mph';
    weatherData.windSpeed = Math.round(weatherData.windSpeed);
  } else {
    tempUnits = 'C';
    speedUnits = 'km/h'
    weatherData.windSpeed = Math.round(weatherData.windSpeed * 3.6);
  }
  // Update DOM elements
  document.querySelector('.weatherDescription').textContent = weatherData.weatherDescription;
  document.querySelector('.temp').textContent = `${weatherData.temp} °${tempUnits}`;
  document.querySelector('.feelsLike').textContent = `Feels Like ${weatherData.feelsLike} °${tempUnits}`;
  document.querySelector('.humidity').textContent = `Humidity ${weatherData.humidity}%`;
  document.querySelector('.windSpeed').textContent = `Wind Speed ${weatherData.windSpeed} ${speedUnits}`
  const location = document.querySelector('.location');
  if (geocoding.country !== 'US') {
    location.textContent = `${geocoding.city}, ${geocoding.country}`;
  } else {
    location.textContent = `${geocoding.city}, ${geocoding.state}, ${geocoding.country}`;
  }
  const weatherType = document.querySelector('.weatherType');
  if (['Thunderstorm','Tornado'].includes(weatherData.weatherType)) {
    weatherType.src = 'images/thunderstorm.svg';
  } else if (['Drizzle','Rain'].includes(weatherData.weatherType)){
    weatherType.src = 'images/rainy.svg';
  } else if ('Snow' === weatherData.weatherType){
    weatherType.src = 'images/snow.svg';
  } else if ('Clouds' === weatherData.weatherType){
    weatherType.src = 'images/cloudy.svg';
  } else if ('Clear' === weatherData.weatherType) {
    weatherType.src = 'images/sunny.svg';
  } else {
    weatherType.src = 'images/foggy.svg';
  }
}

// Toggle between imperial and metric units
function toggleUnits() {
  const units = document.getElementById('units');
  if (units.className ==='imperial') {
    units.textContent = 'Display °F';
    units.className = 'metric';
  } else {
    units.textContent = 'Display °C';
    units.className = 'imperial';
  }
  main(document.querySelector('.location').textContent);
}
