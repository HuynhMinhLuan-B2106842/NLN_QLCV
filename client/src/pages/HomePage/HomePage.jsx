
// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const HomePage = ({ setBreadcrumb }) => {
//   const location = useLocation();

//   useEffect(() => {
//     if (location.pathname === '/') {
//       setBreadcrumb('Trang chủ');  // Cập nhật breadcrumb khi vào trang /Congvan
//     }
//   }, [location, setBreadcrumb]);

//   return (
//     <div>
//       <h1>Đây là trang chủ</h1>
//       {/* Nội dung khác của trang Công văn */}
//     </div>
//   );
// };

// export default HomePage;
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import axios from 'axios';

const TrangChuThongKePage = () => {
  const [statistics, setStatistics] = useState({
    totalCongvan: 0,
    congvanTheoDanhmuc: [],
    congvanDangHieuluc: 0,
    congvanHetHieuluc: 0,
  });

  useEffect(() => {
    // Giả sử API có endpoint trả về dữ liệu thống kê
    axios.get('http://localhost:5000/api/congvan/thongke/thongke')
      .then(response => {
        setStatistics(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      });
  }, []);

  return (
    <div className="container">
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số công văn"
              value={statistics.totalCongvan}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Công văn đang hiệu lực"
              value={statistics.congvanDangHieuluc}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Công văn hết hiệu lực"
              value={statistics.congvanHetHieuluc}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        {statistics.congvanTheoDanhmuc.map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={`Công văn thuộc danh mục: ${item.ten_DM}`}
                value={item.soCongvan}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TrangChuThongKePage;
