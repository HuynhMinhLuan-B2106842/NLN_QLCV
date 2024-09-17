const express = require('express');
const router = express.Router();
const chudeController = require('../controllers/chude.controller');

// Route tạo mới một chủ đề
router.post('/', chudeController.createChude);

// Route lấy tất cả chủ đề
router.get('/', chudeController.getAllChude);

// Route lấy một chủ đề theo ID
router.get('/:id', chudeController.getChudeById);

// Route cập nhật một chủ đề theo ID
router.put('/:id', chudeController.updateChude);

// Route xóa một chủ đề theo ID
router.delete('/:id', chudeController.deleteChude);

module.exports = router;
