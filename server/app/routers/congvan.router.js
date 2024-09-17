const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const congvanController = require('../controllers/congvan.controller');

// Thiết lập multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Đường dẫn lưu tệp
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên tệp
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
router.use('/uploads', express.static('uploads'));
module.exports = router;
