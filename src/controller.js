/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import View from './view';
import Model from './API';

export default class Controller {
  constructor() {
    this.view = new View();
    this.model = new Model();
    this.focus = 'current';
    this.location = 'Paris';
    this.searchBtnEvent();
    this.currentBtnEvent();
    this.forecastBtnEvent();
    this.generateDefaultWeather();
  }

  searchBtnEvent() {
    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click', async () => {
      // Wrap the event handler in an async function
      const inputValue = this.retrieveInputValue();
      this.location = inputValue;
      this.callViewToBlur();
      try {
        const locationInformations =
          await this.model.retrieveCurrentLocationInformations(this.location);
        if (this.focus === 'current') {
          this.currentLogic();
        } else if (this.focus === 'forecast') {
          this.forecastLogic();
        }
        this.callViewToUpdateLocation(locationInformations);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }

  forecastBtnEvent() {
    const forecastBtn = document.getElementById('forecast-weather');
    forecastBtn.addEventListener('click', async () => {
      this.callViewToBlur();
      this.switchFocus();
      await this.forecastLogic();
    });
  }

  async forecastLogic() {
    const forecastObjects =
      await this.model.retrieveForecastWeatherInformations(this.location);
    this.callViewToBlur();
    const flatten0 = this.model.flattenObject(forecastObjects.forecastDay0);
    const flatten1 = this.model.flattenObject(forecastObjects.forecastDay1);
    const flatten2 = this.model.flattenObject(forecastObjects.forecastDay2);
    this.callViewToDisplayWeatherInformations(flatten0, flatten1, flatten2);
    this.GiphyLogic(flatten0.Condition);
  }

  currentBtnEvent() {
    const currentBtn = document.getElementById('current-weather');
    currentBtn.addEventListener('click', async () => {
      this.switchFocus();
      this.callViewToBlur();
      this.currentLogic();
    });
  }

  async currentLogic() {
    const currentObject = await this.model.retrieveCurrentWeatherInformations(
      this.location
    );
    this.callViewToBlur();
    this.callViewToDisplayWeatherInformations(currentObject);
    this.GiphyLogic(currentObject.Condition);
  }

  switchFocus() {
    this.focus = this.focus === 'current' ? 'forecast' : 'current';
  }

  retrieveInputValue() {
    const inputValue = document.getElementById('search-bar').value;
    return inputValue;
  }

  callViewToUpdateLocation(obj) {
    this.view.displayLocationInfos(obj);
  }

  callViewToDisplayWeatherInformations(...objs) {
    this.view.generateWeatherCards(...objs);
  }

  callViewToChangeBackground(value) {
    this.view.changeBackground(value);
  }

  callViewToBlur() {
    this.view.blurInfos();
  }

  async generateDefaultWeather() {
    try {
      const locationInformations =
        await this.model.retrieveCurrentLocationInformations('Paris');
      const weatherInformations =
        await this.model.retrieveCurrentWeatherInformations('Paris');
      this.callViewToUpdateLocation(locationInformations);
      this.callViewToDisplayWeatherInformations(weatherInformations);
      this.GiphyLogic(weatherInformations.Condition);
    } catch (error) {
      console.log('Generate default weather error:', error);
      throw error;
    }
  }

  async GiphyLogic(value) {
    try {
      let gifURL = await this.model.fetchGiphy(value);
      if (gifURL === null) {
        gifURL =
          'https://www.shutterstock.com/shutterstock/photos/1646867911/display_1500/stock-photo-closeup-portrait-of-happy-pensioner-smiling-at-camera-1646867911.jpg';
      }
      this.callViewToChangeBackground(gifURL);
    } catch (error) {
      console.log('Error in Giphy Logic process');
      throw error;
    }
  }
}
