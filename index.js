const apiKey = 'ef3d247a1b61d1160024768943d53ab9';
const errorMessage = document.getElementById('errorMessage');
const input = document.getElementById('city');
const unitToggle = document.getElementById('units');
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    input.blur();
    main(input.value);
    input.value = '';
  }
});
unitToggle.addEventListener('click', toggleUnits);
main('Las Vegas, Nevada, US');

async function main(location) {
  try {
    const units = document.getElementById('units').className;
    const geocoding = await getGeocoding(location);
    const weatherData = await getWeatherData(geocoding, units);
    updateDisplay(geocoding, weatherData, units);
    errorMessage.style.display = 'none';
  } catch(error) {
    errorMessage.style.display = 'inline-block';
    return;
  }
}

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

function updateDisplay(geocoding, weatherData, units) {
  document.querySelector('.weather').style.display = 'inline-block';
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
