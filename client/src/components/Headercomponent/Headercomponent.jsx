// // import React from 'react'
// // import { Col } from 'antd';
// // import { WrapperHeader, WrapperTextHeader } from './style';
// // import Search from 'antd/es/input/Search';
// // const Headercomponent = () => {
// //   return (
// //     <div>
// //     <WrapperHeader>
// //       <Col span={8}>

// //       <WrapperTextHeader>
// //         Công Văn
// //       </WrapperTextHeader>
// //       </Col>

// //       <Col span={6}>
// //         col-8
// //       </Col>
// //     </WrapperHeader>
// //     </div>
// //   )
// // }

// // export default Headercomponent
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { Breadcrumb, Layout, Menu, theme } from 'antd';
// import CongvanPage from '../../pages/CongvanPage/CongvandenPage';
// import HomePage from '../../pages/HomePage/HomePage';
// import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
// import CongvandiPage from '../../pages/CongvanPage/CongvandiPage';
// import CongvannoiboPage from '../../pages/CongvanPage/CongvannoiboPage';
// import QLcongvandiPage from '../../pages/QLcongvanPage/QLcongvandiPage'
// const { Header, Content, Footer, Sider } = Layout;

// function getItem(label, key, icon, children, onClick) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     onClick,
//   };
// }

// const App = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [breadcrumb, setBreadcrumb] = useState('Trang chủ'); // State để lưu tên breadcrumb
//   const navigate = useNavigate();

//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   const handleMenuClick = (path, breadcrumbName) => {
//     navigate(path); // Chuyển hướng đến đường dẫn
//     setBreadcrumb(breadcrumbName);
//   };

//   const items = [
//     getItem('Trang chủ', '1', <PieChartOutlined />, null, () => handleMenuClick('/', 'Trang chủ')),
//     getItem('Option 2', '2', <DesktopOutlined />, null, () => handleMenuClick('/option2', 'Option 2')),
//     getItem('Công Văn', 'sub1', <UserOutlined />, [
//       getItem('Công văn đến', '3', null, null, () => handleMenuClick('/Congvan', 'Công văn đến')),
//       getItem('Công văn đi', '4', null, null, () => handleMenuClick('/Congvandi', 'Công văn đi')),
//       getItem('Công văn nội bộ', '5', null, null, () => handleMenuClick('/Congvannoibo', 'Công văn nội bộ')),
//     ]),
//     getItem('Quản lí liên quan', 'sub2', <TeamOutlined />, [
//       getItem('Team 1', '6', null, null, () => handleMenuClick('/team1', 'Team 1')),
//       getItem('Team 2', '7', null, null, () => handleMenuClick('/team2', 'Team 2')),
//     ]),
//     getItem('Quản Lí Công Văn', 'sub3', <UserOutlined />, [
//       getItem('Quản Lí Công văn đến', '8', null, null, () => handleMenuClick('/congvan', 'Quản Lí Công văn đến')),
//       getItem('Quản Lí Công văn đi', '9', null, null, () => handleMenuClick('/QLCongvandi', 'Quản Lí Công văn đi')),
//       getItem('Quản Lí Công văn nội bộ', '10', null, null, () => handleMenuClick('/congvan', 'Quản Lí Công văn nội bộ')),
//     ]),
//     getItem('Files', '11', <FileOutlined />, null, () => handleMenuClick('/files', 'Files')),
//   ];

//   return (

//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={250}>
//         <div className="demo-logo-vertical" />
//         <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
//       </Sider>
//       <Layout>
//         <Header style={{ padding: 0, background: colorBgContainer, textAlign: 'center', fontSize: '50px' }}>
//           Hệ thống quản lí công văn
//         </Header>
//         <Content style={{ margin: '0 16px' }}>
//           <Breadcrumb style={{ margin: '16px 0' }}>
//             <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
//           </Breadcrumb>
//           <div
//             style={{
//               padding: 24,
//               minHeight: 360,
//               background: colorBgContainer,
//               borderRadius: borderRadiusLG,
//             }}
//           >
//             <Routes>
//               <Route path="/" element={<HomePage setBreadcrumb={setBreadcrumb} />} />
//               <Route path="/Congvan" element={<CongvanPage setBreadcrumb={setBreadcrumb} />} />
//               <Route path="/Congvandi" element={<CongvandiPage setBreadcrumb={setBreadcrumb} />} />
//               <Route path="/Congvannoibo" element={<CongvannoiboPage setBreadcrumb={setBreadcrumb} />} />
//               <Route path="/QLCongvandi" element={<QLcongvandiPage setBreadcrumb={setBreadcrumb} />} />
//               <Route path='*' element={<NotFoundPage />} />
//               {/* Thêm các Route khác ở đây */}
//             </Routes>
//           </div>
//         </Content>
//         <Footer style={{ textAlign: 'center' }}>
//           Ant Design ©{new Date().getFullYear()} Created by Ant UED
//         </Footer>
//       </Layout>

//     </Layout>
//   );
// };



// const AppWithRouter = () => (
//   <Router>
//     <App />
//   </Router>
// );

// export default AppWithRouter;
// Header.jsx
import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import { theme } from 'antd';

const { Header } = Layout;

const HeaderComponent = ({ breadcrumb }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Header style={{ padding: 0, background: colorBgContainer, textAlign: 'center', fontSize: '50px' }}>
        Hệ thống quản lí công văn
      </Header>
      <Breadcrumb style={{ margin: '16px 0', textAlign: 'left' }}>
        <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
};

export default HeaderComponent;
