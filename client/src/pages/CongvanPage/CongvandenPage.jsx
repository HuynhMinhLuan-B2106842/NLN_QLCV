import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Table, Input, Modal, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import './Congvan.css';
 
const CongvandenPage = ({ setBreadcrumb }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCongVan, setSelectedCongVan] = useState(null);

  useEffect(() => {
    setBreadcrumb && setBreadcrumb('Công văn đến');
    fetchUsers();
  }, [setBreadcrumb]);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/congvan')
      .then(response => {
        const filteredData = response.data.filter(cv => cv.loaicongvan && cv.loaicongvan.ten_LCV === "Công văn đến");
        setUsers(filteredData);
        setFilteredUsers(filteredData);
      })
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredData = users.filter((cv) => {
      const matchLoaiCongVan = cv.loaicongvan?.ten_LCV.toLowerCase().includes(value);
      const matchSoKiHieu = cv.sokihieu?.toLowerCase().includes(value);
      const matchNoiDung = cv.noidung?.toLowerCase().includes(value);
      const matchNguoiLienQuan = cv.nguoilienquan?.toLowerCase().includes(value);
      const matchKhoa = cv.khoa?.ten_K.toLowerCase().includes(value);
      const matchChuDe = cv.chude?.some(cd => cd.ten_CD.toLowerCase().includes(value));

      return (
        matchLoaiCongVan ||
        matchSoKiHieu ||
        matchNoiDung ||
        matchNguoiLienQuan ||
        matchKhoa ||
        matchChuDe
      );
    });
    setFilteredUsers(filteredData);
  };

  const handleViewDetails = (congVan) => {
    setSelectedCongVan(congVan);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCongVan(null);
  };

  const columns = [
    {
      title: 'Loại công văn',
      dataIndex: 'loaicongvan',
      render: (text, record) => record.loaicongvan ? record.loaicongvan.ten_LCV : 'Không có',
    },
    {
      title: 'Chủ đề',
      dataIndex: 'chude',
      render: (text, record) => record.chude ? (
        <div>
          {record.chude.map((cd, index) => (
            <p key={index} style={{ margin: 0 }}>{cd.ten_CD}</p>
          ))}
        </div>
      ) : 'Không có',
    },
    
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngaybanhanh',
      render: text => formatDate(text),
    },
    {
      title: 'Ngày hết hiệu lực',
      dataIndex: 'ngayhethieuluc',
      render: text => formatDate(text),
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
      title: 'Người ký',
      dataIndex: 'nguoilienquan',
    },
    {
      title: 'Nơi liên quan',
      dataIndex: 'khoa',
      render: (text, record) => record.khoa ? record.khoa.ten_K : 'Không có',
    },
    {
      title: 'Số trang',
      dataIndex: 'sotrang',
    },
    {
      title: 'Tập tin',
      dataIndex: 'filecv',
      render: (text) => text ? (
        <a href={`http://localhost:5000/${text}`} target="_blank" rel="noopener noreferrer">Xem</a>
      ) : 'Không có',
    },
    {
      title: 'Thao tác',
      render: (text, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleViewDetails(record)}>
                Xem chi tiết
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <MoreOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="container">
      <Input
        placeholder="Tìm kiếm công văn..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table dataSource={filteredUsers} columns={columns} rowKey="_id" />

      <Modal
        title="Chi tiết công văn"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedCongVan && (
          <div>
            <p><strong>Loại công văn:</strong> {selectedCongVan.loaicongvan?.ten_LCV || 'Không có'}</p>
            <p><strong>Chủ đề:</strong> {selectedCongVan.chude ? selectedCongVan.chude.map(cd => cd.ten_CD).join(', ') : 'Không có'}</p>
            <p><strong>Ngày ban hành:</strong> {formatDate(selectedCongVan.ngaybanhanh)}</p>
            <p><strong>Ngày hết hiệu lực:</strong> {formatDate(selectedCongVan.ngayhethieuluc)}</p>
            <p><strong>Số hiệu:</strong> {selectedCongVan.sokihieu}</p>
            <p><strong>Nội dung:</strong> {selectedCongVan.noidung}</p>
            <p><strong>Người ký:</strong> {selectedCongVan.nguoilienquan}</p>
            <p><strong>Nơi liên quan:</strong> {selectedCongVan.khoa?.ten_K || 'Không có'}</p>
            <p><strong>Số trang:</strong> {selectedCongVan.sotrang}</p>
            <p><strong>Tập tin:</strong> {selectedCongVan.filecv ? (
              <a href={`http://localhost:5000/${selectedCongVan.filecv}`} target="_blank" rel="noopener noreferrer">
                {selectedCongVan.filecv.replace(/^uploads[\\/]/, '')}
              </a>
            ) : 'Không có'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CongvandenPage;
