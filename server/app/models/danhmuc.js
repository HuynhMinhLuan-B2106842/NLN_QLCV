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
    ten_DM: {
        type: String,
        required: true,
    },
    chuDe: [{
        ten: {  // Tên của chủ đề
            type: String,
        },
        tuKhoa: [{  // Mảng các từ khóa liên quan đến chủ đề
            type: String,
        }]
    }]
});

const DanhMuc = mongoose.model('danhmuc', danhmucSchema);
module.exports = DanhMuc;
