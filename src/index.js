import './style.scss';

// MyAPI = c9149996cc324fd2ad590353242503

async function currentWeatherFromLocation(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=c9149996cc324fd2ad590353242503&q=${location}`
    );
    const data = await response.json();
    const forecastResponse = await fetch(
      `https://api.Weatherapi.com/v1/forecast.json?key=c9149996cc324fd2ad590353242503&q=${location}&days=3`
    );
    const forecastData = await forecastResponse.json();

    const mainInfos = extract(
      data,
      'current.condition.text',
      'current.condition.icon',
      'current.humidity',
      'current.temp_c',
      'current.wind_kph',
      'location.country',
      'location.name',
      'location.region'
    );

    // Create object with forecast useful data and then return it....
    console.log(mainInfos);
    console.log(forecastData);
    return mainInfos;
  } catch (error) {
    console.log('Error occured.');
    console.log(error);
    throw error;
  }
}

async function displayCurrentLocationInformations(location) {
  try {
    const mainInfos = await currentWeatherFromLocation(location);
    console.log(
      `Actually in ${mainInfos.location.name}, ${mainInfos.location.country}, ${mainInfos.location.region}, the weather is`
    );
    displayWeatherInformations(mainInfos);
  } catch (error) {
    console.log(error);
  }
}

async function displayWeatherInformations(mainInfos) {
  console.log(
    `${mainInfos.current.condition.text} with ${mainInfos.current.temp_c} degrees and ${mainInfos.current.humidity}% humidity.`
  );
}

function extract(obj, ...params) {
  const newObject = {};
  params.forEach((param) => {
    let value = obj;
    const keys = param.split('.');
    keys.forEach((key) => {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        value = undefined;
      }
    });

    if (value !== undefined) {
      const lastKey = keys[keys.length - 1];
      let currentLevel = newObject;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!currentLevel.hasOwnProperty(key)) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
      currentLevel[lastKey] = value;
    }
  });
  return newObject;
}

displayCurrentLocationInformations('La-rochelle');

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
  const inputValue = document.getElementById('search-bar').value;
  displayCurrentLocationInformations(inputValue);
});
