const Khoa = require('../models/khoa');

// Tạo mới khoa
exports.createKhoa = async (req, res) => {
    try {
        const khoa = new Khoa({
            ten_K: req.body.ten_K,
            truong_K: req.body.truong_K,
            sdt_K: req.body.sdt_K
        });

        const newKhoa = await khoa.save();
        res.status(201).json(newKhoa);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Lấy tất cả khoa
exports.getAllKhoa = async (req, res) => {
    try {
        const khoaList = await Khoa.find();
        res.json(khoaList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy một khoa theo ID
exports.getKhoaById = async (req, res) => {
    try {
        const khoa = await Khoa.findById(req.params.id);
        if (!khoa) return res.status(404).json({ message: 'Khoa không tồn tại' });
        res.json(khoa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật một khoa theo ID
exports.updateKhoa = async (req, res) => {
    try {
        const khoa = await Khoa.findById(req.params.id);
        if (!khoa) return res.status(404).json({ message: 'Khoa không tồn tại' });

        khoa.ten_K = req.body.ten_K || khoa.ten_K;
        khoa.truong_K = req.body.truong_K || khoa.truong_K;
        khoa.sdt_K = req.body.sdt_K || khoa.sdt_K;

        const updatedKhoa = await khoa.save();
        res.json(updatedKhoa);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Xóa một khoa
exports.deleteKhoa = async (req, res) => {
    try {
        const khoa = await Khoa.findByIdAndDelete(req.params.id);
        if (!khoa) return res.status(404).json({ message: 'Khoa không tồn tại' });

        //await khoa.remove();
        res.json({ message: 'Khoa đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
