const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const congvanController = require('../controllers/congvan.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Thêm dấu thời gian trước tên gốc để tránh trùng lặp
    cb(null,file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route tạo mới một công văn
router.post('/', upload.single('filecv'), congvanController.createCongVan);

// Route cập nhật một công văn theo ID
router.put('/:id', upload.single('filecv'), congvanController.updateCongVan);

// Các route khác
router.get('/', congvanController.getAllCongVan);
router.get('/:id', congvanController.getCongVanById);
router.delete('/:id', congvanController.deleteCongVan);
router.get('/thongke/thongke', congvanController.thongkeCongvan);
// Route để tìm kiếm công văn theo từ khóa
//router.get('/search/search', congvanController.searchCongVanByKeyword);
module.exports = router;
// const upload = multer({ dest: 'uploads/' }); // Cấu hình multer

// // Tạo công văn mới
// router.post('/', upload.single('filecv'), congvanController.createCongVan);
// router.put('/:id', upload.single('filecv'), congvanController.updateCongVan);
