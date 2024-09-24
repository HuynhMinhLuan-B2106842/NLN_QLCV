const NguoiKyDuyet = require('../models/nguoikyduyet');

// Tạo mới người ký duyệt
exports.createNguoiKyDuyet = async (req, res) => {
    try {
        const nguoiKyDuyet = new NguoiKyDuyet({
            ten_NKD: req.body.ten_NKD
        });

        const newNguoiKyDuyet = await nguoiKyDuyet.save();
        res.status(201).json(newNguoiKyDuyet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả người ký duyệt
exports.getAllNguoiKyDuyet = async (req, res) => {
    try {
        const nguoiKyDuyetList = await NguoiKyDuyet.find();
        res.json(nguoiKyDuyetList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy một người ký duyệt theo ID
exports.getNguoiKyDuyetById = async (req, res) => {
    try {
        const nguoiKyDuyet = await NguoiKyDuyet.findById(req.params.id);
        if (!nguoiKyDuyet) return res.status(404).json({ message: 'Người ký duyệt không tồn tại' });
        res.json(nguoiKyDuyet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật một người ký duyệt theo ID
exports.updateNguoiKyDuyet = async (req, res) => {
    try {
        const nguoiKyDuyet = await NguoiKyDuyet.findById(req.params.id);
        if (!nguoiKyDuyet) return res.status(404).json({ message: 'Người ký duyệt không tồn tại' });

        nguoiKyDuyet.ten_NKD = req.body.ten_NKD || nguoiKyDuyet.ten_NKD;

        const updatedNguoiKyDuyet = await nguoiKyDuyet.save();
        res.json(updatedNguoiKyDuyet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa một người ký duyệt
exports.deleteNguoiKyDuyet = async (req, res) => {
    try {
        const nguoiKyDuyet = await NguoiKyDuyet.findByIdAndDelete(req.params.id);
        if (!nguoiKyDuyet) return res.status(404).json({ message: 'Người ký duyệt không tồn tại' });

        res.json({ message: 'Người ký duyệt đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
