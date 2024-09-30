const CongVan = require('../models/congvan');
const DanhMuc = require('../models/danhmuc');
const ChuDe = require('../models/chude'); // Thêm import model chủ đề

// Kiểm tra danh mục tồn tại
const checkDanhMucExists = async (danhMucId) => {
    const danhMuc = await DanhMuc.findById(danhMucId);
    if (!danhMuc) throw new Error('Danh mục không tồn tại');
};

// Kiểm tra chủ đề tồn tại
const checkChuDeExists = async (chuDeId) => {
    const chuDe = await ChuDe.findById(chuDeId);
    if (!chuDe) throw new Error('Chủ đề không tồn tại');
};

// Tạo mới công văn
exports.createCongVan = async (req, res) => {
    try {
        await checkDanhMucExists(req.body.danhmuc);
        await checkChuDeExists(req.body.chude); // Kiểm tra chủ đề

        const congvan = new CongVan({
            ngaybanhanh: req.body.ngaybanhanh,
            ngayhethieuluc: req.body.ngayhethieuluc,
            sokihieu: req.body.sokihieu,
            noidung: req.body.noidung,
            nguoilienquan: req.body.nguoilienquan,
            sotrang: req.body.sotrang,
            filecv: req.file ? req.file.path : null, // Chỉ lưu tên file gốc
            danhmuc: req.body.danhmuc, // Thêm tham chiếu đến danh mục
            chude: req.body.chude // Thêm tham chiếu đến chủ đề
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
        const congvanList = await CongVan.find().populate('danhmuc', 'ten_DM').populate('chude', 'ten_CD'); // Lấy thông tin danh mục và chủ đề
        res.json(congvanList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy một công văn theo ID
exports.getCongVanById = async (req, res) => {
    try {
        const congvan = await CongVan.findById(req.params.id).populate('danhmuc', 'ten_DM').populate('chude', 'ten_CD'); // Lấy thông tin danh mục và chủ đề
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
            await checkDanhMucExists(req.body.danhmuc);
            congvan.danhmuc = req.body.danhmuc;
        }

        // Kiểm tra chủ đề tồn tại nếu được cập nhật
        if (req.body.chude) {
            await checkChuDeExists(req.body.chude);
            congvan.chude = req.body.chude; // Cập nhật chủ đề
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

        res.json({ message: 'Công văn đã được xóa', congvan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
