const mongoose = require("mongoose");

const chudeSchema = new mongoose.Schema({
    ten_CD: {
        type: String,
        required: true,
    }
})
const chude = mongoose.model('chude', chudeSchema)
module.exports = chude
