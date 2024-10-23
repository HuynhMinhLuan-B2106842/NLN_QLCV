// src/pages/CongvanPage/CongvandenPage.jsx

import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Spin, message } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Định dạng ngày theo kiểu Việt Nam
};

const CongVandenPage = ({ setBreadcrumb }) => {
  const location = useLocation();
    const [congvanList, setCongVanList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    // Hàm để lấy danh sách công văn
    const fetchCongVan = async (searchKeyword = '') => {
        setLoading(true);
        try {
            const keyword = encodeURIComponent(searchKeyword);
            const response = await axios.get('http://localhost:5000/api/congvan/search/search', {
              params: { keyword }, // Gửi từ khóa tìm kiếm
            });

            // Lọc danh sách công văn theo danh mục
            const filteredCongVanList = response.data.filter(congVan => {
                return congVan.danhmuc && congVan.danhmuc.ten_DM === 'Công văn đến';
            });

            setCongVanList(filteredCongVanList);
        } catch (error) {
            message.error('Có lỗi xảy ra khi lấy danh sách công văn');
        } finally {
            setLoading(false);
        }
    };

    // Sử dụng useEffect để gọi hàm fetchCongVan khi component được render
    useEffect(() => {
      if (location.pathname === '/Congvanden') {
        setBreadcrumb('Công văn đến');
      }
      fetchCongVan();
    }, [location, setBreadcrumb]);
    // Hàm để tìm kiếm công văn
    const handleSearch = () => {
        fetchCongVan(keyword);
    };

    // Cấu hình cho table
    const columns = [
        {
            title: 'Loại công văn',
            dataIndex: 'danhmuc',
            render: (text, record) => (record.danhmuc ? record.danhmuc.ten_DM : 'Không có'),
        },
        {
            title: 'Chủ đề',
            dataIndex: 'chude',
            render: text => text.join(', ') || 'Không có',
        },
        {
            title: 'Ngày ban hành',
            dataIndex: 'ngaybanhanh',
            render: (text) => formatDate(text),
        },
        {
            title: 'Ngày hết hiệu lực',
            dataIndex: 'ngayhethieuluc',
            render: (text) => formatDate(text),
        },
        {
            title: 'Số ký hiệu',
            dataIndex: 'sokihieu',
        },
        {
            title: 'Nội dung',
            dataIndex: 'noidung',
        },
        {
            title: 'Người liên quan',
            dataIndex: 'nguoilienquan',
        },
        {
            title: 'Số trang',
            dataIndex: 'sotrang',
        },
        {
            title: 'Tập tin',
            dataIndex: 'filecv',
            render: (text) => (
                text ? (
                    <a href={`http://localhost:5000/${text}`} target="_blank" rel="noopener noreferrer">Xem</a>
                ) : 'Không có'
            ),
        },
    ];

    return (
        <div>
            <h1>Danh sách Công Văn</h1>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Nhập từ khóa"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
            </Space>
            {loading ? (
                <Spin />
            ) : (
                <Table
                    dataSource={congvanList}
                    columns={columns}
                    rowKey="_id" // Sử dụng _id làm khóa cho mỗi hàng
                />
            )}
        </div>
    );
};

export default CongVandenPage;
