import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
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
import moment from 'moment';

const { Option } = Select;

const QLCongvanPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deparments, setdeparments] = useState([]);
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
    danhmuc: '',
    chude: [],
    khoa: '',
  });
  const [newFile, setNewFile] = useState(null);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [editingAvailableTopics, setEditingAvailableTopics] = useState([]);

  useEffect(() => {
    if (location.pathname === '/QLCongvan') {
      setBreadcrumb('Quản lí công văn');
    }
    fetchUsers();
    fetchCategories();
    fetchdeparments();
  }, [location, setBreadcrumb]);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/congvan')
      .then(response => setUsers(response.data))
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:5000/api/danhmuc')
      .then(response => setCategories(response.data))
      .catch(err => console.error('Lỗi khi lấy danh mục:', err));
  };
  const fetchdeparments = () => {
    axios.get('http://localhost:5000/api/khoa')
      .then(response => setdeparments(response.data))
      .catch(err => console.error('Lỗi khi lấy khoa:', err));
  };
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingUser({ ...users[index] });

    const selectedCategory = categories.find(category => category._id === users[index].danhmuc._id);
    // Trích xuất tên chủ đề
    setEditingAvailableTopics(selectedCategory ? selectedCategory.chuDe.map(topic => topic.ten) : []);
  };

  const handleInputChange = (value, field) => {
    setEditingUser({ ...editingUser, [field]: value });

    if (field === 'danhmuc') {
      const selectedCategory = categories.find(category => category._id === value);
      // Trích xuất tên chủ đề
      setEditingAvailableTopics(selectedCategory ? selectedCategory.chuDe.map(topic => topic.ten) : []);
      setEditingUser(prevState => ({ ...prevState, chude: [] })); // Reset chude
    }
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    // Chuyển đổi các trường thành chuỗi (nếu cần)
    Object.keys(editingUser).forEach(key => {
      if (key === 'chude' || key === 'ngaybanhanh' || key === 'ngayhethieuluc') {
        formData.append(key, JSON.stringify(editingUser[key]));
      } else {
        formData.append(key, editingUser[key]);
      }
    });
    if (newFile) {
      formData.append('filecv', newFile);
    }

    axios.put(`http://localhost:5000/api/congvan/${editingUser._id}`, formData)
      .then(response => {
        fetchUsers();
        setEditingIndex(-1);
        setEditingUser(null);
        setNewFile(null);
        setEditingAvailableTopics([]);
      })
      .catch(err => console.error('Lỗi khi cập nhật:', err));
  };

  const handleCancelClick = () => {
    setEditingIndex(-1);
    setEditingUser(null);
    setNewFile(null);
    setEditingAvailableTopics([]);
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
    setAvailableTopics([]);
  };

  const handleAddInputChange = (value, field) => {
    setNewCongVan({ ...newCongVan, [field]: value });

    if (field === 'danhmuc') {
      const selectedCategory = categories.find(category => category._id === value);
      // Trích xuất tên chủ đề
      setAvailableTopics(selectedCategory ? selectedCategory.chuDe.map(topic => topic.ten) : []);
      setNewCongVan(prevState => ({ ...prevState, chude: [] })); // Reset chude
    }
  };

  const handleAddFileChange = (file) => {
    setNewFile(file);
    setNewCongVan({ ...newCongVan, filecv: file });
    return false; // để tránh upload tự động
  };

  const handleAddSubmit = (values) => {
    console.log('Submitting new Cong Van:', newCongVan);
    const formData = new FormData();
    // Chuyển đổi các trường thành chuỗi (nếu cần)
    Object.keys(newCongVan).forEach(key => {
      if (key === 'chude') {
        formData.append(key, JSON.stringify(newCongVan[key]));
      } else {
        formData.append(key, newCongVan[key]);
      }
    });

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

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
          danhmuc: '',
          chude: [],
          khoa: '',
        });
        setAvailableTopics([]);
        setNewFile(null); // Reset file
      })
      .catch(err => console.error('Lỗi khi thêm công văn:', err));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const columns = [
    {
      title: 'Loại công văn',
      dataIndex: 'danhmuc',
      render: (text, record) => record.danhmuc ? record.danhmuc.ten_DM : 'Không có',
    },
    {
      title: 'Chủ đề',
      dataIndex: 'chude',
      render: text => text.join(', ') || 'Không có',
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
          <Form.Item label="Loại công văn" name="danhmuc" required>
            <Select
              placeholder="Chọn loại công văn"
              onChange={(value) => handleAddInputChange(value, 'danhmuc')}
              required
            >
              {categories.map(category => (
                <Option key={category._id} value={category._id}>{category.ten_DM}</Option>
              ))}
            </Select>
          </Form.Item>
          {availableTopics.length > 0 && (
            <Form.Item label="Chủ đề" name="chude" required>
              <Select
                mode="multiple"
                placeholder="Chọn chủ đề"
                value={newCongVan.chude}
                onChange={(value) => handleAddInputChange(value, 'chude')}
                required
              >
                {availableTopics.map((topicName, index) => (
                  <Option key={index} value={topicName}>{topicName}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
            <Form.Item label="Nơi liên quan" name="khoa" required>
            <Select
              placeholder="Chọn nơi liên quan"
              onChange={(value) => handleAddInputChange(value, 'khoa')}
              required
            >
              {deparments.map(deparment => (
                <Option key={deparment._id} value={deparment._id}>{deparment.ten_K}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ngày ban hành" name="ngaybanhanh" required>
            <DatePicker onChange={(date, dateString) => handleAddInputChange(dateString, 'ngaybanhanh')} />
          </Form.Item>
          <Form.Item label="Ngày hết hiệu lực" name="ngayhethieuluc" required>
            <DatePicker onChange={(date, dateString) => handleAddInputChange(dateString, 'ngayhethieuluc')} />
          </Form.Item>
          <Form.Item label="Số hiệu" name="sokihieu" required>
            <Input onChange={(e) => handleAddInputChange(e.target.value, 'sokihieu')} />
          </Form.Item>
          <Form.Item label="Nội dung" name="noidung" required>
            <Input.TextArea onChange={(e) => handleAddInputChange(e.target.value, 'noidung')} />
          </Form.Item>
          <Form.Item label="Người liên quan" name="nguoilienquan" required>
            <Input onChange={(e) => handleAddInputChange(e.target.value, 'nguoilienquan')} />
          </Form.Item>
          <Form.Item label="Số trang" name="sotrang" required>
            <Input onChange={(e) => handleAddInputChange(e.target.value, 'sotrang')} />
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
      <Table
        columns={columns}
        dataSource={users}
        pagination={false}
        rowKey="_id"
      />
      <Modal
        title="Chỉnh sửa công văn"
        open={editingIndex !== -1}
        footer={null}
        onCancel={handleCancelClick}
      >
        <Form>
          <Form.Item label="Loại công văn" required>
            <Select
              value={editingUser?.danhmuc?._id}
              onChange={(value) => handleInputChange(value, 'danhmuc')}
              required
            >
              {categories.map(category => (
                <Option key={category._id} value={category._id}>{category.ten_DM}</Option>
              ))}
            </Select>
          </Form.Item>
          {editingAvailableTopics.length > 0 && (
            <Form.Item label="Chủ đề" required>
              <Select
                mode="multiple"
                value={editingUser?.chude}
                onChange={(value) => handleInputChange(value, 'chude')}
                required
              >
                {editingAvailableTopics.map((topicName, index) => (
                  <Option key={index} value={topicName}>{topicName}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item label="Nơi liên quan" required>
            <Select
              value={editingUser?.khoa?._id}
              onChange={(value) => handleInputChange(value, 'khoa')}
              required
            >
              {deparments.map(deparment => (
                <Option key={deparment._id} value={deparment._id}>{deparment.ten_K}</Option>
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
