import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

const QLCongvandiPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [topics, setTopics] = useState([]);
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
    danhmuc: '', // Thêm trường danh mục
    chude: ''
  });
  const [newFile, setNewFile] = useState(null);
  
  // Function để lấy danh sách công văn
  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/congvan')
      .then(response => setUsers(response.data))
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  };

  // Function để lấy danh sách danh mục
  const fetchCategories = () => {
    axios.get('http://localhost:5000/api/danhmuc')
      .then(response => setCategories(response.data))
      .catch(err => console.error('Lỗi khi lấy danh mục:', err));
  };
  const fetchTopics = () => {
    axios.get('http://localhost:5000/api/chude')
      .then(response => setTopics(response.data))
      .catch(err => console.error('Lỗi khi lấy chủ đề:', err));
  };

  useEffect(() => {
    if (location.pathname === '/QLCongvandi') {
      setBreadcrumb('Quản lí công văn đi');
    }

    // Lấy dữ liệu ban đầu
    fetchUsers();
    fetchCategories();
    fetchTopics();
  }, [location, setBreadcrumb]);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingUser({ ...users[index] });
  };

  const handleInputChange = (e, field) => {
    setEditingUser({ ...editingUser, [field]: e.target.value });
    console.log(`Chủ đề đã cập nhật: ${e.target.value}`);
  };

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleSaveClick = (index) => {
    const formData = new FormData();
    Object.keys(editingUser).forEach(key => {
      formData.append(key, editingUser[key]);
    });
    if (newFile) {
      formData.append('filecv', newFile);
    }
    console.log('Dữ liệu gửi đi:', editingUser);
    axios.put(`http://localhost:5000/api/congvan/${editingUser._id}`, formData)
      .then(response => {
        console.log('Cập nhật thành công!', response.data);
        fetchUsers();  // Sau khi cập nhật, lấy lại danh sách công văn
        setEditingIndex(-1);
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
          console.log('Xóa thành công!', response.data);
          fetchUsers();  // Sau khi xóa, lấy lại danh sách công văn
        })
        .catch(err => console.error('Lỗi khi xóa:', err));
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddInputChange = (e, field) => {
    setNewCongVan({ ...newCongVan, [field]: e.target.value });
  };

  const handleAddFileChange = (e) => {
    setNewCongVan({ ...newCongVan, filecv: e.target.files[0] });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newCongVan).forEach(key => {
      formData.append(key, newCongVan[key]);
    });

    axios.post('http://localhost:5000/api/congvan', formData)
      .then(response => {
        console.log('Thêm công văn thành công!', response.data);
        fetchUsers();  // Sau khi thêm, lấy lại danh sách công văn
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
          chude: ''
        });
      })
      .catch(err => console.error('Lỗi khi thêm công văn:', err));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className='w-200 vh-200 d-flex justify-content-center align-items-center'>
      <div className='w-100'>
        <button className="btn btn-primary mb-3" onClick={handleAddClick}>Thêm công văn</button>
        {showAddForm && (
          <form onSubmit={handleAddSubmit}>
            <div className="mb-3">
              <label className="form-label">Danh mục</label>
              <select 
                className="form-select" 
                value={newCongVan.danhmuc} 
                onChange={(e) => handleAddInputChange(e, 'danhmuc')}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.ten_DM}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Chủ đề</label>
              <select 
                className="form-select" 
                value={newCongVan.chude} 
                onChange={(e) => handleAddInputChange(e, 'chude')}
                required
              >
                <option value="">Chọn chủ đề</option>
                {topics.map(topic => (
                  <option key={topic._id} value={topic._id}>{topic.ten_CD}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Ngày ban hành</label>
              <input type="date" className="form-control" value={newCongVan.ngaybanhanh} onChange={(e) => handleAddInputChange(e, 'ngaybanhanh')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Ngày hết hiệu lực</label>
              <input type="date" className="form-control" value={newCongVan.ngayhethieuluc} onChange={(e) => handleAddInputChange(e, 'ngayhethieuluc')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Số hiệu</label>
              <input type="text" className="form-control" value={newCongVan.sokihieu} onChange={(e) => handleAddInputChange(e, 'sokihieu')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Nội dung</label>
              <input type="text" className="form-control" value={newCongVan.noidung} onChange={(e) => handleAddInputChange(e, 'noidung')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Người liên quan</label>
              <input type="text" className="form-control" value={newCongVan.nguoilienquan} onChange={(e) => handleAddInputChange(e, 'nguoilienquan')} />
            </div>
            <div className="mb-3">
              <label className="form-label">Số trang</label>
              <input type="number" className="form-control" value={newCongVan.sotrang} onChange={(e) => handleAddInputChange(e, 'sotrang')} />
            </div>

            <div className="mb-3">
              <label className="form-label">Tập tin</label>
              <input type="file" className="form-control" onChange={handleAddFileChange} />
            </div>
            <button type="submit" className="btn btn-success">Thêm</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowAddForm(false)}>Hủy</button>
          </form>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Danh mục</th>
              <th>Chủ đề</th>
              <th>Ngày ban hành</th>
              <th>Ngày hết hiệu lực</th>
              <th>Số hiệu</th>
              <th>Nội dung</th>
              <th>Người liên quan</th>
              <th>Số trang</th>
              <th>Tập tin</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return editingIndex === index ? (
                <tr key={index}>
                  <td>
                    <select 
                      className="form-select" 
                      value={editingUser.danhmuc} 
                      onChange={(e) => handleInputChange(e, 'danhmuc')}
                      required
                    >
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>{category.ten_DM}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select 
                      className="form-select" 
                      value={editingUser.chude} 
                      onChange={(e) => handleInputChange(e, 'chude')}
                      required
                    >
                      {topics.map(topic => (
                        <option key={topic._id} value={topic._id}>{topic.ten_CD}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="text" value={editingUser.ngaybanhanh} onChange={(e) => handleInputChange(e, 'ngaybanhanh')} /></td>
                  <td><input type="text" value={editingUser.ngayhethieuluc} onChange={(e) => handleInputChange(e, 'ngayhethieuluc')} /></td>
                  <td><input type="text" value={editingUser.sokihieu} onChange={(e) => handleInputChange(e, 'sokihieu')} /></td>
                  <td><input type="text" value={editingUser.noidung} onChange={(e) => handleInputChange(e, 'noidung')} /></td>
                  <td><input type="text" value={editingUser.nguoilienquan} onChange={(e) => handleInputChange(e, 'nguoilienquan')} /></td>
                  <td><input type="text" value={editingUser.sotrang} onChange={(e) => handleInputChange(e, 'sotrang')} /></td>

                  <td><input type="file" onChange={handleFileChange} /></td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleSaveClick(index)}>Lưu</button>
                    <button className="btn btn-secondary" onClick={handleCancelClick}>Hủy</button>
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{user.danhmuc ? user.danhmuc.ten_DM : 'Không có'}</td>
                  <td>{user.chude ? user.chude.ten_CD : 'Không có'}</td>
                  <td>{formatDate(user.ngaybanhanh)}</td>
                  <td>{formatDate(user.ngayhethieuluc)}</td>
                  <td>{user.sokihieu}</td>
                  <td>{user.noidung}</td>
                  <td>{user.nguoilienquan}</td>
                  <td>{user.sotrang}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.filecv ? (
                      <a href={`http://localhost:5000/${user.filecv}`} target="_blank" rel="noopener noreferrer">
                        {/* {user.filecv.replace('uploads\\', '')} */} Xem 
                      </a>
                    ) : 'Không có'}
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEditClick(index)}>Chỉnh sửa</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteClick(user._id)}>Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QLCongvandiPage;
