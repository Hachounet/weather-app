/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
// MyAPI = c9149996cc324fd2ad590353242503
export default class Model {
  flattenObject(obj, prefix = '', flattened = {}) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.flattenObject(obj[key], `${prefix}${key}.`, flattened);
      } else {
        // eslint-disable-next-line no-param-reassign
        flattened[`${prefix}${key}`] = obj[key];
      }
    }
    return flattened;
  }

  extract(obj, ...params) {
    const newObject = {};
    params.forEach((param) => {
      let value = obj;
      const keys = param.split('.');
      keys.forEach((key) => {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
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
          if (!Object.prototype.hasOwnProperty.call(currentLevel, key)) {
            currentLevel[key] = {};
          }
          currentLevel = currentLevel[key];
        }
        currentLevel[lastKey] = value;
      }
    });
    return newObject;
  }

  async fetchWeather(location) {
    try {
      const response = await fetch(
        `https://api.Weatherapi.com/v1/forecast.json?key=c9149996cc324fd2ad590353242503&q=${location}&days=3`,
        { mode: 'cors' }
      );
      const data = await response.json();
      const mainInfos = this.extract(
        data,
        'current.condition.text',
        'current.condition.icon',
        'current.feelslike_c',
        'current.humidity',
        'current.precip_mm',
        'current.temp_c',
        'current.wind_kph',
        'current.last_updated',
        'location.country',
        'location.name',
        'location.region',
        'forecast.forecastday.0.date',
        'forecast.forecastday.0.day.maxtemp_c',
        'forecast.forecastday.0.day.mintemp_c',
        'forecast.forecastday.0.day.condition.text',
        'forecast.forecastday.0.day.condition.icon',
        'forecast.forecastday.0.day.daily_chance_of_rain',
        'forecast.forecastday.0.day.totalprecip_mm',
        'forecast.forecastday.1.date',
        'forecast.forecastday.1.day.maxtemp_c',
        'forecast.forecastday.1.day.mintemp_c',
        'forecast.forecastday.1.day.condition.text',
        'forecast.forecastday.1.day.condition.icon',
        'forecast.forecastday.1.day.daily_chance_of_rain',
        'forecast.forecastday.1.day.totalprecip_mm',
        'forecast.forecastday.2.date',
        'forecast.forecastday.2.day.maxtemp_c',
        'forecast.forecastday.2.day.mintemp_c',
        'forecast.forecastday.2.day.condition.text',
        'forecast.forecastday.2.day.condition.icon',
        'forecast.forecastday.2.day.daily_chance_of_rain',
        'forecast.forecastday.2.day.totalprecip_mm'
      );
      const flatObject = this.flattenObject(mainInfos);
      return flatObject;
    } catch (error) {
      console.log('Error occured.');
      console.log(error);
      throw error;
    }
  }

  async retrieveCurrentWeatherInformations(location) {
    try {
      const mainInfos = await this.fetchWeather(location);

      const currentWeatherInfos = {
        Condition: mainInfos['current.condition.text'],
        ConditionIcon: mainInfos['current.condition.icon'],
        Temperature: `${mainInfos['current.temp_c']}°C`,
        Wind: `${mainInfos['current.wind_kph']} kph`,
        Feelslike: `${mainInfos['current.feelslike_c']}°C`,
        Humidity: `${mainInfos['current.humidity']}%`,
        Precipitation: `${mainInfos['current.precip_mm']} mm`,
        Updated: mainInfos['current.last_updated'],
      };

      return currentWeatherInfos;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async retrieveForecastWeatherInformations(location) {
    try {
      const mainInfos = await this.fetchWeather(location);
      console.log('This is mainInfos in forecast', mainInfos);
      const forecastDays = {};

      for (let i = 0; i < 3; i++) {
        const forecastKey = `forecastDay${i}`;
        forecastDays[forecastKey] = {
          Day: mainInfos[`forecast.forecastday.${i}.date`],
          ConditionIcon:
            mainInfos[`forecast.forecastday.${i}.day.condition.icon`],
          Condition: mainInfos[`forecast.forecastday.${i}.day.condition.text`],
          Max_temperature: `${mainInfos[`forecast.forecastday.${i}.day.maxtemp_c`]}°C`,
          Min_temperature: `${mainInfos[`forecast.forecastday.${i}.day.mintemp_c`]}°C`,
          Rain_probability_in_mm: `${mainInfos[`forecast.forecastday.${i}.day.daily_chance_of_rain`]}mm`,
          Total_precipitation_in_mm: `${mainInfos[`forecast.forecastday.${i}.day.totalprecip_mm`]}mm`,
        };
      }

      return forecastDays;
    } catch (error) {
      console.error('Forecast Error:', error);
      throw error;
    }
  }

  async retrieveCurrentLocationInformations(location) {
    try {
      const mainInfos = await this.fetchWeather(location);
      const locationInfos = {
        name: mainInfos['location.name'],
        country: mainInfos['location.country'],
        region: mainInfos['location.region'],
      };
      return locationInfos;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async fetchGiphy(value) {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=0XOA8oYHFEET7n46Lk69XLp09A1rUADD&s=${value}`,
        { mode: 'cors' }
      );

      // Vérifier si la réponse est OK
      if (!response.ok) {
        // Si la réponse n'est pas OK, créer une erreur personnalisée avec le statut de la réponse
        return null;
      }

      const responseData = await response.json();
      const gifURL = responseData.data.images.original.url;
      return gifURL;
    } catch (error) {
      console.error('Error fetching GIF:', error);
      return null;
    }
  }
}
