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
    },
    danhmuc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'danhmuc',  // Tham chiếu đến model danhmuc
        required: true
    },
    chude: {
        type: String,
        required: true
    },
    // loaicongvan: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'loaicongvan',  // Tham chiếu đến model loaicongvan
    //     required: true
    // }
})
const congvan = mongoose.model('congvan', congvanSchema)
module.exports = congvan
