import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Input, Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const QLDanhMucPage = ({ setBreadcrumb }) => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [isTopicModalVisible, setIsTopicModalVisible] = useState(false);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [editingTopicName, setEditingTopicName] = useState('');

    const fetchCategories = () => {
        axios.get('http://localhost:5000/api/loaicongvan')
            .then(response => setCategories(response.data))
            .catch(err => console.error('Lỗi khi lấy loại công văn:', err));
    };

    const fetchTopics = () => {
        axios.get('http://localhost:5000/api/chude')
            .then(response => setTopics(response.data))
            .catch(err => console.error('Lỗi khi lấy chủ đề:', err));
    };

    useEffect(() => {
        if (location.pathname === '/QLdanhmuc') {
            setBreadcrumb('Quản lý danh mục');
        }
        fetchCategories();
        fetchTopics();
    }, [location, setBreadcrumb]);

    const handleAddCategory = () => {
        if (!newCategory) return;

        axios.post('http://localhost:5000/api/loaicongvan', { ten_LCV: newCategory })
            .then(response => {
                setCategories([...categories, response.data]);
                setNewCategory('');
            })
            .catch(err => console.error('Lỗi khi thêm loại công văn:', err));
    };

    const handleAddTopic = () => {
        if (!newTopic) return;

        axios.post('http://localhost:5000/api/chude', { ten_CD: newTopic })
            .then(response => {
                setTopics([...topics, response.data]);
                setNewTopic('');
            })
            .catch(err => console.error('Lỗi khi thêm chủ đề:', err));
    };

    const showEditCategoryModal = (category) => {
        setEditingCategory(category);
        setEditingCategoryName(category.ten_LCV);
        setIsCategoryModalVisible(true);
    };

    const handleUpdateCategory = () => {
        if (!editingCategory || !editingCategoryName) return;

        axios.put(`http://localhost:5000/api/loaicongvan/${editingCategory._id}`, {
            ten_LCV: editingCategoryName,
        })
            .then(response => {
                setCategories(categories.map(cat => (cat._id === editingCategory._id ? response.data : cat)));
                setEditingCategory(null);
                setEditingCategoryName('');
                setIsCategoryModalVisible(false);
            })
            .catch(err => console.error('Lỗi khi cập nhật loại công văn:', err));
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại công văn này?')) {
            axios.delete(`http://localhost:5000/api/loaicongvan/${id}`)
                .then(() => {
                    setCategories(categories.filter(cat => cat._id !== id));
                })
                .catch(err => console.error('Lỗi khi xóa loại công văn:', err));
        }
    };

    const showEditTopicModal = (topic) => {
        setEditingTopic(topic);
        setEditingTopicName(topic.ten_CD);
        setIsTopicModalVisible(true);
    };

    const handleUpdateTopic = () => {
        if (!editingTopic || !editingTopicName) return;

        axios.put(`http://localhost:5000/api/chude/${editingTopic._id}`, {
            ten_CD: editingTopicName,
        })
            .then(response => {
                setTopics(topics.map(top => (top._id === editingTopic._id ? response.data : top)));
                setEditingTopic(null);
                setEditingTopicName('');
                setIsTopicModalVisible(false);
            })
            .catch(err => console.error('Lỗi khi cập nhật chủ đề:', err));
    };

    const handleDeleteTopic = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này?')) {
            axios.delete(`http://localhost:5000/api/chude/${id}`)
                .then(() => {
                    setTopics(topics.filter(top => top._id !== id));
                })
                .catch(err => console.error('Lỗi khi xóa chủ đề:', err));
        }
    };

    return (
        <div className='container'>
            {/* Thêm loại công văn mới */}
            <div className='mb-3'>
                <Input
                    placeholder='Nhập tên loại công văn'
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type='primary' className='mt-2' onClick={handleAddCategory}>
                    Thêm loại công văn
                </Button>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th scope='col'>Loại công văn</th>
                        <th scope='col'>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                            <td>{category.ten_LCV}</td>
                            <td>
                                <Button type="danger" onClick={() => showEditCategoryModal(category)}>
                                <EditOutlined />
                                </Button>
                                <Button type="danger" onClick={() => handleDeleteCategory(category._id)}>
                                <DeleteOutlined />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                title='Chỉnh sửa loại công văn'
                visible={isCategoryModalVisible}
                onOk={handleUpdateCategory}
                onCancel={() => setIsCategoryModalVisible(false)}
                okText='Lưu'
                cancelText='Hủy'
            >
                <Input
                    placeholder='Nhập tên loại công văn'
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className='mb-2'
                />
            </Modal>

            {/* Thêm chủ đề mới */}
            <div className='mb-3'>
                <Input
                    placeholder='Nhập tên chủ đề'
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                />
                <Button type='primary' className='mt-2' onClick={handleAddTopic}>
                    Thêm chủ đề
                </Button>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th scope='col'>Từ khóa chủ đề</th>
                        <th scope='col'>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map((topic) => (
                        <tr key={topic._id}>
                            <td>{topic.ten_CD}</td>
                            <td>
                                <Button type="danger" onClick={() => showEditTopicModal(topic)}>
                                <EditOutlined />
                                </Button>
                                <Button type="danger" onClick={() => handleDeleteTopic(topic._id)}>
                                <DeleteOutlined />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                title='Chỉnh sửa từ khóa chủ đề'
                visible={isTopicModalVisible}
                onOk={handleUpdateTopic}
                onCancel={() => setIsTopicModalVisible(false)}
                okText='Lưu'
                cancelText='Hủy'
            >
                <Input
                    placeholder='Nhập tên từ khóa chủ đề'
                    value={editingTopicName}
                    onChange={(e) => setEditingTopicName(e.target.value)}
                    className='mb-2'
                />
            </Modal>
        </div>
    );
};

export default QLDanhMucPage;
