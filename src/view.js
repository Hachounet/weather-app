/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

export default class View {
  displayLocationInfos(obj) {
    const locationZone = document.getElementById('location-zone');
    locationZone.innerHTML = '';

    const keysInArray = Object.values(obj);

    keysInArray.forEach((key, index) => {
      const pLocation = document.createElement('p');
      pLocation.textContent =
        index < keysInArray.length - 1 ? ` ${key}, ` : ` ${key}`;
      locationZone.append(pLocation);
    });
  }

  generateWeatherCards(...objs) {
    const weatherApp = document.getElementById('weather-app');
    weatherApp.innerHTML = '';
    objs.forEach((obj) => {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('weather-card');

      Object.entries(obj).forEach(([key, value]) => {
        const textInformationsContainer = document.createElement('div');
        textInformationsContainer.classList.add('text-informations');

        if (
          value.includes('.jpg') ||
          value.includes('.png') ||
          value.includes('.jpeg') ||
          value.includes('.gif') ||
          value.includes('.bmp')
        ) {
          const newImg = document.createElement('img');
          newImg.src = value;
          textInformationsContainer.appendChild(newImg);
        } else {
          const dataInfos = document.createElement('p');
          // eslint-disable-next-line no-param-reassign
          key = key.replace(/_/g, ' ');
          dataInfos.textContent = `${key}: ${value}`;
          textInformationsContainer.appendChild(dataInfos);
        }

        cardContainer.appendChild(textInformationsContainer);
      });
      weatherApp.appendChild(cardContainer);
    });
  }

  changeBackground(value) {
    const weatherApp = document.getElementById('weather-app');
    weatherApp.style.backgroundImage = `url(${value})`;
  }

  blurInfos() {
    const locationZone = document.getElementById('location-zone');
    const weatherCards = document.querySelectorAll('.weather-card');

    locationZone.classList.toggle('on-loading');
    weatherCards.forEach((weatherCard) => {
      weatherCard.classList.toggle('on-loading');
    });
  }
}
