const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Định nghĩa tệp tĩnh cho thư mục "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

// Routes
const CongVanRouter = require('./app/routers/congvan.router');
const chudeRouter = require('./app/routers/chude.router');
const danhmucRouter = require('./app/routers/danhmuc.router');
const loaicongvanRouter = require('./app/routers/loaicongvan.router');
const nguoikyduyetRouter = require('./app/routers/nguoikyduyet.router');
const giangvienRouter = require('./app/routers/giangvien.router');
const khoaRouter = require('./app/routers/khoa.router');

app.get("/", (req, res) => {
    res.json({message: "Welcome to my Cong Van."});
});

app.use("/api/congvan", CongVanRouter);
app.use("/api/chude", chudeRouter);
app.use("/api/danhmuc", danhmucRouter);
app.use("/api/loaicongvan", loaicongvanRouter);
app.use("/api/nguoikyduyet", nguoikyduyetRouter);
app.use("/api/giangvien", giangvienRouter);
app.use("/api/khoa", khoaRouter);

module.exports = app;
