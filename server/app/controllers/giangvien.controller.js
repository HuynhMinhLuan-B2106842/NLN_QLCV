const GiangVien = require('../models/giangvien');

// Tạo mới giảng viên
exports.createGiangVien = async (req, res) => {
    try {
        const giangVien = new GiangVien({
            ten_GV: req.body.ten_GV,
            email_GV: req.body.email_GV,
            diachi_GV: req.body.diachi_GV,
            sdt_K: req.body.sdt_GV
        });

        const newGiangVien = await giangVien.save();
        res.status(201).json(newGiangVien);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Lấy tất cả giảng viên
exports.getAllGiangVien = async (req, res) => {
    try {
        const giangVienList = await GiangVien.find();
        res.json(giangVienList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy một giảng viên theo ID
exports.getGiangVienById = async (req, res) => {
    try {
        const giangVien = await GiangVien.findById(req.params.id);
        if (!giangVien) return res.status(404).json({ message: 'Giảng viên không tồn tại' });
        res.json(giangVien);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật một giảng viên theo ID
exports.updateGiangVien = async (req, res) => {
    try {
        const giangVien = await GiangVien.findById(req.params.id);
        if (!giangVien) return res.status(404).json({ message: 'Giảng viên không tồn tại' });

        giangVien.ten_GV = req.body.ten_GV || giangVien.ten_GV;
        giangVien.email_GV = req.body.email_GV || giangVien.email_GV;
        giangVien.diachi_GV = req.body.diachi_GV || giangVien.diachi_GV;
        giangVien.sdt_GV = req.body.sdt_GV || giangVien.sdt_GV;

        const updatedGiangVien = await giangVien.save();
        res.json(updatedGiangVien);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Xóa một giảng viên
exports.deleteGiangVien = async (req, res) => {
    try {
        const giangVien = await GiangVien.findByIdAndDelete(req.params.id);
        if (!giangVien) return res.status(404).json({ message: 'Giảng viên không tồn tại' });

        //await giangVien.remove();
        res.json({ message: 'Giảng viên đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
