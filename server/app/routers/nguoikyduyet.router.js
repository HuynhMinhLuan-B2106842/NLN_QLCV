const express = require('express');
const router = express.Router();
const danhmucController = require('../controllers/nguoikyduyet.controller');

// Route tạo mới một danh mục
router.post('/', danhmucController.createDanhMuc);

// Route lấy tất cả danh mục
router.get('/', danhmucController.getAllDanhMuc);

// Route lấy một danh mục theo ID
router.get('/:id', danhmucController.getDanhMucById);

// Route cập nhật một danh mục theo ID
router.put('/:id', danhmucController.updateDanhMuc);

// Route xóa một danh mục theo ID
router.delete('/:id', danhmucController.deleteDanhMuc);

module.exports = router;
