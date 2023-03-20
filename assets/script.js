var searchBtn = document.querySelector('#searchBtn');
var searchHistory = document.querySelector('#searchHistory');
var cityName = document.querySelector('#cityName');
var cityTemp = document.querySelector('#temperature');
var cityWind = document.querySelector('#wind');
var cityHumid = document.querySelector('#humidity');
var cityIcon = document.querySelector('#icon');
var apiKey = "&appid=629118eb1a8773a241db2bc4f0a52be4"; //3c3943f26be9a61d1a1d5c832e18c519

localStore();

//creates recent search buttons from local storage
function localStore (){ 
    var fromStorage = JSON.parse(localStorage.getItem("weatherDashboard")) || [];
    for (var i = 0; i < fromStorage.length; i++){
        recentButton(fromStorage[i]);
    }
}

searchBtn.addEventListener("click", function(event){ 
    event.preventDefault();
    var cityInput = this.previousElementSibling.value;
    if (cityInput === "") {
        window.alert("Invalid entry. Please press OK and try again.");
        return;
    } else {
    recentButton(cityInput);
    citySearch(cityInput);
    }
})

//creates a new button containing the text from the search bar
function recentButton (cityInput){ 
    var newButton = document.createElement('button');
    newButton.classList.add('btn-dark','recentBtn');
    newButton.setAttribute('id', cityInput);
    newButton.textContent = cityInput;
    newButton.addEventListener("click", function(){
        var cityInput = this.textContent;
        citySearch(cityInput);
    });
    searchHistory.appendChild(newButton);
}

//searches for city and fetches weather data from api
function citySearch (cityInput) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial" + apiKey)
    .then(function(response){
    if(response.ok){
        return response.json();
    } else {
        console.log(response);
        cityName.textContent = `No results found.`;
        return;
    }
    })
    .then(function(weatherData){
        var icon = weatherData.weather[0].icon;
        cityName.textContent = `${weatherData.name}, ${weatherData.sys.country} (` +  moment().format('MM[/]D[/]YYYY') + ')';
        cityIcon.innerHTML = `<img src="https://openweathermap.org/img/w/${icon}.png">`
        cityTemp.textContent = `${weatherData.main.temp}°F`;
        cityWind.textContent = `${weatherData.wind.speed} MPH`;
        cityHumid.textContent = `${weatherData.main.humidity}%`;
        var cityCoord = { lat: weatherData.coord.lat, long: weatherData.coord.lon };
        var storage = JSON.parse(localStorage.getItem("weatherDashboard")) || [];
        storage.push(cityInput);
        localStorage.setItem('weatherDashboard', JSON.stringify(storage));
        fiveDayForecast(cityCoord.lat, cityCoord.long);
    });
}

//creates the cards for the 5-day forecast
function fiveDayForecast (lat, long){ 
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial" + apiKey)
    .then(function(response){
        return response.json();  
    })
    .then(function(weatherData){
        for (i = 0; i < 5; i++){
            var newCard = document.getElementById('day' + (i + 1));
            var date = moment.unix(weatherData.daily[i].dt).format('MM[/]D[/]YYYY')
            var icon = weatherData.daily[i].weather[0].icon;
            var wind = weatherData.daily[i].wind_speed;
            console.log(wind)
            var temp = weatherData.daily[i].temp.day;
            var humidity = weatherData.daily[i].humidity;
            var dailyCard = `<h3>${date}</h3><br><img src="https://openweathermap.org/img/w/${icon}.png"><br><p>Temp: ${temp}°F</p><p>${wind} MPH</p><p>Humidity: ${humidity}%</p>`
            newCard.innerHTML = dailyCard;
        }
    })
}