var progress = $('<progress class="progress is-large is-info" max="100">15%</progress>');

$("form").on("submit", function(event) {
    event.preventDefault();
    var userSearch = $(".input").val()        
    var apiKey = "ewon9dMmTNuHBaizXjLacObc4oexVjKwJbh4DHKs";
    var queryURL = "https://api.nps.gov/api/v1/parks?api_key="  + apiKey + "&q=" + userSearch;
    $(".searchDump").empty();
    $(".searchDump").append(progress);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then (function (response) {
        console.log (response)

    
        if(response.total >= 1) {
            var searchResults = response.data;
            $(".searchDump").empty();
            searchResults.forEach(function (searchResult) {
               $(".searchDump").append(
                    `<div class="card">
                        <div class="card-content">
                            <p class="title is-4"><a href="parkdashboard.html?${searchResult.parkCode}">${searchResult.fullName}</a></p>
                            <p class="subtitle is-4">${searchResult.designation}</p>
                            <div class="content">${searchResult.description}</div>
                        </div>
                    </div>`
                )
            })
        } else {
            $(".searchDump").empty();
            $(".searchDump").append(
                `<p>0 results, Please Redefine search results<p>`
            )
        }

    });
       
});

