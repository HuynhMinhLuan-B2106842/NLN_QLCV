const CongVan = require('../models/congvan');
const DanhMuc = require('../models/danhmuc');

// Tạo mới công văn
exports.createCongVan = async (req, res) => {
    try {
        const danhMuc = await DanhMuc.findById(req.body.danhmuc);
        if (!danhMuc) return res.status(404).json({ message: 'Danh mục không tồn tại' });

        const congvan = new CongVan({
            ngaybanhanh: req.body.ngaybanhanh,
            ngayhethieuluc: req.body.ngayhethieuluc,
            sokihieu: req.body.sokihieu,
            noidung: req.body.noidung,
            nguoilienquan: req.body.nguoilienquan,
            sotrang: req.body.sotrang,
            filecv: req.file ? req.file.path : null, // Chỉ lưu tên file gốc
            danhmuc: req.body.danhmuc // Thêm tham chiếu đến danh mục
        });

        const newCongVan = await congvan.save();
        res.status(201).json(newCongVan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả công văn
exports.getAllCongVan = async (req, res) => {
    try {
        const congvanList = await CongVan.find().populate('danhmuc', 'ten_DM'); // Lấy thông tin danh mục
        res.json(congvanList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy một công văn theo ID
exports.getCongVanById = async (req, res) => {
    try {
        const congvan = await CongVan.findById(req.params.id).populate('danhmuc', 'ten_DM'); // Lấy thông tin danh mục
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });
        res.json(congvan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật một công văn theo ID
exports.updateCongVan = async (req, res) => {
    try {
        const congvan = await CongVan.findById(req.params.id);
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });

        // Kiểm tra danh mục tồn tại nếu được cập nhật
        if (req.body.danhmuc) {
            const danhMuc = await DanhMuc.findById(req.body.danhmuc);
            if (!danhMuc) return res.status(404).json({ message: 'Danh mục không tồn tại' });
            congvan.danhmuc = req.body.danhmuc;
        }

        congvan.ngaybanhanh = req.body.ngaybanhanh || congvan.ngaybanhanh;
        congvan.ngayhethieuluc = req.body.ngayhethieuluc || congvan.ngayhethieuluc;
        congvan.sokihieu = req.body.sokihieu || congvan.sokihieu;
        congvan.noidung = req.body.noidung || congvan.noidung;
        congvan.nguoilienquan = req.body.nguoilienquan || congvan.nguoilienquan;
        congvan.sotrang = req.body.sotrang || congvan.sotrang;
        congvan.filecv = req.file ? req.file.path : congvan.filecv; // Cập nhật đường dẫn tệp nếu có

        const updatedCongVan = await congvan.save();
        res.json(updatedCongVan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa một công văn
exports.deleteCongVan = async (req, res) => {
    try {
        const congvan = await CongVan.findByIdAndDelete(req.params.id);
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });

        res.json({ message: 'Công văn đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
