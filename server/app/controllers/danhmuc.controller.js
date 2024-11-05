const DanhMuc = require('../models/danhmuc');


const LoaiCongVan = require('../models/loaicongvan');
const ChuDe = require('../models/chude');

// Tạo danh mục mới với chủ đề hoặc loại công văn
exports.createDanhMuc = async (req, res) => {
    try {
        const { loaicongvanTen, chudeTen } = req.body;

        let loaiCongVan = null;
        let chuDe = null;

        // Kiểm tra loại công văn
        if (loaicongvanTen) {
            loaiCongVan = await LoaiCongVan.findOne({ ten_LCV: loaicongvanTen });
            if (!loaiCongVan) {
                loaiCongVan = new LoaiCongVan({ ten_LCV: loaicongvanTen });
                await loaiCongVan.save();
            }
        }

        // Kiểm tra chủ đề
        if (chudeTen) {
            chuDe = await ChuDe.findOne({ ten_CD: chudeTen });
            if (!chuDe) {
                chuDe = new ChuDe({ ten_CD: chudeTen });
                await chuDe.save();
            }
        }

        // Tạo danh mục mới với trường có giá trị
        const danhmuc = new DanhMuc({
            loaicongvan: loaiCongVan ? loaiCongVan._id : undefined, // Không cần nhập trường này nếu không có giá trị
            chude: chuDe ? chuDe._id : undefined // Không cần nhập trường này nếu không có giá trị
        });

        await danhmuc.save();
        res.status(201).json(danhmuc);
    } catch (error) {
        console.error("Chi tiết lỗi:", error);
        res.status(500).json({ message: "Lỗi khi tạo danh mục", error: error.message || error });
    }
};


// Lấy tất cả danh mục
exports.getAllDanhMuc = async (req, res) => {
    try {
        const danhmucs = await DanhMuc.find().populate('loaicongvan').populate('chude');
        res.status(200).json(danhmucs);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục", error });
    }
};

// Lấy danh mục theo ID
exports.getDanhMucById = async (req, res) => {
    try {
        const danhmuc = await DanhMuc.findById(req.params.id).populate('loaicongvan').populate('chude');

        if (!danhmuc) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        res.status(200).json(danhmuc);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh mục", error });
    }
};

// Cập nhật danh mục theo ID
exports.updateDanhMuc = async (req, res) => {
    try {
        const { loaicongvan, chude } = req.body;

        const danhmuc = await DanhMuc.findByIdAndUpdate(
            req.params.id,
            { loaicongvan, chude },
            { new: true }
        ).populate('loaicongvan').populate('chude');

        if (!danhmuc) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        res.status(200).json(danhmuc);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật danh mục", error });
    }
};

// Xóa danh mục theo ID
exports.deleteDanhMuc = async (req, res) => {
    try {
        const danhmuc = await DanhMuc.findByIdAndDelete(req.params.id);

        if (!danhmuc) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        res.status(200).json({ message: "Xóa danh mục thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa danh mục", error });
    }
};
