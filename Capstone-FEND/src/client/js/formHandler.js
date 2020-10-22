import 'babel-polyfill';

let UIdata = {};
const getLengthOfTrip = () => {
  const start = new Date(document.getElementById('start').value);
  const end = new Date(document.getElementById('end').value);
  const length = end.getTime() - start.getTime();
  UIdata.lengthOfTrip = length / (1000 * 60 * 60 * 24) + " days";
}

const getRemainingDaysOfTrip = () => {
  const start = new Date(document.getElementById('start').value);
  const time = new Date();
  const remainingTimeToTrip = Math.ceil(start - time);
  UIdata.remainingTimeToTrip = Math.ceil(remainingTimeToTrip / (1000 * 60 * 60 * 24)) + " days";
}

async function formHandler() {
  const city = document.getElementById('city').value;

  await fetch(`http://localhost:8080/getLatLang?city=${city}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  .then(res => res.json())
  .then(async res => {
    UIdata.country = res.countryName;
    UIdata.city = res.name;
    UIdata.population = res.population;
    await getWeather(`http://localhost:8080/getWeather?lat=${res.lat}&long=${res.lng}`)
  })
  .catch(err => {
    console.log(err)
  })
}

const getWeather = async (url) => {
  await fetch(url , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  .then(res => res.json())
  .then(async res => {
    UIdata.temperature = res.data[0].temp;
    UIdata.weatherDesc = res.data[0].weather.description;
    await getPics(`http://localhost:8080/getPics?q=${UIdata.city}`)
  })
  .catch(err => {
    console.log(err)
  })
}
const getPics = async (url) => {
  await fetch(url , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  .then(res => res.json())
  .then(res => {
    UIdata.img = res.webformatURL;
  })
  .catch(err => {
    console.log(err)
  })
}

export const updateUI = () => {
  document.getElementById('modal-img').setAttribute('src', UIdata.img);
  document.getElementById('modal-city').innerHTML = UIdata.city;
  document.getElementById('modal-country').innerHTML = UIdata.country;
  document.getElementById('modal-temp').innerHTML = UIdata.temperature;
  document.getElementById('modal-weather').innerHTML = UIdata.weatherDesc;
  document.getElementById('modal-population').innerHTML = UIdata.population;
  document.getElementById('modal-timeRemaining').innerHTML = UIdata.remainingTimeToTrip;
  document.getElementById('modal-tripLength').innerHTML = UIdata.lengthOfTrip;
  document.getElementById('modal-launch').click();
}

export const validateAndProcess = async () => {
  const destination = document.getElementById('city').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const startDate = new Date(start);
  const endDate = new Date(end);

  if(start.length !== 0 && end.length !== 0 && destination.length !== 0 && (endDate - startDate >= 0)){
    document.getElementById('form-submit').innerHTML = "please wait..."
    await formHandler();
    getRemainingDaysOfTrip();
    getLengthOfTrip();
    document.getElementById('form-submit').innerHTML = "Submit";
    updateUI();
  } else {
    document.getElementById('status').innerHTML = "Please enter the correct values";
    setTimeout(() => {
      document.getElementById('status').innerHTML = "";}, 2500)
  }
}
