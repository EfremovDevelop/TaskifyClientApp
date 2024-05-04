import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const IssueForm = ({ onSubmit, onSubmitBack, statusId, projectUsers }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        timeSpent: "",
        statusId: parseInt(statusId),
        assignedUserId: "" // Добавленное поле для выбора AssignedUser
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({
            name: "",
            description: "",
            timeSpent: "",
            statusId: 1,
            assignedUserId: "" // Сброс значения после отправки формы
        });
    };
    
    const handleBack = () => {
        onSubmitBack();
    };

    return (
        <Form layout="vertical" style={{ padding: "20px" }} onFinish={handleSubmit}>
            <Form.Item label="Name" required>
                <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Description" required>
                <Input.TextArea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Time Spent">
                <Input
                    type="number"
                    value={formData.timeSpent}
                    onChange={(e) => handleChange("timeSpent", e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Status" required>
                <Select
                    value={formData.statusId}
                    onChange={(value) => handleChange("statusId", value)}
                >
                    <Option value={1}>New</Option>
                    <Option value={2}>Assigned</Option>
                    <Option value={3}>Review</Option>
                    <Option value={4}>Reopened</Option>
                    <Option value={5}>Closed</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Assigned User" required>
                <Select
                    value={formData.assignedUserId}
                    onChange={(value) => handleChange("assignedUserId", value)}
                >
                    {projectUsers.map(user => (
                        <Option key={user.userId} value={user.userId}>
                            {user.userName} ({user.email})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Добавить задачу
                </Button>

                <Button style={{ marginLeft: "10px" }} onClick={handleBack}>
                    Назад
                </Button>
            </Form.Item>
        </Form>
    );
};

export default IssueForm;
