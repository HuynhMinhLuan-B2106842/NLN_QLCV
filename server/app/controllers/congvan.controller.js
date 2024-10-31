const CongVan = require('../models/congvan');
const DanhMuc = require('../models/danhmuc');
const Khoa = require('../models/khoa');
const multer = require('multer');

// Cấu hình multer để upload file
const upload = multer({ dest: 'uploads/' }); // Bạn có thể thay đổi đường dẫn và cấu hình thêm nếu cần

// Kiểm tra danh mục tồn tại
const checkDanhMucExists = async (danhMucId) => {
    const danhMuc = await DanhMuc.findById(danhMucId);
    if (!danhMuc) throw new Error('Danh mục không tồn tại');
    return danhMuc;
};
// Kiểm tra khoa tồn tại
const checkKhoaExists = async (khoaId) => {
    const khoa = await Khoa.findById(khoaId);
    if (!khoa) throw new Error('Khoa không tồn tại');
    return khoa;
}
// Tạo mới công văn
exports.createCongVan = async (req, res) => {
    try {
        // Kiểm tra danh mục tồn tại
        const danhMuc = await checkDanhMucExists(req.body.danhmuc);
        const khoa = await checkKhoaExists(req.body.khoa);
        // Xử lý mảng chủ đề
        let chudeArray;

        // Nếu req.body.chude là một chuỗi JSON, chuyển đổi nó thành mảng
        if (typeof req.body.chude === 'string') {
            try {
                chudeArray = JSON.parse(req.body.chude);
            } catch (error) {
                throw new Error('Dữ liệu chủ đề không hợp lệ');
            }
        } else if (Array.isArray(req.body.chude)) {
            chudeArray = req.body.chude;
        } else {
            throw new Error('Dữ liệu chủ đề không hợp lệ');
        }
        
        // Kiểm tra từng chủ đề có nằm trong danh mục không
        const danhMucChuDeTenArray = danhMuc.chuDe.map(cd => cd.ten);
        for (const chude of chudeArray) {
            if (!danhMucChuDeTenArray.includes(chude)) {
                throw new Error(`Chủ đề "${chude}" không tồn tại trong danh mục này`);
            }
        }
        
        console.log(chudeArray);
        console.log(danhMuc.chuDe);
        

        // Tạo mới công văn
        const congvan = new CongVan({
            ngaybanhanh: req.body.ngaybanhanh,
            ngayhethieuluc: req.body.ngayhethieuluc,
            sokihieu: req.body.sokihieu,
            noidung: req.body.noidung,
            nguoilienquan: req.body.nguoilienquan,
            sotrang: req.body.sotrang,
            filecv: req.file ? req.file.path : null, // Lưu đường dẫn file nếu có file đính kèm
            danhmuc: req.body.danhmuc,
            chude: chudeArray, // Lưu danh sách chủ đề được chọn
            khoa: req.body.khoa
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
            .populate('danhmuc', 'ten_DM') // Lấy tên danh mục
            .populate('khoa', 'ten_K')
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
            .populate('khoa', 'ten_K')
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


        if (req.body.danhmuc) {
            const danhMuc = await checkDanhMucExists(req.body.danhmuc);
            if (!danhMuc) return res.status(404).json({ message: 'Danh mục không tồn tại' });

            // Xử lý mảng chủ đề
            let chudeArray;
            console.log(req.body.chude); // In ra để kiểm tra
            if (typeof req.body.chude === 'string') {
                // Kiểm tra nếu là chuỗi
                try {
                    chudeArray = JSON.parse(req.body.chude); // Phân tích cú pháp chuỗi JSON
                } catch (error) {
                    return res.status(400).json({ message: 'Dữ liệu chủ đề không hợp lệ' });
                }
            } else if (Array.isArray(req.body.chude)) {
                // Nếu đã là mảng
                chudeArray = req.body.chude;
            } else {
                return res.status(400).json({ message: 'Dữ liệu chủ đề không hợp lệ' });
            }

            // Kiểm tra từng chủ đề có nằm trong danh mục không
            const danhMucChuDeTenArray = danhMuc.chuDe.map(cd => cd.ten);
            for (const chude of chudeArray) {
                if (!danhMucChuDeTenArray.includes(chude)) {
                    return res.status(400).json({ message: `Chủ đề "${chude}" không tồn tại trong danh mục này` });
                }
            }

            congvan.danhmuc = req.body.danhmuc;
            congvan.chude = chudeArray; // Cập nhật chủ đề
        }
        if (req.body.khoa) {
            const khoa = await Khoa.findById(req.body.khoa);
            if (!khoa) return res.status(404).json({ message: 'Khoa không tồn tại' });
            congvan.khoa = req.body.khoa; // Cập nhật khoa
        }
        // Cập nhật các trường khác
        congvan.ngaybanhanh = req.body.ngaybanhanh || congvan.ngaybanhanh;
        congvan.ngayhethieuluc = req.body.ngayhethieuluc || congvan.ngayhethieuluc;
        congvan.sokihieu = req.body.sokihieu || congvan.sokihieu;
        congvan.noidung = req.body.noidung || congvan.noidung;
        congvan.nguoilienquan = req.body.nguoilienquan || congvan.nguoilienquan;
        congvan.sotrang = req.body.sotrang || congvan.sotrang;
        congvan.filecv = req.file ? req.file.path : congvan.filecv;

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
// Tìm kiếm công văn 
exports.searchCongVanByKeyword = async (req, res) => {
    try {
        const keyword = decodeURIComponent(req.query.keyword || '');  

        // Tìm danh mục có chủ đề chứa từ khóa trong tuKhoa
        const danhMucList = await DanhMuc.find({
            'chuDe.tuKhoa': { $regex: keyword, $options: 'i' } 
        });

        // Lấy tất cả các chủ đề có chứa từ khóa trong tuKhoa từ danh mục đã tìm được
        const filteredChuDe = danhMucList.flatMap(danhmuc => 
            danhmuc.chuDe.filter(cd => cd.tuKhoa.some(tk => new RegExp(keyword, 'i').test(tk)))
        );

        // Lấy danh sách các tên chủ đề đã lọc
        const chuDeNames = filteredChuDe.map(cd => cd.ten);

        // Tìm kiếm công văn không chỉ dựa trên chủ đề mà còn các trường khác
        const congvanList = await CongVan.find({
            $or: [
                { chude: { $in: chuDeNames } },
                { sokihieu: { $regex: keyword, $options: 'i' } },  
                { noidung: { $regex: keyword, $options: 'i' } },  
                { nguoilienquan: { $regex: keyword, $options: 'i' } },  
                
            ]
        })
        .populate('danhmuc', 'ten_DM')  
        .populate('khoa', 'ten_K')
        .select('ngaybanhanh ngayhethieuluc sokihieu noidung nguoilienquan sotrang filecv chude');

        // Nếu không tìm thấy công văn nào phù hợp
        if (congvanList.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy công văn nào với từ khóa này' });
        }

        res.json(congvanList);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm công văn:', error);
        res.status(500).json({ message: error.message });
    }
};
