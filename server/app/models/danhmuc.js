// const mongoose = require("mongoose");

// const danhmucSchema = new mongoose.Schema({
//     ten_DM: {
//         type: String,
//         required: true,
//     },
//     chuDe: [{
//         type: String,
//     }]
// });

// const DanhMuc = mongoose.model('danhmuc', danhmucSchema);
// module.exports = DanhMuc;
const mongoose = require("mongoose");

const danhmucSchema = new mongoose.Schema({
    loaicongvan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'loaicongvan'
    },
    chude: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chude'
    }
});

const DanhMuc = mongoose.model('danhmuc', danhmucSchema);
module.exports = DanhMuc;

