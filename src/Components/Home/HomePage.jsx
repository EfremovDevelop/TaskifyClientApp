import React from "react";
import { Row, Col, Button } from "antd";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Добро пожаловать в систему управления проектами и задачами</h1>
      <Row gutter={[16, 16]} style={{ marginTop: "50px" }}>
        <Col span={24}>
          <div>
            <h2>Управление проектами</h2>
            <p>Создавайте, редактируйте и управляйте проектами в системе.</p>
            <Button type="primary" size="large">
              <Link to="/projects">Посмотреть проекты</Link>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
