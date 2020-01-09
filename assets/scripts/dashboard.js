var parkCode = window.location.search.replace("?", "");
var apiKey = "ewon9dMmTNuHBaizXjLacObc4oexVjKwJbh4DHKs";
var queryURL = "https://api.nps.gov/api/v1/parks" + "?parkCode=" + parkCode + "&api_key=" + apiKey;

// park name AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).then (function (response) {
$(".park-title").text(response.data[0].fullName);
var latLong = response.data[0].latLong;
var newLat = latLong.replace("lat:", "");
var coords = newLat.replace(" long:", "");
var newCoords = coords.split(",");
var latitude = newCoords[0];
var longitude = newCoords[1];

showWeather(latitude, longitude);
});


// weather AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).then (function (response) {
$(".daily-weather").text(response.data[0].weatherInfo);
});

// park info AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).then (function (response) {
$(".park-info").text(response.data[0].description);
});

// alerts AJAX call
var queryURL = "https://api.nps.gov/api/v1/alerts" + "?parkCode=" + parkCode + "&api_key=" + apiKey;
$.ajax({
    url: queryURL,
    method: "GET"
}).then (function (response) {
$(".park-alerts").text(response.data[0].description);
});

// campgrounds AJAX call
var queryURL = "https://api.nps.gov/api/v1/campgrounds" + "?parkCode=" + parkCode + "&api_key=" + apiKey;

$.ajax({
    url: queryURL,
    method: "GET"
}).then (function (response) {
$(".camp-info").text(response.data.length);
});

// events AJAX call
var queryURL = "https://api.nps.gov/api/v1/events" + "?parkCode=" + parkCode + "&api_key=" + apiKey;

$.ajax({
    url: queryURL,
    method: "GET"
}).then (function (response) {
    var eventsArray = response.data;
//     var icon = response.weather[0].icon;
// var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
    console.log(response.data);
    eventsArray.forEach(function (event) {

        $(".park-events").append(
            `<div class="card">
                <div class="card-content">
                 <p class="title">${event.title} <span class="tag is-primary">${event.types}</span></p>
                 <p class="subtitle">${event.location}</p>
                 <p class="content">${event.description}</p>
                </div>
            </div>`);
    })
    
});

// openweather API

function showWeather (latitude, longitude) {
    

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&APPID=5859ec0dbfd9ff0a36abca355158892e`,
        type: "GET",
    }).then (function (response) {
        console.log(response)
        var icon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
        $(".daily-temp").append(`<div class="card">
        <div class="card-content">
        <img src="${iconurl}"/>
        <p class="title is-1">${response.weather[0].main}</p>
        <p class="title">${response.main.temp}°F</p>
        <p class="title">Feels like ${response.main.feels_like}°F</p>
        <p class="title">Humidity: ${response.main.humidity}%</p>
        <p class="title">Wind ${response.wind.speed} mph</p>
        </div>
    </div>`);
    });
    
}
