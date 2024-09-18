// import React, { Fragment } from 'react'
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

// import { routes } from './routes'

// import Defaultcomponent from './components/Defaultcomponent/Defaultcomponent'

// function App() {

//   return (
//     <div>
//       <Router>
//         <Routes>
//           {routes.map((route) => {
//             const Page = route.page
//             const Layout = route.isShowHeader ? Defaultcomponent : Fragment
//             return(
//               <Route path={route.path} element={
//               <Layout>
//                 <Page />
//               </Layout>
              
//             } />
//             )
//           })}
          
//         </Routes>
//       </Router>
//     </div>
//   )
// }
// export default App
// App.js
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RouterComponent from './routes/index';
import HeaderComponent from './components/Headercomponent/Headercomponent';

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
    getItem('Trang chủ', '1', <PieChartOutlined />, null, () => handleMenuClick('/', 'Trang chủ')),
    getItem('Option 2', '2', <DesktopOutlined />, null, () => handleMenuClick('/option2', 'Option 2')),
    getItem('Công Văn', 'sub1', <UserOutlined />, [
      getItem('Công văn đến', '3', null, null, () => handleMenuClick('/Congvan', 'Công văn đến')),
      getItem('Công văn đi', '4', null, null, () => handleMenuClick('/Congvandi', 'Công văn đi')),
      getItem('Công văn nội bộ', '5', null, null, () => handleMenuClick('/Congvannoibo', 'Công văn nội bộ')),
    ]),
    getItem('Quản lí liên quan', 'sub2', <TeamOutlined />, [
      getItem('Team 1', '6', null, null, () => handleMenuClick('/team1', 'Team 1')),
      getItem('Team 2', '7', null, null, () => handleMenuClick('/team2', 'Team 2')),
    ]),
    getItem('Quản Lí Công Văn', 'sub3', <UserOutlined />, [
      getItem('Quản Lí Công văn đến', '8', null, null, () => handleMenuClick('/congvan', 'Quản Lí Công văn đến')),
      getItem('Quản Lí Công văn đi', '9', null, null, () => handleMenuClick('/QLCongvandi', 'Quản Lí Công văn đi')),
      getItem('Quản Lí Công văn nội bộ', '10', null, null, () => handleMenuClick('/congvan', 'Quản Lí Công văn nội bộ')),
    ]),
    getItem('Files', '11', <FileOutlined />, null, () => handleMenuClick('/files', 'Files')),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={250}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <HeaderComponent breadcrumb={breadcrumb} />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
            <RouterComponent setBreadcrumb={setBreadcrumb} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
