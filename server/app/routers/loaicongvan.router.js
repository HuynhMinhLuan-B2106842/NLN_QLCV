const express = require('express');
const router = express.Router();
const loaicongvanController = require('../controllers/loaicongvan.controller');

// Route tạo mới một loại công văn
router.post('/', loaicongvanController.createLoaiCongVan);

// Route lấy tất cả loại công văn
router.get('/', loaicongvanController.getAllLoaiCongVan);

// Route lấy một loại công văn theo ID
router.get('/:id', loaicongvanController.getLoaiCongVanById);

// Route cập nhật một loại công văn theo ID
router.put('/:id', loaicongvanController.updateLoaiCongVan);

// Route xóa một loại công văn theo ID
router.delete('/:id', loaicongvanController.deleteLoaiCongVan);

module.exports = router;
