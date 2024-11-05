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
    chude: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chude',  
    }],

    khoa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'khoa',  // Tham chiếu đến model danhmuc
    },
    loaicongvan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'loaicongvan',  // Tham chiếu đến model loaicongvan
    }
})
const congvan = mongoose.model('congvan', congvanSchema)
module.exports = congvan
