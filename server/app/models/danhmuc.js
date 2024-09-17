const mongoose = require("mongoose");

const danhmucSchema = new mongoose.Schema({
    ten_DM: {
        type: String,
        required: true,
    }
})
const danhmuc = mongoose.model('danhmuc', danhmucSchema)
module.exports = danhmuc
