const mongoose = require("mongoose");

const giangvienSchema = new mongoose.Schema({
    ten_GV: {
        type: String,
        required: true,
    },
    email_GV: {
        type: String,
        required: true,
    },
    diachi_GV: {
        type: String,
        required: true,
    },
    sdt_GV: {
        type: String,
        required: true,
    }
})
const giangvien = mongoose.model('giangvien', giangvienSchema)
module.exports = giangvien
