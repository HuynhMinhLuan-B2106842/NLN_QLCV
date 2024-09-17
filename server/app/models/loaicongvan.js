const mongoose = require("mongoose");

const loaicongvanSchema = new mongoose.Schema({
    ten_LCV: {
        type: String,
        required: true,
    }
})
const loaicongvan = mongoose.model('loaicongvan', loaicongvanSchema)
module.exports = loaicongvan
