const Chude = require('../models/chude');

// Tạo mới chủ đề
exports.createChude = async (req, res) => {
    try {
        const ten_CD = req.body.ten_CD;

        // Kiểm tra xem tên chủ đề có chứa dấu phẩy hay không
        if (ten_CD.includes(',')) {
            return res.status(400).json({ message: 'Tên chủ đề không được chứa dấu phẩy.' });
        }

        const chude = new Chude({
            ten_CD: ten_CD
        });

        const newChude = await chude.save();
        res.status(201).json(newChude);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả chủ đề
exports.getAllChude = async (req, res) => {
    try {
        const chudeList = await Chude.find();
        res.json(chudeList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy một chủ đề theo ID
exports.getChudeById = async (req, res) => {
    try {
        const chude = await Chude.findById(req.params.id);
        if (!chude) return res.status(404).json({ message: 'Chủ đề không tồn tại' });
        res.json(chude);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật một chủ đề theo ID
exports.updateChude = async (req, res) => {
    try {
        const chude = await Chude.findById(req.params.id);
        if (!chude) return res.status(404).json({ message: 'Chủ đề không tồn tại' });

        chude.ten_CD = req.body.ten_CD || chude.ten_CD;

        const updatedChude = await chude.save();
        res.json(updatedChude);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Xóa một chủ đề
exports.deleteChude = async (req, res) => {
    try {
        const chude = await Chude.findByIdAndDelete(req.params.id);
        if (!chude) return res.status(404).json({ message: 'Chủ đề không tồn tại' });

        //await chude.remove();
        res.json({ message: 'Chủ đề đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
