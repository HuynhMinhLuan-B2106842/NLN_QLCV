const mongoose = require("mongoose");

const nguoikyduyetSchema = new mongoose.Schema({
    ten_NKD: {
        type: String,
        required: true,
    }
})
const nguoikyduyet = mongoose.model('nguoikyduyet', nguoikyduyetSchema)
module.exports = nguoikyduyet
