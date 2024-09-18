import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Input, Table } from 'antd';

const CongvandiPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [setSearchTerm] = useState(''); // Fix: destructure both the state and setter
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (location.pathname === '/Congvandi') {
      setBreadcrumb('Công văn đi');
    }
    axios.get('http://localhost:5000/api/congvan')
      .then(response => {
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
    setSearchTerm(keyword); // Update search term state
    const filtered = users.filter(user => 
      user.sokihieu.toLowerCase().includes(keyword) ||
      user.noidung.toLowerCase().includes(keyword) ||
      user.nguoilienquan.toLowerCase().includes(keyword)
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
          {filecv.replace('uploads\\', '')}
        </a>
      ) : 'Không có',
    },
  ];

  return (
    <div className='container'>
      <Input.Search
        placeholder="Tìm kiếm theo số hiệu, nội dung, hoặc người liên quan..."
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
