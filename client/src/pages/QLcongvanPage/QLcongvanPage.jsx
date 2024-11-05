import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import moment from 'moment';
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  Modal,
  Upload,
  DatePicker,
} from 'antd';

const { Option } = Select;

const QLCongvanPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [chudes, setChudes] = useState([]);
  const [loaicongvans, setLoaiCongvans] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCongVan, setNewCongVan] = useState({
    ngaybanhanh: '',
    ngayhethieuluc: '',
    sokihieu: '',
    noidung: '',
    nguoilienquan: '',
    sotrang: '',
    filecv: null,
    khoa: '',
    chude: [], // Mảng chủ đề
    loaicongvan: '',
  });
  const [newFile, setNewFile] = useState(null);
  const [newChude, setNewChude] = useState(''); // State for the new topic input

  useEffect(() => {
    if (location.pathname === '/QLCongvan') {
      setBreadcrumb('Quản lí công văn');
    }
    fetchUsers();
    fetchDepartments();
    fetchChudes();
    fetchLoaiCongvans();
  }, [location, setBreadcrumb]);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/congvan')
      .then(response => setUsers(response.data))
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  };

  const fetchDepartments = () => {
    axios.get('http://localhost:5000/api/khoa')
      .then(response => setDepartments(response.data))
      .catch(err => console.error('Lỗi khi lấy khoa:', err));
  };
  
  const fetchChudes = () => {
    axios.get('http://localhost:5000/api/chude')
      .then(response => setChudes(response.data))
      .catch(err => console.error('Lỗi khi lấy chủ đề:', err));
  };

  const fetchLoaiCongvans = () => {
    axios.get('http://localhost:5000/api/loaicongvan')
      .then(response => setLoaiCongvans(response.data))
      .catch(err => console.error('Lỗi khi lấy loại công văn:', err));
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingUser({ ...users[index] });
  };

  const handleInputChange = (value, field) => {
    console.log(editingUser)
    setEditingUser({ ...editingUser, [field]: value });
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    Object.keys(editingUser).forEach(key => {
      if (key === 'ngaybanhanh' || key === 'ngayhethieuluc') {
        formData.append(key, JSON.stringify(editingUser[key]));
      } else {
        formData.append(key, editingUser[key]);
      }
    });
      // Thêm chủ đề vào formData
  if (editingUser.chude && editingUser.chude.length > 0) {
    editingUser.chude.forEach(chude => {
      formData.append('chude[]', chude); // Đảm bảo gửi chủ đề dưới dạng mảng
    });
  }
    if (newFile) {
      formData.append('filecv', newFile);
    }

    axios.put(`http://localhost:5000/api/congvan/${editingUser._id}`, formData)
      .then(response => {
        fetchUsers();
        setEditingIndex(-1);
        setEditingUser(null);
        setNewFile(null);
      })
      .catch(err => console.error('Lỗi khi cập nhật:', err));
  };

  const handleCancelClick = () => {
    setEditingIndex(-1);
    setEditingUser(null);
    setNewFile(null);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công văn này?')) {
      axios.delete(`http://localhost:5000/api/congvan/${id}`)
        .then(response => {
          fetchUsers();
        })
        .catch(err => console.error('Lỗi khi xóa:', err));
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddInputChange = (value, field) => {
    setNewCongVan({ ...newCongVan, [field]: value });
  };

  const handleAddFileChange = (file) => {
    setNewFile(file);
    setNewCongVan({ ...newCongVan, filecv: file });
    return false;
  };

  const handleAddChude = (e) => {
    if (e.key === 'Enter' && newChude.trim()) {
      // Add the new topic to the chude array
      setNewCongVan(prev => ({
        ...prev,
        chude: [...prev.chude, newChude.trim()]
      }));
      setNewChude(''); // Clear the input
    }
  };

  const handleAddSubmit = (values) => {
    const formData = new FormData();
    Object.keys(newCongVan).forEach(key => {
      formData.append(key, newCongVan[key]);
    });

    axios.post('http://localhost:5000/api/congvan', formData)
      .then(response => {
        fetchUsers();
        setShowAddForm(false);
        setNewCongVan({
          ngaybanhanh: '',
          ngayhethieuluc: '',
          sokihieu: '',
          noidung: '',
          nguoilienquan: '',
          sotrang: '',
          filecv: null,
          khoa: '',
          chude: [], // Reset mảng chủ đề
          loaicongvan: '',
        });
        setNewFile(null);
      })
      .catch(err => console.error('Lỗi khi thêm công văn:', err));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
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
      render: (text, record) => record.chude ? record.chude.map(cd => cd.ten_CD).join(', ') : 'Không có', // Hiển thị nhiều chủ đề
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
      title: 'Người liên quan',
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
      title: 'Hành động',
      render: (text, record, index) => (
        <div>
          <Button type="primary" onClick={() => handleEditClick(index)}>Chỉnh sửa</Button>
          <Button danger onClick={() => handleDeleteClick(record._id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <Button type="primary" onClick={handleAddClick} className="mb-3">Thêm công văn</Button>
      <Modal
        title="Thêm công văn"
        open={showAddForm}
        footer={null}
        onCancel={() => setShowAddForm(false)}
      >
        <Form onFinish={handleAddSubmit}>
          <Form.Item label="Nơi liên quan" name="khoa" required>
            <Select
              placeholder="Chọn nơi liên quan"
              onChange={(value) => handleAddInputChange(value, 'khoa')}
              required
            >
              {departments.map(department => (
                <Option key={department._id} value={department._id}>{department.ten_K}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Loại công văn" name="loaicongvan" required>
            <Select
              placeholder="Chọn loại công văn"
              onChange={(value) => handleAddInputChange(value, 'loaicongvan')}
              required
            >
              {loaicongvans.map(loai => (
                <Option key={loai._id} value={loai._id}>{loai.ten_LCV}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Chủ đề" required>
            <Select
              mode="tags" // Cho phép nhập chủ đề mới
              value={newCongVan.chude} // Sử dụng trạng thái của chủ đề
              onChange={(value) => handleAddInputChange(value, 'chude')} // Cập nhật khi có thay đổi
              placeholder="Nhập chủ đề và chọn hoặc nhấn Enter"
              tokenSeparators={[',']} // Cho phép tách chủ đề bằng dấu phẩy
            >
              {chudes.map((topic) => (
                <Option key={topic._id} value={topic.ten_CD}>{topic.ten_CD}</Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item label="Số hiệu" name="sokihieu" required>
            <Input onChange={(e) => handleAddInputChange(e.target.value, 'sokihieu')} required />
          </Form.Item>

          <Form.Item label="Nội dung" name="noidung" required>
            <Input.TextArea onChange={(e) => handleAddInputChange(e.target.value, 'noidung')} required />
          </Form.Item>

          <Form.Item label="Người liên quan" name="nguoilienquan" required>
            <Input onChange={(e) => handleAddInputChange(e.target.value, 'nguoilienquan')} required />
          </Form.Item>

          <Form.Item label="Số trang" name="sotrang" required>
            <Input type="number" onChange={(e) => handleAddInputChange(e.target.value, 'sotrang')} required />
          </Form.Item>

          <Form.Item label="Ngày ban hành" name="ngaybanhanh" required>
            <DatePicker onChange={(date) => handleAddInputChange(date, 'ngaybanhanh')} required />
          </Form.Item>

          <Form.Item label="Ngày hết hiệu lực" name="ngayhethieuluc" required>
            <DatePicker onChange={(date) => handleAddInputChange(date, 'ngayhethieuluc')} required />
          </Form.Item>

          <Form.Item label="Tập tin" name="filecv">
            <Upload beforeUpload={handleAddFileChange} showUploadList={false}>
              <Button>Chọn tập tin</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Thêm</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table dataSource={users} columns={columns} rowKey="_id" />
      
      <Modal
        title="Chỉnh sửa công văn"
        open={editingIndex !== -1}
        footer={null}
        onCancel={handleCancelClick}
      >
        <Form>
          <Form.Item label="Nơi liên quan" required>
            <Select
              value={editingUser?.khoa?._id}
              onChange={(value) => handleInputChange(value, 'khoa')}
              required
            >
              {departments.map(deparment => (
                <Option key={deparment._id} value={deparment._id}>{deparment.ten_K}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="loại công văn" required>
            <Select
              value={editingUser?.loaicongvan?._id}
              onChange={(value) => handleInputChange(value, 'loaicongvan')}
              required
            >
              {loaicongvans.map(loaicongvan => (
                <Option key={loaicongvan._id} value={loaicongvan._id}>{loaicongvan.ten_LCV}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Chủ đề" required>
            <Select
              mode="tags" // Cho phép nhập chủ đề mới
              value={editingUser?.chude?._id} // Sử dụng trạng thái của chủ đề
              onChange={(value) => handleInputChange(value, 'chude')} // Cập nhật khi có thay đổi
              placeholder="Nhập chủ đề và chọn hoặc nhấn Enter"
              tokenSeparators={[',']} // Cho phép tách chủ đề bằng dấu phẩy
            >
              {chudes.map((topic) => (
                <Option key={topic._id} value={topic.ten_CD}>{topic.ten_CD}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ngày ban hành" required>
            <DatePicker
              value={editingUser?.ngaybanhanh ? moment(editingUser.ngaybanhanh) : null}
              onChange={(date, dateString) => handleInputChange(dateString, 'ngaybanhanh')}
              required
            />
          </Form.Item>
          <Form.Item label="Ngày hết hiệu lực" required>
            <DatePicker
              value={editingUser?.ngayhethieuluc ? moment(editingUser.ngayhethieuluc) : null}
              onChange={(date, dateString) => handleInputChange(dateString, 'ngayhethieuluc')}
              required
            />
          </Form.Item>
          <Form.Item label="Số hiệu" required>
            <Input value={editingUser?.sokihieu} onChange={(e) => handleInputChange(e.target.value, 'sokihieu')} />
          </Form.Item>
          <Form.Item label="Nội dung" required>
            <Input.TextArea value={editingUser?.noidung} onChange={(e) => handleInputChange(e.target.value, 'noidung')} />
          </Form.Item>
          <Form.Item label="Người liên quan" required>
            <Input value={editingUser?.nguoilienquan} onChange={(e) => handleInputChange(e.target.value, 'nguoilienquan')} />
          </Form.Item>
          <Form.Item label="Số trang" required>
            <Input value={editingUser?.sotrang} onChange={(e) => handleInputChange(e.target.value, 'sotrang')} />
          </Form.Item>
          <Form.Item label="Tập tin">
            <Upload beforeUpload={handleAddFileChange} showUploadList={false}>
              <Button>Chọn tập tin</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSaveClick}>Lưu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QLCongvanPage;
