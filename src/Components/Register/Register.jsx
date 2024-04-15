import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success("Регистрация прошла успешно");
      } else {
        const error = await response.json();
        message.error(error.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      message.error("Ошибка при отправке запроса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Регистрация</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[{ required: true, message: "Введите имя пользователя" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Введите адрес электронной почты" },
            { type: "email", message: "Неверный формат адреса электронной почты" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Подтвердите пароль"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
