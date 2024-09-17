const mongoose = require("mongoose");

const congvanSchema = new mongoose.Schema({
    ngaybanhanh: {
        type: Date,
        required: true,
    },
    ngayhethieuluc: {
        type: Date,
        required: true,
    },
    sokihieu:{
        type: String,
        required: true,
        
    },
    noidung: {
        type: String,
        required: true,
    },
    nguoilienquan: {
        type: String,
        required: true,
    },
    sotrang: {
        type: String,
        required: true,
    },
    filecv: {
        type: String,
        required: false,
    }
})
const congvan = mongoose.model('congvan', congvanSchema)
module.exports = congvan
