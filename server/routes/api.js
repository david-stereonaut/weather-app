const express = require('express')
const router = express.Router()
const axios = require('axios').default
const mongoose = require('mongoose')
const City = require('../model/City')

mongoose.connect("mongodb://localhost/weather-app")

/* design stuff */
const picsNcolors = {
    Thunderstorm: ["https://upload.wikimedia.org/wikipedia/commons/8/82/Lightning_Pritzerbe_01_%28MK%29.jpg", "#144552"],
    Drizzle: ["https://www.jpl.nasa.gov/images/earth/20170725/drizzle-16.jpg", "#52796f"],
    Rain: ["https://greekherald.com.au/wp-content/uploads/2020/01/blog-rain-or-shine.jpg", "#1a535c"],
    Snow: ["https://static.euronews.com/articles/stories/04/45/99/98/1440x810_cmsv2_371acacd-a248-570b-8e4a-a28481ce9f55-4459998.jpg", "#eff7f6"],
    Fog: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Mist: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Smoke: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Haze: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Dust: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Sand: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Ash: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Squall: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Tornado: ["https://d1acid63ghtydj.cloudfront.net/09-10-2018/t_bc3e74a6f3cd4aa7827169e691066448_name_fog.JPG", "#8b8c89"],
    Clear: ["https://www.basecampcountry.com/wp-content/uploads/2019/08/blue-sky-clear-sky-clouds-518415-1030x580.jpg", "#4ecdc4"],
    Clouds: ["https://images2.minutemediacdn.com/image/upload/c_crop,h_1193,w_2121,x_0,y_221/v1555155296/shape/mentalfloss/iStock-104472907.jpg?itok=MWApeKzW", "#aed9e0"]
}


/* real stuff */
const getCityData = async function(cityName) {
    let info = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=79aeaea703fb324557f2e301e71cf963`)
    let capitalized = info.data.weather[0].description[0].toUpperCase()+info.data.weather[0].description.slice(1)
    const infoSorted = {
        name: info.data.name,
        country: info.data.sys.country,
        temperature: Math.floor(info.data.main.temp - 273.15),
        feelsLike: Math.floor(info.data.main.feels_like - 273.15),
        mainPic: picsNcolors[info.data.weather[0].main][0],
        color: picsNcolors[info.data.weather[0].main][1],
        condition: capitalized,
        conditionPic: `http://openweathermap.org/img/wn/${info.data.weather[0].icon}@2x.png`
    }
    return (infoSorted)
}
router.get('/city/:cityName/:lat?/:lon?', async function(req, res) {
    if(req.params.lat && req.params.lon) {
        try {
            let info = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${req.params.lat}&lon=${req.params.lon}&appid=79aeaea703fb324557f2e301e71cf963`)
            let capitalized = info.data.weather[0].description[0].toUpperCase()+info.data.weather[0].description.slice(1)
            const infoSorted = {
                name: info.data.name,
                country: info.data.sys.country,
                temperature: Math.floor(info.data.main.temp - 273.15),
                feelsLike: Math.floor(info.data.main.feels_like - 273.15),
                mainPic: picsNcolors[info.data.weather[0].main][0],
                color: picsNcolors[info.data.weather[0].main][1],
                condition: capitalized,
                conditionPic: `http://openweathermap.org/img/wn/${info.data.weather[0].icon}@2x.png`
            }
            res.send(infoSorted)
        } catch(err) {
            res.send(err)
        }
    } else {
        try {
            let info = await getCityData(req.params.cityName)
            res.send(info)
        } catch(err) {
            res.send(err)
        }
    }
})

router.get('/cities', async function(req, res) {
    let info = await City.find({}).sort({$natural:-1})
    res.send(info.map(({ name, country, temperature, feelsLike, mainPic, color, condition, conditionPic, _id }) => ({
        name,
        country,
        temperature,
        feelsLike,
        mainPic,
        color,
        condition,
        conditionPic,
        _id
    })))
})

router.post('/city', function(req, res) {
    if (req.body._id){
        res.send("Already saved in DB")
    } else {
        new City(req.body).save().then(function(newCity) {
            res.send(newCity)
        })
    }
})

router.delete('/city', async function(req, res) {
    City.findOneAndDelete({name: req.body.cityName }).then(
        res.send("deleted")
    )
})

router.put('/city', async function(req, res) {
    if (req.body.updateDB) {
        let info = await getCityData(req.body.cityName)
        City.findByIdAndUpdate(req.body.updateDB, info, { new: true, useFindAndModify: false }, function(err, result) {
            let {__v, ...fixedResult} = result._doc
            res.send(fixedResult)
        })
    } else {
        let info = await getCityData(req.params.cityName)
        res.send(info)
    }
})

module.exports = router