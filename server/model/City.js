const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
    name: String,
    country: String,
    temperature: Number,
    feelsLike: Number,
    mainPic: String,
    color: String,
    condition: String,
    conditionPic: String
})

const City = mongoose.model("City", citySchema)
module.exports = City