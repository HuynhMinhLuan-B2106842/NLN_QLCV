const mongoose = require("mongoose");

const khoaSchema = new mongoose.Schema({
    ten_K: {
        type: String,
        required: true,
    },
    truong_K: {
        type: String,
        required: true,
    },
    sdt_K: {
        type: String,
        required: true,
    }
})
const khoa = mongoose.model('khoa', khoaSchema)
module.exports = khoa
