import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Input, Button } from 'antd';
import { useLocation } from 'react-router-dom';

const QLDanhMucPage = ({ setBreadcrumb }) => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState(''); // Giữ phần thêm danh mục riêng biệt
    const [newTopics, setNewTopics] = useState('');
    const [editingCategory, setEditingCategory] = useState(null); // Lưu danh mục đang chỉnh sửa
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategoryName, setEditingCategoryName] = useState(''); // Dùng riêng cho modal
    const [editingTopics, setEditingTopics] = useState(''); // Dùng riêng cho modal

    const fetchCategories = () => {
        axios.get('http://localhost:5000/api/danhmuc')
            .then(response => setCategories(response.data))
            .catch(err => console.error('Lỗi khi lấy danh mục:', err));
    };

    useEffect(() => {
        if (location.pathname === '/QLdanhmuc') {
            setBreadcrumb('Quản lí danh mục');
          }
        fetchCategories();
    }, [location, setBreadcrumb]);

    const handleAddCategory = () => {
        if (!newCategory) return;

        const topicsArray = newTopics ? newTopics.split(',').map(topic => topic.trim()) : [];

        axios.post('http://localhost:5000/api/danhmuc', { 
            ten_DM: newCategory, 
            chuDe: topicsArray 
        })
            .then(response => {
                setCategories([...categories, response.data]);
                setNewCategory(''); // Xóa dữ liệu sau khi thêm
                setNewTopics('');
            })
            .catch(err => console.error('Lỗi khi thêm danh mục:', err));
    };

    const showEditModal = (category) => {
        setEditingCategory(category); // Thiết lập danh mục đang chỉnh sửa
        setEditingCategoryName(category.ten_DM); // Gán tên danh mục vào modal
        setEditingTopics(category.chuDe.join(', ')); // Gán chủ đề vào modal
        setIsModalVisible(true);
    };

    const handleUpdateCategory = () => {
        if (!editingCategory || !editingCategoryName) return;

        const topicsArray = editingTopics ? editingTopics.split(',').map(topic => topic.trim()) : [];

        axios.put(`http://localhost:5000/api/danhmuc/${editingCategory._id}`, { 
            ten_DM: editingCategoryName,
            chuDe: topicsArray
        })
            .then(response => {
                setCategories(categories.map(cat => (cat._id === editingCategory._id ? response.data : cat)));
                setEditingCategory(null);
                setEditingCategoryName('');
                setEditingTopics('');
                setIsModalVisible(false); // Đóng modal sau khi lưu
            })
            .catch(err => console.error('Lỗi khi cập nhật danh mục:', err));
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            axios.delete(`http://localhost:5000/api/danhmuc/${id}`)
                .then(() => {
                    setCategories(categories.filter(cat => cat._id !== id));
                })
                .catch(err => console.error('Lỗi khi xóa danh mục:', err));
        }
    };

    // const handleDeleteTopic = (categoryId, topic) => {
    //     const editingCat = categories.find(cat => cat._id === categoryId);
    //     const updatedTopics = editingCat.chuDe.filter(t => t !== topic);

    //     axios.put(`http://localhost:5000/api/danhmuc/${categoryId}`, { 
    //         ten_DM: editingCat.ten_DM,
    //         chuDe: updatedTopics
    //     })
    //         .then(response => {
    //             setCategories(categories.map(cat => (cat._id === categoryId ? response.data : cat)));
    //         })
    //         .catch(err => console.error('Lỗi khi xóa chủ đề:', err));
    // };

    return (
        <div className='container'>

            {/* Phần thêm danh mục mới */}

            <div className='mb-3'>
                <div className='mb-3'>
                <Input
                    placeholder='Nhập tên danh mục'
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />    
                </div>
                <div className='mb-3'>
                <Input
                    placeholder='Nhập chủ đề (cách nhau bằng dấu phẩy)'
                    value={newTopics}
                    onChange={(e) => setNewTopics(e.target.value)}
                />   
                </div>
                
                <Button 
                    type='primary' 
                    className='mt-2' 
                    onClick={handleAddCategory}
                >
                    Thêm
                </Button>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th scope='col'>Tên danh mục</th>
                        <th scope='col'>Chủ đề</th>
                        <th scope='col'>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>{category.ten_DM}</td>
                            <td>
                                <ul>
                                    {category.chuDe.map((topic, index) => (
                                        <li key={index}>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <Button 
                                    type="primary" onClick={() => showEditModal(category)}
                                >
                                    Chỉnh Sửa
                                </Button>
                                <Button 
                                    type="danger" 
                                    onClick={() => handleDeleteCategory(category._id)}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for editing */}
            <Modal
                title='Chỉnh sửa danh mục'
                visible={isModalVisible}
                onOk={handleUpdateCategory}
                onCancel={() => setIsModalVisible(false)}
                okText='Lưu'
                cancelText='Hủy'
            >
                <Input
                    placeholder='Nhập tên danh mục'
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className='mb-2'
                />
                <Input
                    placeholder='Nhập chủ đề (cách nhau bằng dấu phẩy)'
                    value={editingTopics}
                    onChange={(e) => setEditingTopics(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default QLDanhMucPage;
