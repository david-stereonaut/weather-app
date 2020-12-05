class CityManager {
    constructor() {
        this.cityData = []
    }

    async getDataFromDB() {
        let cities = await $.get('/cities')
        this.cityData = cities
        return this.cityData
    }

    async getCityData(cityName) {
        let city = await $.get(`/city/${cityName}`)
        if (city.message) {
            /* error handling */
            console.log(city.message)
        } else {
            this.cityData.unshift(city)
            return city
        }
    }

    saveCity(cityName) {
        $.post('/city', (this.cityData.find(c => c.name === cityName)))
            .then((res) => {
                this.cityData.find(c => c.name === cityName)._id = res._id
            })
    }

    removeCityFromDB(cityName) {
        $.ajax('/city', {
            method: 'DELETE',
            data: { cityName },
            success: (res) => console.log(res)
        })
    }

    removeCity(cityName) {
        if((this.cityData.find(c => c.name === cityName))._id){
            this.removeCityFromDB(cityName)
        }
        this.cityData.forEach(c => {
            if (c.name === cityName) {
                const index = this.cityData.indexOf(c)
                this.cityData.splice(index, 1)
            }
        })
    }

    getCityDataByName(cityName) {
        return this.cityData.find(c => c.name === cityName)
    }

    updateCity(cityName) {
        let updateDB = (this.getCityDataByName(cityName)._id) ? this.getCityDataByName(cityName)._id : ''
        $.ajax('/city', {
            method: 'PUT',
            data: { cityName: cityName.toLowerCase(), updateDB },
            success: (res) => {
                let index = this.cityData.findIndex(c => c.name === cityName)
                this.cityData[index] = res
            }
        })
    }

}