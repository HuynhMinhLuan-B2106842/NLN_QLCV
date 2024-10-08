const CongVan = require('../models/congvan');
const DanhMuc = require('../models/danhmuc');

// Kiểm tra danh mục tồn tại
const checkDanhMucExists = async (danhMucId) => {
    const danhMuc = await DanhMuc.findById(danhMucId);
    if (!danhMuc) throw new Error('Danh mục không tồn tại');
    return danhMuc;
};

// Tạo mới công văn
exports.createCongVan = async (req, res) => {
    try {
        // Kiểm tra danh mục có tồn tại không
        const danhMuc = await checkDanhMucExists(req.body.danhmuc);

        // Kiểm tra chủ đề có nằm trong danh mục không
        if (!danhMuc.chuDe.includes(req.body.chude)) {
            throw new Error('Chủ đề không tồn tại trong danh mục này');
        }

        // Tạo mới công văn
        const congvan = new CongVan({
            ngaybanhanh: req.body.ngaybanhanh,
            ngayhethieuluc: req.body.ngayhethieuluc,
            sokihieu: req.body.sokihieu,
            noidung: req.body.noidung,
            nguoilienquan: req.body.nguoilienquan,
            sotrang: req.body.sotrang,
            filecv: req.file ? req.file.path : null, // Chỉ lưu đường dẫn tệp gốc
            danhmuc: req.body.danhmuc,
            chude: req.body.chude // Lưu chủ đề được chọn
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
        const congvanList = await CongVan.find()
            .populate('danhmuc', 'ten_DM') // Lấy tên danh mục
            .select('ngaybanhanh ngayhethieuluc sokihieu noidung nguoilienquan sotrang filecv chude');
        res.json(congvanList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy công văn theo ID
exports.getCongVanById = async (req, res) => {
    try {
        const congvan = await CongVan.findById(req.params.id)
            .populate('danhmuc', 'ten_DM') // Lấy tên danh mục
            .select('ngaybanhanh ngayhethieuluc sokihieu noidung nguoilienquan sotrang filecv chude');
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });
        res.json(congvan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật công văn theo ID
exports.updateCongVan = async (req, res) => {
    try {
        const congvan = await CongVan.findById(req.params.id);
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });

        // Kiểm tra danh mục nếu được cập nhật
        if (req.body.danhmuc) {
            const danhMuc = await checkDanhMucExists(req.body.danhmuc);

            // Kiểm tra chủ đề có nằm trong danh mục không nếu được cung cấp
            if (req.body.chude && !danhMuc.chuDe.includes(req.body.chude)) {
                throw new Error('Chủ đề không tồn tại trong danh mục này');
            }
            congvan.danhmuc = req.body.danhmuc;
            congvan.chude = req.body.chude || congvan.chude; // Cập nhật chủ đề nếu có
        }

        // Cập nhật các trường khác
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

// Xóa một công văn theo ID
exports.deleteCongVan = async (req, res) => {
    try {
        const congvan = await CongVan.findByIdAndDelete(req.params.id);
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });

        res.json({ message: 'Công văn đã được xóa', congvan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// controllers/congvanController.js


// Controller để lấy thống kê công văn
exports.thongkeCongvan = async (req, res) => {
  try {
    // Tổng số công văn
    const totalCongvan = await CongVan.countDocuments();

    // Số công văn đang hiệu lực (ngày hết hiệu lực lớn hơn hoặc bằng ngày hiện tại)
    const congvanDangHieuluc = await CongVan.countDocuments({
      ngayhethieuluc: { $gte: new Date() },
    });

    // Số công văn hết hiệu lực (ngày hết hiệu lực nhỏ hơn ngày hiện tại)
    const congvanHetHieuluc = await CongVan.countDocuments({
      ngayhethieuluc: { $lt: new Date() },
    });

    // Số công văn theo danh mục
    const congvanTheoDanhmuc = await CongVan.aggregate([
      { $group: { _id: '$danhmuc', soCongvan: { $sum: 1 } } },
      {
        $lookup: {
          from: 'danhmucs',
          localField: '_id',
          foreignField: '_id',
          as: 'danhmuc',
        },
      },
      { $unwind: '$danhmuc' },
      { $project: { ten_DM: '$danhmuc.ten_DM', soCongvan: 1 } },
    ]);

    // Trả về dữ liệu thống kê
    res.json({
      totalCongvan,
      congvanDangHieuluc,
      congvanHetHieuluc,
      congvanTheoDanhmuc,
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    res.status(500).send('Lỗi server');
  }
};

// const CongVan = require('../models/congvan');
// const DanhMuc = require('../models/danhmuc');
// const LoaiCongVan = require('../models/loaicongvan'); // Import mô hình loại công văn

// // Kiểm tra danh mục tồn tại
// const checkDanhMucExists = async (danhMucId) => {
//     const danhMuc = await DanhMuc.findById(danhMucId);
//     if (!danhMuc) throw new Error('Danh mục không tồn tại');
//     return danhMuc;
// };

// // Tạo mới công văn
// exports.createCongVan = async (req, res) => {
//     try {
//         // Kiểm tra danh mục có tồn tại không
//         const danhMuc = await checkDanhMucExists(req.body.danhmuc);

//         // Kiểm tra chủ đề có nằm trong danh mục không
//         if (!danhMuc.chuDe.includes(req.body.chude)) {
//             throw new Error('Chủ đề không tồn tại trong danh mục này');
//         }

//         // Kiểm tra loại công văn có tồn tại không
//         const loaiCongVan = await LoaiCongVan.findById(req.body.loaicongvan);
//         if (!loaiCongVan) throw new Error('Loại công văn không tồn tại');

//         // Tạo mới công văn
//         const congvan = new CongVan({
//             ngaybanhanh: req.body.ngaybanhanh,
//             ngayhethieuluc: req.body.ngayhethieuluc,
//             sokihieu: req.body.sokihieu,
//             noidung: req.body.noidung,
//             nguoilienquan: req.body.nguoilienquan,
//             sotrang: req.body.sotrang,
//             filecv: req.file ? req.file.path : null,
//             danhmuc: req.body.danhmuc,
//             chude: req.body.chude,
//             loaicongvan: req.body.loaicongvan // Lưu loại công văn
//         });

//         const newCongVan = await congvan.save();
//         res.status(201).json(newCongVan);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Lấy tất cả công văn
// exports.getAllCongVan = async (req, res) => {
//     try {
//         const congvanList = await CongVan.find()
//             .populate('danhmuc', 'ten_DM') // Lấy tên danh mục
//             .populate('loaicongvan', 'ten_LCV') // Lấy tên loại công văn
//             .select('ngaybanhanh ngayhethieuluc sokihieu noidung nguoilienquan sotrang filecv chude loaicongvan');
//         res.json(congvanList);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Lấy công văn theo ID
// exports.getCongVanById = async (req, res) => {
//     try {
//         const congvan = await CongVan.findById(req.params.id)
//             .populate('danhmuc', 'ten_DM') // Lấy tên danh mục
//             .populate('loaicongvan', 'ten_LCV') // Lấy tên loại công văn
//             .select('ngaybanhanh ngayhethieuluc sokihieu noidung nguoilienquan sotrang filecv chude loaicongvan');
//         if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });
//         res.json(congvan);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Cập nhật công văn theo ID
// exports.updateCongVan = async (req, res) => {
//     try {
//         const congvan = await CongVan.findById(req.params.id);
//         if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });

//         // Kiểm tra danh mục nếu được cập nhật
//         if (req.body.danhmuc) {
//             const danhMuc = await checkDanhMucExists(req.body.danhmuc);

//             // Kiểm tra chủ đề có nằm trong danh mục không nếu được cung cấp
//             if (req.body.chude && !danhMuc.chuDe.includes(req.body.chude)) {
//                 throw new Error('Chủ đề không tồn tại trong danh mục này');
//             }
//             congvan.danhmuc = req.body.danhmuc;
//             congvan.chude = req.body.chude || congvan.chude; // Cập nhật chủ đề nếu có
//         }

//         // Kiểm tra loại công văn nếu được cập nhật
//         if (req.body.loaicongvan) {
//             const loaiCongVan = await LoaiCongVan.findById(req.body.loaicongvan);
//             if (!loaiCongVan) throw new Error('Loại công văn không tồn tại');
//             congvan.loaicongvan = req.body.loaicongvan; // Cập nhật loại công văn
//         }

//         // Cập nhật các trường khác
//         congvan.ngaybanhanh = req.body.ngaybanhanh || congvan.ngaybanhanh;
//         congvan.ngayhethieuluc = req.body.ngayhethieuluc || congvan.ngayhethieuluc;
//         congvan.sokihieu = req.body.sokihieu || congvan.sokihieu;
//         congvan.noidung = req.body.noidung || congvan.noidung;
//         congvan.nguoilienquan = req.body.nguoilienquan || congvan.nguoilienquan;
//         congvan.sotrang = req.body.sotrang || congvan.sotrang;
//         congvan.filecv = req.file ? req.file.path : congvan.filecv; // Cập nhật đường dẫn tệp nếu có

//         const updatedCongVan = await congvan.save();
//         res.json(updatedCongVan);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Xóa một công văn theo ID
// exports.deleteCongVan = async (req, res) => {
//     try {
//         const congvan = await CongVan.findByIdAndDelete(req.params.id);
//         if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });

//         res.json({ message: 'Công văn đã được xóa', congvan });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Controller để lấy thống kê công văn
// exports.thongkeCongvan = async (req, res) => {
//     try {
//         // Tổng số công văn
//         const totalCongvan = await CongVan.countDocuments();

//         // Số công văn đang hiệu lực (ngày hết hiệu lực lớn hơn hoặc bằng ngày hiện tại)
//         const congvanDangHieuluc = await CongVan.countDocuments({
//             ngayhethieuluc: { $gte: new Date() },
//         });

//         // Số công văn hết hiệu lực (ngày hết hiệu lực nhỏ hơn ngày hiện tại)
//         const congvanHetHieuluc = await CongVan.countDocuments({
//             ngayhethieuluc: { $lt: new Date() },
//         });

//         // Số công văn theo danh mục
//         const congvanTheoDanhmuc = await CongVan.aggregate([
//             { $group: { _id: '$danhmuc', soCongvan: { $sum: 1 } } },
//             {
//                 $lookup: {
//                     from: 'danhmucs',
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'danhmuc',
//                 },
//             },
//             { $unwind: '$danhmuc' },
//             { $project: { ten_DM: '$danhmuc.ten_DM', soCongvan: 1 } },
//         ]);

//         // Trả về dữ liệu thống kê
//         res.json({
//             totalCongvan,
//             congvanDangHieuluc,
//             congvanHetHieuluc,
//             congvanTheoDanhmuc,
//         });
//     } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu thống kê:', error);
//         res.status(500).send('Lỗi server');
//     }
// };

