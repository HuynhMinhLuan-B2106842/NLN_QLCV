// CongvanPage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
const CongvanPage = ({ setBreadcrumb }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/Congvan') {
      setBreadcrumb('Công văn đến');  // Cập nhật breadcrumb khi vào trang /Congvan
    }
  }, [location, setBreadcrumb]);

  return (
    <div>
      <h1>Đây là trang Công văn đến</h1>
      <Upload>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </div>
  );
};

export default CongvanPage;
