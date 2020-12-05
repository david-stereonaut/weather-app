class Renderer {
    constructor() {

    }

    renderMain(city) {
        $("#main").empty()
        const mainTemplate = Handlebars.compile($("#main-template").html())
        const mainHTML = mainTemplate(city)
        $("#searchbar").css("background-color", city.color)
        $("#main").css("background-image", `url('${city.mainPic}')`)
        $("#main").append(mainHTML)
    }

    async renderData(cities) {
        $("#results").empty()
        const cityTemplate = Handlebars.compile($("#city-template").html())
        const cityHTML = cityTemplate(cities)
        $("#results").append(cityHTML)
    }

    colorUs(cities) {
        $(".result").map(function() {
            const child = this.getElementsByTagName('div')[0]
            const name = child.innerHTML
            const color = cities.find(c => c.name === name).color
            this.style.backgroundColor = color
        })
    }

}