const express = require('express');
const router = express.Router();
const nguoiKyDuyetController = require('../controllers/nguoikyduyet.controller');

// Tạo mới người ký duyệt
router.post('/', nguoiKyDuyetController.createNguoiKyDuyet);

// Lấy tất cả người ký duyệt
router.get('/', nguoiKyDuyetController.getAllNguoiKyDuyet);

// Lấy một người ký duyệt theo ID
router.get('/:id', nguoiKyDuyetController.getNguoiKyDuyetById);

// Cập nhật một người ký duyệt theo ID
router.put('/:id', nguoiKyDuyetController.updateNguoiKyDuyet);

// Xóa một người ký duyệt
router.delete('/:id', nguoiKyDuyetController.deleteNguoiKyDuyet);

module.exports = router;
