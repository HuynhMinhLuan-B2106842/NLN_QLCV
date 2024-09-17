const DanhMuc = require('../models/danhmuc');

// Tạo mới danh mục
exports.createDanhMuc = async (req, res) => {
    try {
        const danhMuc = new DanhMuc({
            ten_DM: req.body.ten_DM
        });

        const newDanhMuc = await danhMuc.save();
        res.status(201).json(newDanhMuc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Lấy tất cả danh mục
exports.getAllDanhMuc = async (req, res) => {
    try {
        const danhMucList = await DanhMuc.find();
        res.json(danhMucList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy một danh mục theo ID
exports.getDanhMucById = async (req, res) => {
    try {
        const danhMuc = await DanhMuc.findById(req.params.id);
        if (!danhMuc) return res.status(404).json({ message: 'Danh mục không tồn tại' });
        res.json(danhMuc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật một danh mục theo ID
exports.updateDanhMuc = async (req, res) => {
    try {
        const danhMuc = await DanhMuc.findById(req.params.id);
        if (!danhMuc) return res.status(404).json({ message: 'Danh mục không tồn tại' });

        danhMuc.ten_DM = req.body.ten_DM || danhMuc.ten_DM;

        const updatedDanhMuc = await danhMuc.save();
        res.json(updatedDanhMuc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Xóa một danh mục
exports.deleteDanhMuc = async (req, res) => {
    try {
        const danhMuc = await DanhMuc.findByIdAndDelete(req.params.id);
        if (!danhMuc) return res.status(404).json({ message: 'Danh mục không tồn tại' });

        //await danhMuc.remove();
        res.json({ message: 'Danh mục đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
