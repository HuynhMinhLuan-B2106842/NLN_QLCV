import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { FileSearchOutlined, FileOutlined, HomeOutlined, UsergroupAddOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RouterComponent from './routes/index';
import HeaderComponent from './components/Headercomponent/Headercomponent';
import './App.css'; // Nhớ import CSS ở đây
import logo from './assets/images/logo.png';
const { Sider, Content, Footer } = Layout;

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState('Trang chủ');
  const navigate = useNavigate();

  const handleMenuClick = (path, breadcrumbName) => {
    navigate(path);
    setBreadcrumb(breadcrumbName);
  };

  const items = [
    getItem('Trang chủ', '1', <HomeOutlined />, null, () => handleMenuClick('/', 'Trang chủ')),
    getItem('Công Văn', 'sub1', <FileSearchOutlined />, [
      getItem('Công văn đến', '3', null, null, () => handleMenuClick('/Congvanden', 'Công văn đến')),
      getItem('Công văn đi', '4', null, null, () => handleMenuClick('/Congvandi', 'Công văn đi')),
      getItem('Công văn nội bộ', '5', null, null, () => handleMenuClick('/Congvannoibo', 'Công văn nội bộ')),
    ]),
    getItem('Quản lý liên quan', 'sub2', <UsergroupAddOutlined />, [
      getItem('Quản lý khoa', '6', null, null, () => handleMenuClick('/QLkhoa', 'Quản lý khoa')),
      // getItem('Quản lí giảng viên', '7', null, null, () => handleMenuClick('/QLGiangvien', 'Quản lí giảng viên')),
      getItem('Quản lý danh mục', '12', null, null, () => handleMenuClick('/QLdanhmuc', 'Quản lý danh mục')),
    ]),
    getItem('Quản lý công văn', 'sub3', <FileAddOutlined />, [
      getItem('Quản lý công văn', '9', null, null, () => handleMenuClick('/QLCongvan', 'Quản lý công văn')),
    ]),
   // getItem('Files', '11', <FileOutlined />, null, () => handleMenuClick('/files', 'Files')),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={230}
          style={{ position: 'fixed', height: '100vh', left: 0 }}
        >
          <div 
            className="demo-logo-vertical"
            onClick={() => {
              navigate('/'); // Điều hướng về trang chủ
              window.location.reload(); // Reload lại trang
            }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '16px' }}
            
          >
            <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto' }} />
            {/* Hiển thị chữ chỉ khi Sider không collapse */}
            {!collapsed && <span className="logo-text">Công Văn</span>}
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
          <HeaderComponent breadcrumb={breadcrumb} />
          <Content style={{ margin: '0 16px' }}>
            <div className="content-background" style={{ padding: 0, minHeight: 360, borderRadius: '8px' }}>
              <RouterComponent setBreadcrumb={setBreadcrumb} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
          </Footer>
        </Layout>
                    
    </Layout>
  );
};

export default App;
