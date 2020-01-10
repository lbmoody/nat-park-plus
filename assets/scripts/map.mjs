import { statesData } from './statesData.mjs'; 

var stateAbbr;
var geojson;
var mapboxAccessToken = 'pk.eyJ1IjoibGJtb29keTMiLCJhIjoiY2s1M2F5b3N1MDZvaDNucWtyYzcwaGRtZyJ9.QrJwm16_sr1Sfu2m6rkG-A';
var map = L.map('map').setView([37.8, -96], 4);

// organizes queryParams
function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

// creates map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/streets-v11',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);

// creates styles for maps
function style() {
    return {
        fillColor: '#ff5722',
        weight: 2,
        opacity: 1,
        color: '#bdbdbd',
        dashArray: '3',
        fillOpacity: 0.25
    };
}

// function to set on mousover that highlights the state you are currently hovering over
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#ff5722',
        dashArray: '',
        fillOpacity: 0.4,
        fillColor: '#ff5722'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

}

// function to set on mouseout to reset style after mouseover event
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    getStateAbbrv(e);
}

// function run on click event
function getStateAbbrv(e) {
    stateAbbr = e.target.feature.properties.abbr
    // console.log(stateAbbr);
    const baseUrl = 'https://api.nps.gov/api/v1/parks'
    const stateArr = stateAbbr;
    const maxResults = 50;
    const apiKey = 'ewon9dMmTNuHBaizXjLacObc4oexVjKwJbh4DHKs';
    getParks(baseUrl, stateArr, maxResults, apiKey);
    info.update(e.target.feature.properties.name);

}

// function run inside click event that runs ajax call to nps api
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
    var loader = $('<progress id="loading" class="progress is-large is-info" max="100">15%</progress>');
    $(".results-list").empty();
    $(".results-list").append(loader);

    // ajax calls 
    $.ajax({
        url: url,
        method: "GET"
    }).then( function (response) {
        displayResults(response, maxResults);
    })
}

// function called inside ajax call to display ajax response
function displayResults(responseJson, maxResults) {
    console.log(responseJson);
    $('.results-list').empty();
    var markerArray = [];
    // Looping through the response and formatting results
    for (let i = 0; i < responseJson.data.length & i < maxResults; i++) {    
        $(".results-list").append(
            `<div class="card">
                <div class="card-content">
                    <p class="title is-4"><a href="parkdashboard.html?${responseJson.data[i].parkCode}" name="${responseJson.data[i].id}">${responseJson.data[i].fullName}</a></p>
                    <p class="subtitle is-4">${responseJson.data[i].designation}</p>
                    <div class="content">${responseJson.data[i].description}</div>
                </div>
            </div>`
        )
        
        var latLong = responseJson.data[i].latLong;
        if (latLong) {
            var newlat = latLong.replace("lat:", "");
            var coords = newlat.replace("long:", "");
            var newCoords = coords.split(",");
            var marker = L.marker([newCoords[0], newCoords[1]])
            markerArray.push(marker);
            marker.bindPopup(`<b>${responseJson.data[i].fullName}</b><br>${responseJson.data[i].designation}<br><a href="#${responseJson.data[i].id}">view</a>`).openPopup();
        }
    }
    // console.log(markerArray);
    var group = L.featureGroup(markerArray).addTo(map);
    // markers.addLayers(markerArray);

    $('.results').removeClass('hidden');

}


// event function that calls mouseover, mouseout, and click events
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });

}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (stateName) {
        this._div.innerHTML = `<b>Select a State</b><br>${stateName}`; 

    // + (props ?
    //     '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
    //     : 'Hover over a state');
};

info.addTo(map);
