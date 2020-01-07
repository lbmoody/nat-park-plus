import { statesData } from './statesData.mjs'; 

var stateAbbr;
var geojson;
var mapboxAccessToken = 'pk.eyJ1IjoibGJtb29keTMiLCJhIjoiY2s1M2F5b3N1MDZvaDNucWtyYzcwaGRtZyJ9.QrJwm16_sr1Sfu2m6rkG-A';
var map = L.map('map').setView([37.8, -96], 4);

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);

L.geoJson(statesData).addTo(map);

function style() {
    return {
        fillColor: '#4dd0e1',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.25
    };
}

L.geoJson(statesData, { style: style }).addTo(map);

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#f4511e',
        dashArray: '',
        fillOpacity: 0.4,
        fillColor: '#f4511e'
    });

    $("#state").text(`State: ${layer.feature.properties.name}`);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    $("#state").text(`State: `);

}

function getStateAbbrv(e) {
    stateAbbr = e.target.feature.properties.abbr
    console.log(stateAbbr);
    const baseUrl = 'https://api.nps.gov/api/v1/parks'
    const stateArr = stateAbbr;
    const maxResults = 10;
    const apiKey = 'ewon9dMmTNuHBaizXjLacObc4oexVjKwJbh4DHKs';
    getParks(baseUrl, stateArr, maxResults, apiKey);

}

function getParks(baseUrl, stateArr, maxResults, apiKey) {
    const params = {
        stateCode: stateArr,
        limit: maxResults
    }
    // Creating url string
    const queryString = formatQueryParams(params);
    const url = baseUrl + '?' + queryString + '&api_key=' + apiKey;
    console.log(url);

    // Fetch information, if there's an error display a message
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => {
            $('.js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResults(responseJson, maxResults) {
    console.log(responseJson);
    // Clearing previous results
    $('.results-list').empty();
    // Looping through the response and formatting results
    for (let i = 0; i < responseJson.data.length & i < maxResults; i++) {
        $('.results-list').append(`<li><h3><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
        </li>`);
    }
    $('.results').removeClass('hidden');
}


function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: getStateAbbrv
    });

    layer.on({
        click: zoomToFeature
    })

}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
