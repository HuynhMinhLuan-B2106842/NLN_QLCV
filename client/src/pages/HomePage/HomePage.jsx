
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HomePage = ({ setBreadcrumb }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setBreadcrumb('Trang chủ');  // Cập nhật breadcrumb khi vào trang /Congvan
    }
  }, [location, setBreadcrumb]);

  return (
    <div>
      <h1>Đây là trang chủ</h1>
      {/* Nội dung khác của trang Công văn */}
    </div>
  );
};

export default HomePage;
