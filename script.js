// API key
var apiKey = "85bf9bafe7ed879cd54ec771d3a9b0f4";

// DOM elements
var currentCity = document.getElementById('current-city');
var currentDate = document.getElementById('current-date');
var currentTemp = document.getElementById('current-temp');
var currentWind = document.getElementById('current-wind');
var currentHumidity = document.getElementById('current-humidity');

var searchHistory = document.getElementById('history');

var fiveDay = document.getElementById('five-day-results');
var fiveDayText = document.getElementById('five-day-text');

let searchInfo = document.getElementById('search-info');
let searchButton = document.getElementById('search-btn');


let cities = [];

var city;
var searchCity;

// when clicked run fetchCityInfo
searchButton.addEventListener('click', (e) => {
    

    e.preventDefault();
    fetchCoordinates();
    // const searchedCity = searchInfo.value.trim();
    // if (searchedCity) {
    //     displayWeather(searchedCity);
    // }

    // localStorage.setItem("cities", JSON.stringify(cities));

});

// get city coords
// fetchCoordinates
const fetchCoordinates = function() {

    if(!city) {
        city = searchInfo.value;
        
    }
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=85bf9bafe7ed879cd54ec771d3a9b0f4')
    
        .then((response) => response.json())
        .then((data) => {
           fetchFiveDay(data[0].lat, data[0].lon);
           displayWeather(data[0].lat, data[0].lon); 
        })
        
        .catch((err) => {
            console.log(err, 'Sorry, there was an issue retrieving the weather data for this city.')
        })
       
}

const lati = (data) => {
    return data[0].lat;
}

const long = (data) => {
    return data[0].lon;
}


// fetch weather info by latitude and longtitude and pass the data to currentWeather
const displayWeather = (lati, long) => { 
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lati + '&lon=' + long + '&units=imperial&appid=85bf9bafe7ed879cd54ec771d3a9b0f4')
    .then((response) => response.json())
    .then((data) => {
        currentWeather(data.name, data.main.temp, data.wind.speed, data.main.humidity);
    });    
};

// receives data from displayWeather & renders it to the DOM
const currentWeather = (name, temp, wind, humidity, date) => {

    currentDate.textContent = date;
    currentCity.textContent = name;
    currentTemp.textContent = temp + "° F";
    currentWind.textContent = wind + " mph winds";
    currentHumidity.textContent = humidity + "% Humidity";

    for(let i = 0; i < localStorage.length; i++) {
        if(localStorage.getItem(i) === name) {
            return;
        } 
    }

    cityButton(name);
    localStorage.setItem(localStorage.length, name);
}

// receives latitude & longitude data from fetchCoordinates & uses it to fetch five day data 
const fetchFiveDay = (lati, long) => {
    fiveDay.innerHTML = "";
    fiveDayText.textContent = "Five Day Forecast";

    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lati + '&lon=' + long + '&units=imperial&appid=85bf9bafe7ed879cd54ec771d3a9b0f4')
        .then((response) => response.json())
        .then((data) => {
            for(let i = 1; i < data.list.length; i+= 8) {
                renderFiveDay(
                    data.list[i].dt_txt,
                    data.list[i].main.temp,
                    data.list[i].wind.speed,
                    data.list[i].main.humidity
                );
        }
    });

    console.log("5 day");
};

const formatDate = (date) => {
    let day;
    let month;
    let year;
    date = date.slice(0,10)
    date = date.split('-')
    year = date[0];
    month = date[1];
    day = date[2];

    return month + '/' + day + '/' + year;
}

// receives data from fetchFiveDay & renders it to the DOM
const renderFiveDay = (date, temp, wind, humidity) => {

    const dayEl = document.createElement('ul');
    dayEl.setAttribute("class", "column card no-bullets")
    dayEl.classList.add('five-day-card');

    const dateEl = document.createElement('li');
    dateEl.textContent = formatDate(date);

    const tempEl = document.createElement('li');
    tempEl.textContent = temp + "° F";

    const windEl = document.createElement('li');
    windEl.textContent = wind + " mph winds";

    const humidityEl = document.createElement('li');
    humidityEl.textContent = humidity + "% Humidity";

    dayEl.appendChild(dateEl);
    dayEl.appendChild(tempEl);
    dayEl.appendChild(windEl);
    dayEl.appendChild(humidityEl);

    fiveDay.appendChild(dayEl);
}

// new button for cities in local storage
const cityButton = (name) => {
    for (var i = 0; i < cities.length; i++) {

    let newSearch = document.createElement('button');
        newSearch.textContent = name;
        newSearch.id = 'search-history-btn'
        searchHistory.appendChild(newSearch);
}


// local storage to show past searches
const displayLocalStorage = () => {
    for(let i = 0; i < localStorage.length; i++) {
        cityButton(localStorage.getItem(i));
    }
}

displayLocalStorage();

document.addEventListener('click', (e) => {
    if(e.target.id == 'search-history-btn') {
       displayWeather(e.target.textContent);
    }
})
}

