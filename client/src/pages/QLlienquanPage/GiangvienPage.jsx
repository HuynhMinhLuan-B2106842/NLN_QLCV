import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const GiangVienPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [lecturers, setLecturers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLecturer, setNewLecturer] = useState({
    ten_GV: '',
    email_GV: '',
    diachi_GV: '',
    sdt_GV: '',
  });

  useEffect(() => {
    if (location.pathname === '/QLgiangvien') {
      setBreadcrumb('Quản lí giảng viên');
    }
    axios.get('http://localhost:5000/api/giangvien')
      .then(response => setLecturers(response.data))
      .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
  }, [location, setBreadcrumb]);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingLecturer({ ...lecturers[index] });
  };

  const handleInputChange = (e, field) => {
    setEditingLecturer({ ...editingLecturer, [field]: e.target.value });
  };

  const handleSaveClick = (index) => {
    axios.put(`http://localhost:5000/api/giangvien/${editingLecturer._id}`, editingLecturer)
      .then(response => {
        setLecturers(prevLecturers =>
          prevLecturers.map(lecturer => lecturer._id === editingLecturer._id ? response.data : lecturer)
        );
        setEditingIndex(-1);
      })
      .catch(err => console.error('Lỗi khi cập nhật:', err));
  };

  const handleCancelClick = () => {
    setEditingIndex(-1);
    setEditingLecturer(null);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
      axios.delete(`http://localhost:5000/api/giangvien/${id}`)
        .then(response => {
          setLecturers(prevLecturers => prevLecturers.filter(lecturer => lecturer._id !== id));
        })
        .catch(err => console.error('Lỗi khi xóa:', err));
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddInputChange = (e, field) => {
    setNewLecturer({ ...newLecturer, [field]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/giangvien', newLecturer)
      .then(response => {
        setLecturers([...lecturers, response.data]);
        setShowAddForm(false);
        setNewLecturer({
          ten_GV: '',
          email_GV: '',
          diachi_GV: '',
          sdt_GV: '',
        });
      })
      .catch(err => console.error('Lỗi khi thêm giảng viên:', err));
  };

  return (
    <div className='container'>
      <div className='d-flex mb-3'>
        <button className="btn btn-primary" onClick={handleAddClick}>Thêm giảng viên</button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mb-3">
          <div className="mb-3">
            <label className="form-label">Tên Giảng Viên</label>
            <input type="text" className="form-control" value={newLecturer.ten_GV} onChange={(e) => handleAddInputChange(e, 'ten_GV')} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={newLecturer.email_GV} onChange={(e) => handleAddInputChange(e, 'email_GV')} />
          </div>
          <div className="mb-3">
            <label className="form-label">Địa chỉ</label>
            <input type="text" className="form-control" value={newLecturer.diachi_GV} onChange={(e) => handleAddInputChange(e, 'diachi_GV')} />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input type="text" className="form-control" value={newLecturer.sdt_GV} onChange={(e) => handleAddInputChange(e, 'sdt_GV')} />
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
            <th>Tên Giảng Viên</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {
            lecturers.map((lecturer, index) => {
              return editingIndex === index ? (
                <tr key={index}>
                  <td><input type="text" className="form-control" value={editingLecturer.ten_GV} onChange={(e) => handleInputChange(e, 'ten_GV')} /></td>
                  <td><input type="text" className="form-control" value={editingLecturer.email_GV} onChange={(e) => handleInputChange(e, 'email_GV')} /></td>
                  <td><input type="text" className="form-control" value={editingLecturer.diachi_GV} onChange={(e) => handleInputChange(e, 'diachi_GV')} /></td>
                  <td><input type="text" className="form-control" value={editingLecturer.sdt_GV} onChange={(e) => handleInputChange(e, 'sdt_GV')} /></td>
                  <td>
                    <button className="btn btn-success" onClick={() => handleSaveClick(index)}>Lưu</button>
                    <button className="btn btn-secondary ms-2" onClick={handleCancelClick}>Hủy</button>
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td>{lecturer.ten_GV}</td>
                  <td>{lecturer.email_GV}</td>
                  <td>{lecturer.diachi_GV}</td>
                  <td>{lecturer.sdt_GV}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEditClick(index)}>Chỉnh sửa</button>
                    <button className="btn btn-danger ms-2" onClick={() => handleDeleteClick(lecturer._id)}>Xóa</button>
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

export default GiangVienPage;
