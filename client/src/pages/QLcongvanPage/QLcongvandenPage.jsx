// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { format } from 'date-fns';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const QLCongvandiPage = ({ setBreadcrumb }) => {
//   const location = useLocation();
//   const [users, setUsers] = useState([]);
//   const [categories, setCategories] = useState([]); 
//   const [topics, setTopics] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(-1);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newCongVan, setNewCongVan] = useState({
//     ngaybanhanh: '',
//     ngayhethieuluc: '',
//     sokihieu: '',
//     noidung: '',
//     nguoilienquan: '',
//     sotrang: '',
//     filecv: null,
//     danhmuc: '', // Thêm trường danh mục
//     chude: ''
//   });
//   const [newFile, setNewFile] = useState(null);
  
//   // Function để lấy danh sách công văn
//   const fetchUsers = () => {
//     axios.get('http://localhost:5000/api/congvan')
//       .then(response => setUsers(response.data))
//       .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
//   };

//   // Function để lấy danh sách danh mục
//   const fetchCategories = () => {
//     axios.get('http://localhost:5000/api/danhmuc')
//       .then(response => setCategories(response.data))
//       .catch(err => console.error('Lỗi khi lấy danh mục:', err));
//   };
//   const fetchTopics = () => {
//     axios.get('http://localhost:5000/api/chude')
//       .then(response => setTopics(response.data))
//       .catch(err => console.error('Lỗi khi lấy chủ đề:', err));
//   };

//   useEffect(() => {
//     if (location.pathname === '/QLCongvandi') {
//       setBreadcrumb('Quản lí công văn đi');
//     }

//     // Lấy dữ liệu ban đầu
//     fetchUsers();
//     fetchCategories();
//     fetchTopics();
//   }, [location, setBreadcrumb]);

//   const handleEditClick = (index) => {
//     setEditingIndex(index);
//     setEditingUser({ ...users[index] });
//   };

//   const handleInputChange = (e, field) => {
//     setEditingUser({ ...editingUser, [field]: e.target.value });
//     console.log(`Chủ đề đã cập nhật: ${e.target.value}`);
//   };

//   const handleFileChange = (e) => {
//     setNewFile(e.target.files[0]);
//   };

//   const handleSaveClick = (index) => {
//     const formData = new FormData();
//     Object.keys(editingUser).forEach(key => {
//       formData.append(key, editingUser[key]);
//     });
//     if (newFile) {
//       formData.append('filecv', newFile);
//     }
//     console.log('Dữ liệu gửi đi:', editingUser);
//     axios.put(`http://localhost:5000/api/congvan/${editingUser._id}`, formData)
//       .then(response => {
//         console.log('Cập nhật thành công!', response.data);
//         fetchUsers();  // Sau khi cập nhật, lấy lại danh sách công văn
//         setEditingIndex(-1);
//         setNewFile(null);
//       })
//       .catch(err => console.error('Lỗi khi cập nhật:', err));
//   };

//   const handleCancelClick = () => {
//     setEditingIndex(-1);
//     setEditingUser(null);
//     setNewFile(null);
//   };

//   const handleDeleteClick = (id) => {
//     if (window.confirm('Bạn có chắc chắn muốn xóa công văn này?')) {
//       axios.delete(`http://localhost:5000/api/congvan/${id}`)
//         .then(response => {
//           console.log('Xóa thành công!', response.data);
//           fetchUsers();  // Sau khi xóa, lấy lại danh sách công văn
//         })
//         .catch(err => console.error('Lỗi khi xóa:', err));
//     }
//   };

//   const handleAddClick = () => {
//     setShowAddForm(true);
//   };

//   const handleAddInputChange = (e, field) => {
//     setNewCongVan({ ...newCongVan, [field]: e.target.value });
//   };

//   const handleAddFileChange = (e) => {
//     setNewCongVan({ ...newCongVan, filecv: e.target.files[0] });
//   };

//   const handleAddSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(newCongVan).forEach(key => {
//       formData.append(key, newCongVan[key]);
//     });

//     axios.post('http://localhost:5000/api/congvan', formData)
//       .then(response => {
//         console.log('Thêm công văn thành công!', response.data);
//         fetchUsers();  // Sau khi thêm, lấy lại danh sách công văn
//         setShowAddForm(false);
//         setNewCongVan({
//           ngaybanhanh: '',
//           ngayhethieuluc: '',
//           sokihieu: '',
//           noidung: '',
//           nguoilienquan: '',
//           sotrang: '',
//           filecv: null,
//           danhmuc: '',
//           chude: ''
//         });
//       })
//       .catch(err => console.error('Lỗi khi thêm công văn:', err));
//   };

//   const formatDate = (dateString) => {
//     return format(new Date(dateString), 'dd/MM/yyyy');
//   };

//   return (
//     <div className='w-200 vh-200 d-flex justify-content-center align-items-center'>
//       <div className='w-100'>
//         <button className="btn btn-primary mb-3" onClick={handleAddClick}>Thêm công văn</button>
//         {showAddForm && (
//           <form onSubmit={handleAddSubmit}>
//             <div className="mb-3">
//               <label className="form-label">Danh mục</label>
//               <select 
//                 className="form-select" 
//                 value={newCongVan.danhmuc} 
//                 onChange={(e) => handleAddInputChange(e, 'danhmuc')}
//                 required
//               >
//                 <option value="">Chọn danh mục</option>
//                 {categories.map(category => (
//                   <option key={category._id} value={category._id}>{category.ten_DM}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Chủ đề</label>
//               <select 
//                 className="form-select" 
//                 value={newCongVan.chude} 
//                 onChange={(e) => handleAddInputChange(e, 'chude')}
//                 required
//               >
//                 <option value="">Chọn chủ đề</option>
//                 {topics.map(topic => (
//                   <option key={topic._id} value={topic._id}>{topic.ten_CD}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Ngày ban hành</label>
//               <input type="date" className="form-control" value={newCongVan.ngaybanhanh} onChange={(e) => handleAddInputChange(e, 'ngaybanhanh')} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Ngày hết hiệu lực</label>
//               <input type="date" className="form-control" value={newCongVan.ngayhethieuluc} onChange={(e) => handleAddInputChange(e, 'ngayhethieuluc')} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Số hiệu</label>
//               <input type="text" className="form-control" value={newCongVan.sokihieu} onChange={(e) => handleAddInputChange(e, 'sokihieu')} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Nội dung</label>
//               <input type="text" className="form-control" value={newCongVan.noidung} onChange={(e) => handleAddInputChange(e, 'noidung')} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Người liên quan</label>
//               <input type="text" className="form-control" value={newCongVan.nguoilienquan} onChange={(e) => handleAddInputChange(e, 'nguoilienquan')} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Số trang</label>
//               <input type="number" className="form-control" value={newCongVan.sotrang} onChange={(e) => handleAddInputChange(e, 'sotrang')} />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Tập tin</label>
//               <input type="file" className="form-control" onChange={handleAddFileChange} />
//             </div>
//             <button type="submit" className="btn btn-success">Thêm</button>
//             <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowAddForm(false)}>Hủy</button>
//           </form>
//         )}
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Danh mục</th>
//               <th>Chủ đề</th>
//               <th>Ngày ban hành</th>
//               <th>Ngày hết hiệu lực</th>
//               <th>Số hiệu</th>
//               <th>Nội dung</th>
//               <th>Người liên quan</th>
//               <th>Số trang</th>
//               <th>Tập tin</th>
//               <th>Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => {
//               return editingIndex === index ? (
//                 <tr key={index}>
//                   <td>
//                     <select 
//                       className="form-select" 
//                       value={editingUser.danhmuc} 
//                       onChange={(e) => handleInputChange(e, 'danhmuc')}
//                       required
//                     >
//                       {categories.map(category => (
//                         <option key={category._id} value={category._id}>{category.ten_DM}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td>
//                     <select 
//                       className="form-select" 
//                       value={editingUser.chude} 
//                       onChange={(e) => handleInputChange(e, 'chude')}
//                       required
//                     >
//                       {topics.map(topic => (
//                         <option key={topic._id} value={topic._id}>{topic.ten_CD}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td><input type="text" value={editingUser.ngaybanhanh} onChange={(e) => handleInputChange(e, 'ngaybanhanh')} /></td>
//                   <td><input type="text" value={editingUser.ngayhethieuluc} onChange={(e) => handleInputChange(e, 'ngayhethieuluc')} /></td>
//                   <td><input type="text" value={editingUser.sokihieu} onChange={(e) => handleInputChange(e, 'sokihieu')} /></td>
//                   <td><input type="text" value={editingUser.noidung} onChange={(e) => handleInputChange(e, 'noidung')} /></td>
//                   <td><input type="text" value={editingUser.nguoilienquan} onChange={(e) => handleInputChange(e, 'nguoilienquan')} /></td>
//                   <td><input type="text" value={editingUser.sotrang} onChange={(e) => handleInputChange(e, 'sotrang')} /></td>

//                   <td><input type="file" onChange={handleFileChange} /></td>
//                   <td>
//                     <button className="btn btn-success" onClick={() => handleSaveClick(index)}>Lưu</button>
//                     <button className="btn btn-secondary" onClick={handleCancelClick}>Hủy</button>
//                   </td>
//                 </tr>
//               ) : (
//                 <tr key={index}>
//                   <td>{user.danhmuc ? user.danhmuc.ten_DM : 'Không có'}</td>
//                   <td>{user.chude ? user.chude.ten_CD : 'Không có'}</td>
//                   <td>{formatDate(user.ngaybanhanh)}</td>
//                   <td>{formatDate(user.ngayhethieuluc)}</td>
//                   <td>{user.sokihieu}</td>
//                   <td>{user.noidung}</td>
//                   <td>{user.nguoilienquan}</td>
//                   <td>{user.sotrang}</td>
//                   <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                     {user.filecv ? (
//                       <a href={`http://localhost:5000/${user.filecv}`} target="_blank" rel="noopener noreferrer">
//                         {/* {user.filecv.replace('uploads\\', '')} */} Xem 
//                       </a>
//                     ) : 'Không có'}
//                   </td>
//                   <td>
//                     <button className="btn btn-primary" onClick={() => handleEditClick(index)}>Chỉnh sửa</button>
//                     <button className="btn btn-danger" onClick={() => handleDeleteClick(user._id)}>Xóa</button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default QLCongvandiPage;
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { format } from 'date-fns';
// import { Table, Button, Form, Select, Input, DatePicker, Upload, Modal } from 'antd';
// import moment from 'moment';


// const { Option } = Select;

// const QLCongvandiPage = ({ setBreadcrumb }) => {
//   const location = useLocation();
//   const [users, setUsers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(-1);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newCongVan, setNewCongVan] = useState({
//     ngaybanhanh: '',
//     ngayhethieuluc: '',
//     sokihieu: '',
//     noidung: '',
//     nguoilienquan: '',
//     sotrang: '',
//     filecv: null,
//     danhmuc: '',
//     chude: ''
//   });
//   const [newFile, setNewFile] = useState(null);
//   const [availableTopics, setAvailableTopics] = useState([]);
//   const [editingAvailableTopics, setEditingAvailableTopics] = useState([]);

//   const fetchUsers = () => {
//     axios.get('http://localhost:5000/api/congvan')
//       .then(response => setUsers(response.data))
//       .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
//   };

//   const fetchCategories = () => {
//     axios.get('http://localhost:5000/api/danhmuc')
//       .then(response => setCategories(response.data))
//       .catch(err => console.error('Lỗi khi lấy danh mục:', err));
//   };

//   useEffect(() => {
//     if (location.pathname === '/QLCongvandi') {
//       setBreadcrumb('Quản lí công văn đi');
//     }
//     fetchUsers();
//     fetchCategories();
//   }, [location, setBreadcrumb]);

//   const handleEditClick = (index) => {
//     setEditingIndex(index);
//     setEditingUser({ ...users[index] });
//     const selectedCategory = categories.find(category => category._id === users[index].danhmuc._id);
//     setEditingAvailableTopics(selectedCategory ? selectedCategory.chuDe : []);
//   };

//   const handleInputChange = (value, field) => {
//     setEditingUser({ ...editingUser, [field]: value });
//     if (field === 'danhmuc') {
//       const selectedCategory = categories.find(category => category._id === value);
//       setEditingAvailableTopics(selectedCategory ? selectedCategory.chuDe : []);
//       setEditingUser(prevState => ({ ...prevState, chude: '' }));
//     }
//   };

//   const handleFileChange = (info) => {
//     setNewFile(info.file.originFileObj);
//   };

//   const handleSaveClick = () => {
//     const formData = new FormData();
//     Object.keys(editingUser).forEach(key => {
//       formData.append(key, editingUser[key]);
//     });
//     if (newFile) {
//       formData.append('filecv', newFile);
//     }

//     axios.put(`http://localhost:5000/api/congvan/${editingUser._id}`, formData)
//       .then(response => {
//         fetchUsers();
//         setEditingIndex(-1);
//         setEditingUser(null);
//         setNewFile(null);
//         setEditingAvailableTopics([]);
//       })
//       .catch(err => console.error('Lỗi khi cập nhật:', err));
//   };

//   const handleCancelClick = () => {
//     setEditingIndex(-1);
//     setEditingUser(null);
//     setNewFile(null);
//     setEditingAvailableTopics([]);
//   };

//   const handleDeleteClick = (id) => {
//     if (window.confirm('Bạn có chắc chắn muốn xóa công văn này?')) {
//       axios.delete(`http://localhost:5000/api/congvan/${id}`)
//         .then(response => {
//           fetchUsers();
//         })
//         .catch(err => console.error('Lỗi khi xóa:', err));
//     }
//   };

//   const handleAddClick = () => {
//     setShowAddForm(true);
//     setAvailableTopics([]);
//   };

//   const handleAddInputChange = (value, field) => {
//     setNewCongVan({ ...newCongVan, [field]: value });
//     if (field === 'danhmuc') {
//       const selectedCategory = categories.find(category => category._id === value);
//       setAvailableTopics(selectedCategory ? selectedCategory.chuDe : []);
//       setNewCongVan(prevState => ({ ...prevState, chude: '' }));
//     }
//   };

//   const handleAddFileChange = (info) => {
//     setNewCongVan({ ...newCongVan, filecv: info.file.originFileObj });
//   };

//   const handleAddSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(newCongVan).forEach(key => {
//       formData.append(key, newCongVan[key]);
//     });

//     axios.post('http://localhost:5000/api/congvan', formData)
//       .then(response => {
//         fetchUsers();
//         setShowAddForm(false);
//         setNewCongVan({
//           ngaybanhanh: '',
//           ngayhethieuluc: '',
//           sokihieu: '',
//           noidung: '',
//           nguoilienquan: '',
//           sotrang: '',
//           filecv: null,
//           danhmuc: '',
//           chude: ''
//         });
//         setAvailableTopics([]);
//       })
//       .catch(err => console.error('Lỗi khi thêm công văn:', err));
//   };

//   const formatDate = (dateString) => {
//     return format(new Date(dateString), 'dd/MM/yyyy');
//   };

//   const columns = [
//     {
//       title: 'Danh mục',
//       dataIndex: 'danhmuc',
//       render: (text, record) => (record.danhmuc ? record.danhmuc.ten_DM : 'Không có'),
//     },
//     {
//       title: 'Chủ đề',
//       dataIndex: 'chude',
//       render: (text) => text || 'Không có',
//     },
//     {
//       title: 'Ngày ban hành',
//       dataIndex: 'ngaybanhanh',
//       render: (text) => formatDate(text),
//     },
//     {
//       title: 'Ngày hết hiệu lực',
//       dataIndex: 'ngayhethieuluc',
//       render: (text) => formatDate(text),
//     },
//     {
//       title: 'Số hiệu',
//       dataIndex: 'sokihieu',
//     },
//     {
//       title: 'Nội dung',
//       dataIndex: 'noidung',
//     },
//     {
//       title: 'Người liên quan',
//       dataIndex: 'nguoilienquan',
//     },
//     {
//       title: 'Số trang',
//       dataIndex: 'sotrang',
//     },
//     {
//       title: 'Tập tin',
//       dataIndex: 'filecv',
//       render: (text, record) => (
//         text ? (
//           <a href={`http://localhost:5000/${text}`} target="_blank" rel="noopener noreferrer">Xem</a>
//         ) : 'Không có'
//       ),
//     },
//     {
//       title: 'Hành động',
//       render: (_, record, index) => (
//         <>
//           <Button type="primary" onClick={() => handleEditClick(index)}>Chỉnh sửa</Button>
//           <Button type="danger" onClick={() => handleDeleteClick(record._id)}>Xóa</Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className='container'>
//       <Button type="primary" onClick={handleAddClick} style={{ marginBottom: '16px' }}>Thêm công văn</Button>
//       {showAddForm && (
//         <Form layout="vertical" onFinish={handleAddSubmit} style={{ marginBottom: '16px' }}>
//           <Form.Item label="Danh mục" required>
//             <Select
//               value={newCongVan.danhmuc}
//               onChange={(value) => handleAddInputChange(value, 'danhmuc')}
//               placeholder="Chọn danh mục"
//             >
//               {categories.map(category => (
//                 <Option key={category._id} value={category._id}>{category.ten_DM}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           {availableTopics.length > 0 && (
//             <Form.Item label="Chủ đề" required>
//               <Select
//                 value={newCongVan.chude}
//                 onChange={(value) => handleAddInputChange(value, 'chude')}
//                 placeholder="Chọn chủ đề"
//               >
//                 {availableTopics.map((topic, index) => (
//                   <Option key={index} value={topic}>{topic}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           )}
//           <Form.Item label="Ngày ban hành" required>
//             <DatePicker
//               value={newCongVan.ngaybanhanh ? moment(newCongVan.ngaybanhanh) : null}
//               onChange={(date) => handleAddInputChange(date.format('YYYY-MM-DD'), 'ngaybanhanh')}
//               style={{ width: '100%' }}
//             />
//           </Form.Item>
//           <Form.Item label="Ngày hết hiệu lực" required>
//             <DatePicker
//               value={newCongVan.ngayhethieuluc ? moment(newCongVan.ngayhethieuluc) : null}
//               onChange={(date) => handleAddInputChange(date.format('YYYY-MM-DD'), 'ngayhethieuluc')}
//               style={{ width: '100%' }}
//             />
//           </Form.Item>
//           <Form.Item label="Số hiệu" required>
//             <Input
//               value={newCongVan.sokihieu}
//               onChange={(e) => handleAddInputChange(e.target.value, 'sokihieu')}
//             />
//           </Form.Item>
//           <Form.Item label="Nội dung">
//             <Input.TextArea
//               value={newCongVan.noidung}
//               onChange={(e) => handleAddInputChange(e.target.value, 'noidung')}
//             />
//           </Form.Item>
//           <Form.Item label="Người liên quan">
//             <Input
//               value={newCongVan.nguoilienquan}
//               onChange={(e) => handleAddInputChange(e.target.value, 'nguoilienquan')}
//             />
//           </Form.Item>
//           <Form.Item label="Số trang">
//             <Input
//               value={newCongVan.sotrang}
//               onChange={(e) => handleAddInputChange(e.target.value, 'sotrang')}
//             />
//           </Form.Item>
//           <Form.Item label="Tập tin">
//             <Upload
//               beforeUpload={() => false}
//               onChange={handleAddFileChange}
//             >
//               <Button>Chọn tập tin</Button>
//             </Upload>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">Thêm</Button>
//             <Button onClick={() => setShowAddForm(false)} style={{ marginLeft: '8px' }}>Hủy</Button>
//           </Form.Item>
//         </Form>
//       )}
//       <Table dataSource={users} columns={columns} rowKey="_id" />
//       {editingIndex > -1 && (
//         <Modal
//           title="Chỉnh sửa công văn"
//           visible={editingIndex > -1}
//           onOk={handleSaveClick}
//           onCancel={handleCancelClick}
//         >
//           <Form layout="vertical">
//             <Form.Item label="Danh mục" required>
//               <Select
//                 value={editingUser.danhmuc}
//                 onChange={(value) => handleInputChange(value, 'danhmuc')}
//                 placeholder="Chọn danh mục"
//               >
//                 {categories.map(category => (
//                   <Option key={category._id} value={category._id}>{category.ten_DM}</Option>
//                 ))}
//               </Select>
//             </Form.Item>
//             {editingAvailableTopics.length > 0 && (
//               <Form.Item label="Chủ đề" required>
//                 <Select
//                   value={editingUser.chude}
//                   onChange={(value) => handleInputChange(value, 'chude')}
//                   placeholder="Chọn chủ đề"
//                 >
//                   {editingAvailableTopics.map((topic, index) => (
//                     <Option key={index} value={topic}>{topic}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             )}
//             <Form.Item label="Ngày ban hành" required>
//               <DatePicker
//                 value={editingUser.ngaybanhanh ? moment(editingUser.ngaybanhanh) : null}
//                 onChange={(date) => handleInputChange(date.format('YYYY-MM-DD'), 'ngaybanhanh')}
//                 style={{ width: '100%' }}
//               />
//             </Form.Item>
//             <Form.Item label="Ngày hết hiệu lực" required>
//               <DatePicker
//                 value={editingUser.ngayhethieuluc ? moment(editingUser.ngayhethieuluc) : null}
//                 onChange={(date) => handleInputChange(date.format('YYYY-MM-DD'), 'ngayhethieuluc')}
//                 style={{ width: '100%' }}
//               />
//             </Form.Item>
//             <Form.Item label="Số hiệu" required>
//               <Input
//                 value={editingUser.sokihieu}
//                 onChange={(e) => handleInputChange(e.target.value, 'sokihieu')}
//               />
//             </Form.Item>
//             <Form.Item label="Nội dung">
//               <Input.TextArea
//                 value={editingUser.noidung}
//                 onChange={(e) => handleInputChange(e.target.value, 'noidung')}
//               />
//             </Form.Item>
//             <Form.Item label="Người liên quan">
//               <Input
//                 value={editingUser.nguoilienquan}
//                 onChange={(e) => handleInputChange(e.target.value, 'nguoilienquan')}
//               />
//             </Form.Item>
//             <Form.Item label="Số trang">
//               <Input
//                 value={editingUser.sotrang}
//                 onChange={(e) => handleInputChange(e.target.value, 'sotrang')}
//               />
//             </Form.Item>
//             <Form.Item label="Tập tin">
//               <Upload
//                 beforeUpload={() => false}
//                 onChange={handleFileChange}
//               >
//                 <Button>Chọn tập tin</Button>
//               </Upload>
//             </Form.Item>
//           </Form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default QLCongvandiPage;
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

const QLCongvandiPage = ({ setBreadcrumb }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
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
    chude: '',
    loaicongvan: '',
  });
  const [newFile, setNewFile] = useState(null);

  const [availableTopics, setAvailableTopics] = useState([]);
  const [editingAvailableTopics, setEditingAvailableTopics] = useState([]);

  useEffect(() => {
    if (location.pathname === '/QLCongvandi') {
      setBreadcrumb('Quản lí công văn đi');
    }
    fetchUsers();
    fetchCategories();
    fetchTypes();
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

  const fetchTypes = () => {
    axios.get('http://localhost:5000/api/loaicongvan')
      .then(response => setTypes(response.data))
      .catch(err => console.error('Lỗi khi lấy loại công văn:', err));
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingUser({ ...users[index] });

    const selectedCategory = categories.find(category => category._id === users[index].danhmuc._id);
    setEditingAvailableTopics(selectedCategory ? selectedCategory.chuDe : []);
  };

  const handleInputChange = (value, field) => {
    setEditingUser({ ...editingUser, [field]: value });

    if (field === 'danhmuc') {
      const selectedCategory = categories.find(category => category._id === value);
      setEditingAvailableTopics(selectedCategory ? selectedCategory.chuDe : []);
      setEditingUser(prevState => ({ ...prevState, chude: '' }));
    }
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    Object.keys(editingUser).forEach(key => {
      formData.append(key, editingUser[key]);
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
      setAvailableTopics(selectedCategory ? selectedCategory.chuDe : []);
      setNewCongVan(prevState => ({ ...prevState, chude: '' }));
    }
  };

  const handleAddFileChange = (file) => {
    setNewCongVan({ ...newCongVan, filecv: file });
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
          danhmuc: '',
          chude: '',
          loaicongvan: '',
        });
        setAvailableTopics([]);
      })
      .catch(err => console.error('Lỗi khi thêm công văn:', err));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const columns = [
    {
      title: 'Danh mục',
      dataIndex: 'danhmuc',
      render: (text, record) => record.danhmuc ? record.danhmuc.ten_DM : 'Không có',
    },
    {
      title: 'Chủ đề',
      dataIndex: 'chude',
      render: text => text || 'Không có',
    },
    {
      title: 'Loại công văn',
      dataIndex: 'loaicongvan',
      render: (text, record) => record.loaicongvan ? record.loaicongvan.ten_LCV : 'Không có',
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
        visible={showAddForm}
        footer={null}
        onCancel={() => setShowAddForm(false)}
      >
        <Form onFinish={handleAddSubmit}>
          <Form.Item label="Danh mục" name="danhmuc" required>
            <Select
              placeholder="Chọn danh mục"
              onChange={(value) => handleAddInputChange(value, 'danhmuc')}
              required
            >
              {categories.map(category => (
                <Option key={category._id} value={category._id}>{category.ten_DM}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Chủ đề" name="chude" required>
            <Select
              placeholder="Chọn chủ đề"
              onChange={(value) => handleAddInputChange(value, 'chude')}
              required
            >
              {availableTopics.map(topic => (
                <Option key={topic} value={topic}>{topic}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Loại công văn" name="loaicongvan" required>
            <Select
              placeholder="Chọn loại công văn"
              onChange={(value) => handleAddInputChange(value, 'loaicongvan')}
              required
            >
              {types.map(type => (
                <Option key={type._id} value={type._id}>{type.ten_LCV}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ngày ban hành" name="ngaybanhanh" required>
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(date, dateString) => handleAddInputChange(dateString, 'ngaybanhanh')}
              required
            />
          </Form.Item>
          <Form.Item label="Ngày hết hiệu lực" name="ngayhethieuluc">
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(date, dateString) => handleAddInputChange(dateString, 'ngayhethieuluc')}
            />
          </Form.Item>
          <Form.Item label="Số hiệu" name="sokihieu" required>
            <Input
              placeholder="Nhập số hiệu"
              onChange={(e) => handleAddInputChange(e.target.value, 'sokihieu')}
              required
            />
          </Form.Item>
          <Form.Item label="Nội dung" name="noidung" required>
            <Input.TextArea
              placeholder="Nhập nội dung"
              onChange={(e) => handleAddInputChange(e.target.value, 'noidung')}
              required
            />
          </Form.Item>
          <Form.Item label="Người liên quan" name="nguoilienquan" required>
            <Input
              placeholder="Nhập người liên quan"
              onChange={(e) => handleAddInputChange(e.target.value, 'nguoilienquan')}
              required
            />
          </Form.Item>
          <Form.Item label="Số trang" name="sotrang">
            <Input
              placeholder="Nhập số trang"
              onChange={(e) => handleAddInputChange(e.target.value, 'sotrang')}
            />
          </Form.Item>
          <Form.Item label="Tập tin">
            <Upload beforeUpload={handleAddFileChange} showUploadList={false}>
              <Button>Chọn tập tin</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
      />
      <Modal
        title="Chỉnh sửa công văn"
        visible={editingIndex >= 0}
        onCancel={handleCancelClick}
        footer={null}
      >
        {editingUser && (
          <Form onFinish={handleSaveClick}>
            <Form.Item label="Danh mục" name="danhmuc" required>
              <Select
                value={editingUser.danhmuc?._id}
                onChange={(value) => handleInputChange(value, 'danhmuc')}
                required
              >
                {categories.map(category => (
                  <Option key={category._id} value={category._id}>{category.ten_DM}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Chủ đề" name="chude" required>
              <Select
                value={editingUser.chude}
                onChange={(value) => handleInputChange(value, 'chude')}
                required
              >
                {editingAvailableTopics.map(topic => (
                  <Option key={topic} value={topic}>{topic}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Loại công văn" name="loaicongvan" required>
              <Select
                value={editingUser.loaicongvan?._id}
                onChange={(value) => handleInputChange(value, 'loaicongvan')}
                required
              >
                {types.map(type => (
                  <Option key={type._id} value={type._id}>{type.ten_LCV}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Ngày ban hành" name="ngaybanhanh" required>
              <DatePicker
                format="DD/MM/YYYY"
                value={moment(editingUser.ngaybanhanh)}
                onChange={(date, dateString) => handleInputChange(dateString, 'ngaybanhanh')}
                required
              />
            </Form.Item>
            <Form.Item label="Ngày hết hiệu lực" name="ngayhethieuluc">
              <DatePicker
                format="DD/MM/YYYY"
                value={moment(editingUser.ngayhethieuluc)}
                onChange={(date, dateString) => handleInputChange(dateString, 'ngayhethieuluc')}
              />
            </Form.Item>
            <Form.Item label="Số hiệu" name="sokihieu" required>
              <Input
                value={editingUser.sokihieu}
                onChange={(e) => handleInputChange(e.target.value, 'sokihieu')}
                required
              />
            </Form.Item>
            <Form.Item label="Nội dung" name="noidung" required>
              <Input.TextArea
                value={editingUser.noidung}
                onChange={(e) => handleInputChange(e.target.value, 'noidung')}
                required
              />
            </Form.Item>
            <Form.Item label="Người liên quan" name="nguoilienquan" required>
              <Input
                value={editingUser.nguoilienquan}
                onChange={(e) => handleInputChange(e.target.value, 'nguoilienquan')}
                required
              />
            </Form.Item>
            <Form.Item label="Số trang" name="sotrang">
              <Input
                value={editingUser.sotrang}
                onChange={(e) => handleInputChange(e.target.value, 'sotrang')}
              />
            </Form.Item>
            <Form.Item label="Tập tin">
              <Upload beforeUpload={handleAddFileChange} showUploadList={false}>
                <Button>Chọn tập tin</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default QLCongvandiPage;
