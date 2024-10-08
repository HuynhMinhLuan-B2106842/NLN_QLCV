// import HomePage from "../pages/HomePage/HomePage";
// import CongvanPage from "../pages/CongvanPage/CongvanPage";
// import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";


// export const routes = [
//     {
//         path:'/',
//         page: HomePage,
//         isShowHeader: true
//     },
//     {
//         path: '/Congvan',
//         page: CongvanPage,
//         isShowHeader: true
//     },
//     {
//         path: '*',
//         page: NotFoundPage
//     },

// ]
// Router.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CongvanPage from '../../src/pages/CongvanPage/CongvandenPage';
import HomePage from '../../src/pages/HomePage/HomePage';
import NotFoundPage from '../../src/pages/NotFoundPage/NotFoundPage';
import CongvandiPage from '../../src/pages/CongvanPage/CongvandiPage';
import CongvannoiboPage from '../../src/pages/CongvanPage/CongvannoiboPage';
import QLcongvandiPage from '../../src/pages/QLcongvanPage/QLcongvandiPage';
import QLkhoaPage from '../../src/pages/QLlienquanPage/KhoaPage';
import QLGiangvienPage from '../../src/pages/QLlienquanPage/GiangvienPage';
import QLDanhMucPage from '../pages/QLlienquanPage/DanhmucPage';

const RouterComponent = ({ setBreadcrumb }) => (
  <Routes>
    <Route path="/" element={<HomePage setBreadcrumb={setBreadcrumb} />} />
    <Route path="/Congvan" element={<CongvanPage setBreadcrumb={setBreadcrumb} />} />
    <Route path="/Congvandi" element={<CongvandiPage setBreadcrumb={setBreadcrumb} />} />
    <Route path="/Congvannoibo" element={<CongvannoiboPage setBreadcrumb={setBreadcrumb} />} />
    <Route path="/QLCongvandi" element={<QLcongvandiPage setBreadcrumb={setBreadcrumb} />} />
    <Route path="/QLkhoa" element={<QLkhoaPage setBreadcrumb={setBreadcrumb}/>}/>
    <Route path="/QLGiangvien" element={<QLGiangvienPage setBreadcrumb={setBreadcrumb}/>}/>
    <Route path="/QLdanhmuc" element={<QLDanhMucPage setBreadcrumb={setBreadcrumb}/>}/>
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);

export default RouterComponent;
