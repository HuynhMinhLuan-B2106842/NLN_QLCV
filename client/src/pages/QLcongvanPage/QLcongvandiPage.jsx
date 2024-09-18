import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns'; // Import hàm format từ date-fns
import 'bootstrap/dist/css/bootstrap.min.css';

const CongvandiPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
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
  });
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    if (location.pathname === '/Congvandi') {
      setBreadcrumb('Công văn đi');
    }
    axios.get('http://localhost:5000/api/congvan')
      .then(response => setUsers(response.data))
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  }, [location, setBreadcrumb]);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingUser({ ...users[index] });
  };

  const handleInputChange = (e, field) => {
    setEditingUser({ ...editingUser, [field]: e.target.value });
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

    axios.put(`http://localhost:5000/api/congvan/${editingUser._id}`, formData)
      .then(response => {
        console.log('Cập nhật thành công!', response.data);
        setUsers(prevUsers => 
          prevUsers.map(user => user._id === editingUser._id ? response.data : user)
        );
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
          setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
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
        setUsers([...users, response.data]);
        setShowAddForm(false);
        setNewCongVan({
          ngaybanhanh: '',
          ngayhethieuluc: '',
          sokihieu: '',
          noidung: '',
          nguoilienquan: '',
          sotrang: '',
          filecv: null,
        });
      })
      .catch(err => console.error('Lỗi khi thêm công văn:', err));
  };

  // Hàm định dạng ngày
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
        <table className="table table-bordered" style={{ border: '2px solid black' }}>
          <thead>
            <tr>
              <th>Ngày ban hành</th>
              <th>Ngày hết hiệu lực</th>
              <th>Số hiệu</th>
              <th>Nội dung</th>
              <th>Người liên quan</th>
              <th>Số trang</th>
              <th style={{ maxWidth: '200px' }}>Tập tin</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user, index) => {
                return editingIndex === index ? (
                  <tr key={index}>
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
                    <td>{formatDate(user.ngaybanhanh)}</td>
                    <td>{formatDate(user.ngayhethieuluc)}</td>
                    <td>{user.sokihieu}</td>
                    <td>{user.noidung}</td>
                    <td>{user.nguoilienquan}</td>
                    <td>{user.sotrang}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.filecv ? (
                        <a href={`http://localhost:5000/${user.filecv}`} target="_blank" rel="noopener noreferrer">
                          {user.filecv.replace('uploads\\', '')}
                        </a>
                      ) : 'Không có'}
                    </td>
                    <td>
                      <button className="btn btn-primary" onClick={() => handleEditClick(index)}>Chỉnh sửa</button>
                      <button className="btn btn-danger" onClick={() => handleDeleteClick(user._id)}>Xóa</button>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CongvandiPage;
