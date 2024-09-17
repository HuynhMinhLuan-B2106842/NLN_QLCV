import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CongvannoiboPage = ({ setBreadcrumb }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/Congvannoibo') {
      setBreadcrumb('Công văn nội bộ');  // Cập nhật breadcrumb khi vào trang /Congvan
    }
  }, [location, setBreadcrumb]);

  return (
    <div>
      <h1>Đây là trang Công văn nội bộ</h1>
      {/* Nội dung khác của trang Công văn */}
    </div>
  );
};

export default CongvannoiboPage;
