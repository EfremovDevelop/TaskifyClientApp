import React from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "antd";

const HomePage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Добро пожаловать в систему управления проектами и задачами</h1>
      <Row gutter={[16, 16]} style={{ marginTop: "50px" }}>
        <Col span={12}>
          <div style={{ textAlign: "center" }}>
            <h2>Управление проектами</h2>
            <p>Создавайте, редактируйте и управляйте проектами в системе.</p>
            <Button type="primary" size="large">
              <Link to="/projects">Посмотреть проекты</Link>
            </Button>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ textAlign: "center" }}>
            <h2>Управление задачами</h2>
            <p>Создавайте, отслеживайте и решайте задачи в рамках проектов.</p>
            <Button type="primary" size="large">
              <Link to="/tasks">Посмотреть задачи</Link>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;