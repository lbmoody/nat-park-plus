var parkCode = "yell";
var apiKey = "ewon9dMmTNuHBaizXjLacObc4oexVjKwJbh4DHKs";
var queryURL = "https://api.nps.gov/api/v1/parks" + "?parkCode=" + parkCode + "&api_key=" + apiKey;

// park name AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).then (function (response) {
$(".park-title").text(response.data[0].fullName);
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
    eventsArray.forEach(function (event) {
        console.log(event);

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

// // openweather API
// $.ajax({
// url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=5859ec0dbfd9ff0a36abca355158892e",
// type: "GET",
// success: function (data) {
// var forecastDisplay = showForecast(data)
// // add to page
// }
// });
