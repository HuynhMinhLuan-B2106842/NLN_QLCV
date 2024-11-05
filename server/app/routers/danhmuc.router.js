const express = require('express');
const router = express.Router();
const danhmucController = require('../controllers/danhmuc.controller');

// Tạo một danh mục mới
router.post('/', danhmucController.createDanhMuc);

// Lấy tất cả danh mục
router.get('/', danhmucController.getAllDanhMuc);

// Lấy một danh mục theo ID
router.get('/:id', danhmucController.getDanhMucById);

// Cập nhật danh mục theo ID
router.put('/:id', danhmucController.updateDanhMuc);

// Xóa danh mục theo ID
router.delete('/:id', danhmucController.deleteDanhMuc);

module.exports = router;
