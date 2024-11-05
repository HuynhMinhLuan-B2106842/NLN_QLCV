const CongVan = require('../models/congvan');
const Khoa = require('../models/khoa');
const ChuDe = require('../models/chude');
const LoaiCongVan = require('../models/loaicongvan');
const multer = require('multer');

// Cấu hình multer để upload file
const upload = multer({ dest: 'uploads/' });

// Kiểm tra khoa tồn tại
const checkKhoaExists = async (khoaId) => {
    const khoa = await Khoa.findById(khoaId);
    if (!khoa) throw new Error('Khoa không tồn tại');
    return khoa;
};
const checkChuDeExists = async (chudeId) => {
    const chude = await ChuDe.findById(chudeId);
    if (!chude) throw new Error('Chủ đề không tồn tại');
    return chude;
};
// Kiểm tra loại công văn tồn tại
const checkLoaiCongVanExists = async (loaicongvanId) => {
    const loaicongvan = await LoaiCongVan.findById(loaicongvanId);
    if (!loaicongvan) throw new Error('Loại công văn không tồn tại');
    return loaicongvan;
};

exports.createCongVan = async (req, res) => {
    try {
        // Kiểm tra khoa và loại công văn tồn tại
        await checkKhoaExists(req.body.khoa);
        await checkLoaiCongVanExists(req.body.loaicongvan);

        const chudeIds = []; // Mảng lưu ID chủ đề

        // Kiểm tra và xử lý chude
        let chudeArray = req.body.chude;
        if (typeof chudeArray === 'string') {
            // Nếu chude là chuỗi, tách ra thành mảng
            chudeArray = chudeArray.split(',').map(item => item.trim());
        } else if (!Array.isArray(chudeArray)) {
            // Nếu không phải là mảng và không phải là chuỗi, đặt mảng rỗng
            chudeArray = [];
        }

        // Kiểm tra từng tên chủ đề
        for (const chudeName of chudeArray) {
            let chude = await ChuDe.findOne({ ten_CD: chudeName });

            // Nếu chủ đề không tồn tại, tạo mới
            if (!chude) {
                chude = new ChuDe({ ten_CD: chudeName });
                await chude.save();
            }

            // Thêm ID chủ đề vào mảng
            chudeIds.push(chude._id);
        }
        // Tạo mới công văn
        const congvan = new CongVan({
            ngaybanhanh: req.body.ngaybanhanh,
            ngayhethieuluc: req.body.ngayhethieuluc,
            sokihieu: req.body.sokihieu,
            noidung: req.body.noidung,
            nguoilienquan: req.body.nguoilienquan,
            sotrang: req.body.sotrang,
            filecv: req.file ? req.file.path : null,
            chude: chudeIds, // Lưu mảng ID chủ đề
            khoa: req.body.khoa,
            loaicongvan: req.body.loaicongvan,
        });

        // Lưu công văn mới
        const newCongVan = await congvan.save();
        res.status(201).json(newCongVan);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả công văn
exports.getAllCongVan = async (req, res) => {
    try {
        const congvanList = await CongVan.find()
            .populate('chude', 'ten_CD') // Lấy tên chủ đề
            .populate('khoa', 'ten_K')
            .populate('loaicongvan', 'ten_LCV')
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
            .populate('chude', 'ten_CD') // Lấy tên chủ đề
            .populate('khoa', 'ten_K')
            .populate('loaicongvan', 'ten_LCV');
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });
        res.json(congvan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật công văn theo ID
exports.updateCongVan = async (req, res) => {
    try {
        // Tìm công văn theo ID
        const congvan = await CongVan.findById(req.params.id);
        if (!congvan) return res.status(404).json({ message: 'Công văn không tồn tại' });

        // Kiểm tra và cập nhật khoa
        if (req.body.khoa) {
            await checkKhoaExists(req.body.khoa);
            congvan.khoa = req.body.khoa;
        }

        // Kiểm tra và xử lý chủ đề
        let chudeArray = req.body.chude;
        console.log("hello", chudeArray[0]);
        // Nếu chude là một chuỗi có dấu phẩy, tách thành mảng
        if (typeof chudeArray === 'string') {
            // Tách chuỗi thành mảng nếu chứa dấu phẩy
            if (chudeArray.includes(',')) {
                chudeArray = chudeArray.split(',').map(item => item.trim());
            } else {
                // Nếu không có dấu phẩy, đặt vào mảng
                chudeArray = [chudeArray.trim()];
            }
        } else if (!Array.isArray(chudeArray)) {
            // Nếu không phải là mảng và không phải là chuỗi, đặt mảng rỗng
            chudeArray = [];
        }

        // Xóa giá trị đầu tiên của mảng nếu có
        if (chudeArray.length > 0) {
            chudeArray.shift(); // Loại bỏ phần tử đầu tiên
        }

        let chudeIds = []; // Mảng lưu ID chủ đề

        for (const chudeName of chudeArray) {
            // Tìm chủ đề trong cơ sở dữ liệu
            let chude = await ChuDe.findOne({ ten_CD: chudeName });

            // Nếu chủ đề không tồn tại, tạo mới
            if (!chude) {
                chude = new ChuDe({ ten_CD: chudeName });
                await chude.save();
            }

            // Thêm ID chủ đề vào mảng
            chudeIds.push(chude._id);
        }

        // Cập nhật mảng ID chủ đề
        congvan.chude = chudeIds;

        // Kiểm tra và cập nhật loại công văn
        if (req.body.loaicongvan) {
            await checkLoaiCongVanExists(req.body.loaicongvan);
            congvan.loaicongvan = req.body.loaicongvan;
        }

        // Cập nhật các trường khác
        congvan.ngaybanhanh = req.body.ngaybanhanh || congvan.ngaybanhanh;
        congvan.ngayhethieuluc = req.body.ngayhethieuluc || congvan.ngayhethieuluc;
        congvan.sokihieu = req.body.sokihieu || congvan.sokihieu;
        congvan.noidung = req.body.noidung || congvan.noidung;
        congvan.nguoilienquan = req.body.nguoilienquan || congvan.nguoilienquan;
        congvan.sotrang = req.body.sotrang || congvan.sotrang;
        congvan.filecv = req.file ? req.file.path : congvan.filecv;

        // Lưu công văn đã cập nhật
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

        // Số công văn theo khoa
        const congvanTheoKhoa = await CongVan.aggregate([
            { $group: { _id: '$khoa', soCongvan: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'khoas',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'khoa',
                },
            },
            { $unwind: '$khoa' },
            { $project: { ten_K: '$khoa.ten_K', soCongvan: 1 } },
        ]);

        // Số công văn theo loại công văn
        const congvanTheoLoai = await CongVan.aggregate([
            { $group: { _id: '$loaicongvan', soCongvan: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'loaicongvans',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'loaicongvan',
                },
            },
            { $unwind: '$loaicongvan' },
            { $project: { ten_LCV: '$loaicongvan.ten_LCV', soCongvan: 1 } },
        ]);

        // Trả về dữ liệu thống kê
        res.json({
            totalCongvan,
            congvanDangHieuluc,
            congvanHetHieuluc,
            congvanTheoKhoa,
            congvanTheoLoai,
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
        res.status(500).send('Lỗi server');
    }
};
