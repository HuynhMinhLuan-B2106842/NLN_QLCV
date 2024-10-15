import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, Input } from 'antd';

const { Search } = Input;

const CongvannoiboPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/congvan')
      .then(response => {
        const filteredData = response.data.filter(user => user.danhmuc && user.danhmuc.ten_DM === 'Công văn nội bộ');
        setUsers(filteredData);
        setFilteredUsers(filteredData); // Khởi tạo danh sách người dùng đã lọc
      })
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  };

  useEffect(() => {
    if (location.pathname === '/Congvannoibo') {
      setBreadcrumb('Công văn nội bộ');
    }
    fetchUsers();
  }, [location, setBreadcrumb]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const handleSearch = (value) => {
    const filtered = users.filter(user =>
      user.sokihieu.includes(value) || // Tìm kiếm theo số hiệu
      user.noidung.includes(value) || // Tìm kiếm theo nội dung
      user.nguoilienquan.includes(value) || // Tìm kiếm theo người liên quan
      (user.danhmuc && user.danhmuc.ten_DM.includes(value)) || // Tìm kiếm theo danh mục
      user.chude.includes(value) // Tìm kiếm theo chủ đề
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Danh mục',
      dataIndex: 'danhmuc',
      render: (text, record) => (record.danhmuc ? record.danhmuc.ten_DM : 'Không có'),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'chude',
      render: (text) => text || 'Không có',
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
      title: 'Số hiệu',
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
    <div className='container'>
      <Search
        placeholder="Tìm kiếm công văn"
        onSearch={handleSearch}
        style={{ marginBottom: '16px', width: 300 }}
      />
      <Table dataSource={filteredUsers} columns={columns} rowKey="_id" />
    </div>
  );
};

export default CongvannoiboPage;
