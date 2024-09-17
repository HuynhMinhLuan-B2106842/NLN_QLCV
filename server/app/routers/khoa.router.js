const express = require('express');
const router = express.Router();
const khoaController = require('../controllers/khoa.controller');

// Route tạo mới một khoa
router.post('/', khoaController.createKhoa);

// Route lấy tất cả khoa
router.get('/', khoaController.getAllKhoa);

// Route lấy một khoa theo ID
router.get('/:id', khoaController.getKhoaById);

// Route cập nhật một khoa theo ID
router.put('/:id', khoaController.updateKhoa);

// Route xóa một khoa theo ID
router.delete('/:id', khoaController.deleteKhoa);

module.exports = router;
