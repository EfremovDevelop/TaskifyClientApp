import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const ProjectCreate = ({ addProject }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      };
      const response = await fetch("api/projects", options);
      if (response.ok) {
        const project = await response.json();
        addProject(project);
        form.resetFields();
        setVisible(false);
      } else {
        console.error("Failed to create project");
      }
    } catch (errorInfo) {
      console.error("Failed to validate fields:", errorInfo);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        <Button type="primary" onClick={showModal}>
          Добавить проект
        </Button>
      </div>
      <Modal
        title="Создать проект"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Добавить
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="project_form">
          <Form.Item
            name="name"
            label="Название проекта"
            rules={[{ required: true, message: "Введите название проекта" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание проекта"
            rules={[{ required: true, message: "Введите описание проекта" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectCreate;
