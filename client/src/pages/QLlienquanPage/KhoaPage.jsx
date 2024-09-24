import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const KhoaPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [departments, setDepartments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    ten_K: '',
    truong_K: '',
    sdt_K: '',
  });

  useEffect(() => {
    if (location.pathname === '/QLkhoa') {
      setBreadcrumb('Quản lí khoa');
    }
    axios.get('http://localhost:5000/api/khoa')
      .then(response => setDepartments(response.data))
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  }, [location, setBreadcrumb]);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingDepartment({ ...departments[index] });
  };

  const handleInputChange = (e, field) => {
    setEditingDepartment({ ...editingDepartment, [field]: e.target.value });
  };

  const handleSaveClick = (index) => {
    axios.put(`http://localhost:5000/api/khoa/${editingDepartment._id}`, editingDepartment)
      .then(response => {
        setDepartments(prevDepartments => 
          prevDepartments.map(department => department._id === editingDepartment._id ? response.data : department)
        );
        setEditingIndex(-1);
      })
      .catch(err => console.error('Lỗi khi cập nhật:', err));
  };

  const handleCancelClick = () => {
    setEditingIndex(-1);
    setEditingDepartment(null);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoa này?')) {
      axios.delete(`http://localhost:5000/api/khoa/${id}`)
        .then(response => {
          setDepartments(prevDepartments => prevDepartments.filter(department => department._id !== id));
        })
        .catch(err => console.error('Lỗi khi xóa:', err));
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddInputChange = (e, field) => {
    setNewDepartment({ ...newDepartment, [field]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/khoa', newDepartment)
      .then(response => {
        setDepartments([...departments, response.data]);
        setShowAddForm(false);
        setNewDepartment({
          ten_K: '',
          truong_K: '',
          sdt_K: '',
        });
      })
      .catch(err => console.error('Lỗi khi thêm khoa:', err));
  };

  return (
    <div className='container'>
      <div className='d-flex mb-3'>
        <button className="btn btn-primary" onClick={handleAddClick}>Thêm khoa</button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mb-3">
          <div className="mb-3">
            <label className="form-label">Tên Khoa</label>
            <input type="text" className="form-control" value={newDepartment.ten_K} onChange={(e) => handleAddInputChange(e, 'ten_K')} />
          </div>
          <div className="mb-3">
            <label className="form-label">Trưởng Khoa</label>
            <input type="text" className="form-control" value={newDepartment.truong_K} onChange={(e) => handleAddInputChange(e, 'truong_K')} />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input type="text" className="form-control" value={newDepartment.sdt_K} onChange={(e) => handleAddInputChange(e, 'sdt_K')} />
          </div>
          <div className="d-flex">
            <button type="submit" className="btn btn-success">Thêm</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowAddForm(false)}>Hủy</button>
          </div>
        </form>
      )}
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Tên Khoa</th>
            <th>Trưởng Khoa</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {
            departments.map((department, index) => {
              return editingIndex === index ? (
                <tr key={index}>
                  <td><input type="text" className="form-control" value={editingDepartment.ten_K} onChange={(e) => handleInputChange(e, 'ten_K')} /></td>
                  <td><input type="text" className="form-control" value={editingDepartment.truong_K} onChange={(e) => handleInputChange(e, 'truong_K')} /></td>
                  <td><input type="text" className="form-control" value={editingDepartment.sdt_K} onChange={(e) => handleInputChange(e, 'sdt_K')} /></td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleSaveClick(index)}>Lưu</button>
                    <button className="btn btn-secondary ms-2" onClick={handleCancelClick}>Hủy</button>
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{department.ten_K}</td>
                  <td>{department.truong_K}</td>
                  <td>{department.sdt_K}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEditClick(index)}>Chỉnh sửa</button>
                    <button className="btn btn-danger ms-2" onClick={() => handleDeleteClick(department._id)}>Xóa</button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default KhoaPage;
