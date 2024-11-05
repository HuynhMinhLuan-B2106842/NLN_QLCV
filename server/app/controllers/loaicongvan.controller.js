const LoaiCongVan = require('../models/loaicongvan');

// Tạo mới loại công văn
exports.createLoaiCongVan = async (req, res) => {
    try {
        const loaiCongVan = new LoaiCongVan({
            ten_LCV: req.body.ten_LCV
        });

        const newLoaiCongVan = await loaiCongVan.save();
        res.status(201).json(newLoaiCongVan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Lấy tất cả loại công văn
exports.getAllLoaiCongVan = async (req, res) => {
    try {
        const loaiCongVanList = await LoaiCongVan.find();
        res.json(loaiCongVanList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy một loại công văn theo ID
exports.getLoaiCongVanById = async (req, res) => {
    try {
        const loaiCongVan = await LoaiCongVan.findById(req.params.id);
        if (!loaiCongVan) return res.status(404).json({ message: 'Loại công văn không tồn tại' });
        res.json(loaiCongVan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật một loại công văn theo ID
exports.updateLoaiCongVan = async (req, res) => {
    try {
        const loaiCongVan = await LoaiCongVan.findById(req.params.id);
        if (!loaiCongVan) return res.status(404).json({ message: 'Loại công văn không tồn tại' });

        loaiCongVan.ten_LCV = req.body.ten_LCV || loaiCongVan.ten_LCV;

        const updatedLoaiCongVan = await loaiCongVan.save();
        res.json(updatedLoaiCongVan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Xóa một loại công văn
exports.deleteLoaiCongVan = async (req, res) => {
    try {
        const loaiCongVan = await LoaiCongVan.findByIdAndDelete(req.params.id);
        if (!loaiCongVan) return res.status(404).json({ message: 'Loại công văn không tồn tại' });

        //await loaiCongVan.remove();
        res.json({ message: 'Loại công văn đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
