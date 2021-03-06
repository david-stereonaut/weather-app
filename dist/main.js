const model = new CityManager()
const renderer = new Renderer()


/* On Load Actions */
model.getDataFromDB()
    .then(function(results) {
        renderer.renderData(results)
            .then(function(res) {
                renderer.colorUs(results)
            })
    })

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function(position) {
        let info = await model.getCityData('', position.coords.latitude, position.coords.longitude)
        renderer.renderMain(info)
        renderer.renderData(model.cityData)
        renderer.colorUs(model.cityData)
    });
}
/* Search function */
const handleSearch = function() {
    const city = $("#search-text").val().toLowerCase()
    model.getCityData(city).then(function(result) {
        renderer.renderMain(result)
        renderer.renderData(model.cityData)
        renderer.colorUs(model.cityData)
    })
}

/* Save to DB */
$("#results").on("click", ".save-to-db", function() {
    const cityName = $(this).siblings(".name").html()
    model.saveCity(cityName)
    $(this).removeAttr("class")
    $(this).attr("class", "remove-from-db res-button")
})

/* Remove from DB */
$("#results").on("click", ".remove-from-db", function() {
    const cityName = $(this).siblings(".name").html()
    console.log(cityName)
    model.removeCityFromDB(cityName)
    $(this).removeAttr("class")
    $(this).attr("class", "save-to-db res-button")
})

/* Remove from view and DB */
$("#results").on("click", ".remove", function() {
    const cityName = $(this).siblings(".name").html()
    model.removeCity(cityName)
    renderer.renderData(model.cityData)
    renderer.colorUs(model.cityData)
})

/* Update city */
$("#results").on("click", ".update", function() {
    const cityName = $(this).siblings(".name").html()
    model.updateCity(cityName)
    renderer.renderData(model.cityData)
    renderer.colorUs(model.cityData)
})

/* Click on the city to render it in the main view */
$("#results").on("click", ".result", function(e) {
    if($(e.target).is("div")) {
        const cityName = $(this).find(".name").html()
        renderer.renderMain(model.getCityDataByName(cityName))
    }
})