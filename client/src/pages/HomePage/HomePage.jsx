import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import axios from 'axios';

const TrangChuThongKePage = () => {
  const [statistics, setStatistics] = useState({
    totalCongvan: 0,
    congvanDangHieuluc: 0,
    congvanHetHieuluc: 0,
    congvanTheoKhoa: [],
    congvanTheoLoai: [],
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
        {statistics.congvanTheoKhoa.map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={`Công văn thuộc khoa: ${item.ten_K}`}
                value={item.soCongvan}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        {statistics.congvanTheoLoai.map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={`Công văn thuộc loại: ${item.ten_LCV}`}
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
