const express = require('express');
const router = express.Router();
const giangvienController = require('../controllers/giangvien.controller');

// Route tạo mới một giảng viên
router.post('/', giangvienController.createGiangVien);

// Route lấy tất cả giảng viên
router.get('/', giangvienController.getAllGiangVien);

// Route lấy một giảng viên theo ID
router.get('/:id', giangvienController.getGiangVienById);

// Route cập nhật một giảng viên theo ID
router.put('/:id', giangvienController.updateGiangVien);

// Route xóa một giảng viên theo ID
router.delete('/:id', giangvienController.deleteGiangVien);

module.exports = router;
