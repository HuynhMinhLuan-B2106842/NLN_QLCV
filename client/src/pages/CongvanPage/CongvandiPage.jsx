import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Input, Table } from 'antd';

const CongvandiPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Fetch công văn data from API and set the initial data
  useEffect(() => {
    if (location.pathname === '/Congvandi') {
      setBreadcrumb('Công văn đi');
    }
    axios.get('http://localhost:5000/api/congvan')
      .then(response => {
        console.log('Dữ liệu công văn:', response.data); // Log dữ liệu công văn
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
      })
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  }, [location, setBreadcrumb]);

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  // Handle search input
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();

    // Filter công văn data based on search term
    const filtered = users.filter(user =>
      user.sokihieu.toLowerCase().includes(keyword) ||
      user.noidung.toLowerCase().includes(keyword) ||
      user.nguoilienquan.toLowerCase().includes(keyword) ||
      (user.danhmuc && user.danhmuc.ten_DM && user.danhmuc.ten_DM.toLowerCase().includes(keyword)) || // Kiểm tra danh mục
      (user.chude && user.chude.ten_CD && user.chude.ten_CD.toLowerCase().includes(keyword)) // Kiểm tra chủ đề
    );
    
    setFilteredUsers(filtered); // Update filtered users based on search term
  };

  // Configure table columns
  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Danh mục',
      dataIndex: ['danhmuc', 'ten_DM'],
      key: 'danhmuc',
      render: (ten_DM) => ten_DM || 'Không có danh mục', 
    },
    {
      title: 'Chủ đề',
      dataIndex: ['chude', 'ten_CD'],
      key: 'chude',
      render: (ten_CD) => ten_CD || 'Không có chủ đề', 
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngaybanhanh',
      key: 'ngaybanhanh',
      render: (text) => formatDate(text),
    },
    {
      title: 'Ngày hết hiệu lực',
      dataIndex: 'ngayhethieuluc',
      key: 'ngayhethieuluc',
      render: (text) => formatDate(text),
    },
    {
      title: 'Số hiệu',
      dataIndex: 'sokihieu',
      key: 'sokihieu',
    },
    {
      title: 'Nội dung',
      dataIndex: 'noidung',
      key: 'noidung',
    },
    {
      title: 'Người liên quan',
      dataIndex: 'nguoilienquan',
      key: 'nguoilienquan',
    },
    {
      title: 'Số trang',
      dataIndex: 'sotrang',
      key: 'sotrang',
    },

    {
      title: 'Tập tin',
      dataIndex: 'filecv',
      key: 'filecv',
      render: (filecv) => filecv ? (
        <a href={`http://localhost:5000/${filecv}`} target="_blank" rel="noopener noreferrer">
          {/* {filecv.replace('uploads\\', '')} */} Xem
        </a>
      ) : 'Không có',
    },
  ];

  return (
    <div className='container'>
      <Input.Search
        placeholder="Tìm kiếm theo số hiệu, nội dung, người liên quan, danh mục hoặc chủ đề..."
        onSearch={handleSearch}
        enterButton
        size="large"
        className="mb-3"
      />
      <Table
        columns={columns}
        dataSource={filteredUsers.map((user) => ({ ...user, key: user._id }))}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CongvandiPage;
