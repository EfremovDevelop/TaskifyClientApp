import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, List, Typography, Button, Input, Form, Modal } from "antd";
import Comment from "./Comment";
import IssueForm from "./IssueForm";

const { Text } = Typography;
const { TextArea } = Input;

const Issue = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [showEditModal, setShowEditModal] = useState(false); // Состояние модального окна редактирования задачи

    const convertToMoscowTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        date.setHours(date.getHours() + 3);
        return date.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    };

    const getStatusText = (statusId) => {
        switch (statusId) {
            case 1:
                return "New";
            case 2:
                return "Assigned";
            case 3:
                return "Review";
            case 4:
                return "Reopened";
            case 5:
                return "Closed";
            default:
                return "Unknown";
        }
    };

    const handleSubmitComment = async () => {
        try {
            const response = await fetch(`/api/IssueComments/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: commentText
                }),
            });
            if (response.ok) {
                fetchComments();
                setCommentText("");
            } else {
                console.error("Error adding comment");
            }
        } catch (error) {
            console.error("Error executing API request:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/IssueComments/${id}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            } else {
                console.error("Error fetching comments");
            }
        } catch (error) {
            console.error("Error executing API request:", error);
        }
    };

    const fetchIssue = async () => {
        try {
            const response = await fetch(`/api/issues/${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setIssue(data);
                setLoading(false);
            } else {
                console.error("Error fetching issue data");
            }
        } catch (error) {
            console.error("Error executing API request:", error);
        }
    };

    useEffect(() => {
        fetchIssue();
        fetchComments();
    }, [id]);

    const handleGoBack = () => {
        window.history.back(); // Возвращаемся на предыдущую страницу
    };

    const [editFormData, setEditFormData] = useState(null);
    const handleEditIssue = () => {
        setShowEditModal(true); // Отображаем модальное окно для редактирования задачи
        setEditFormData(issue);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false); // Закрываем модальное окно для редактирования задачи
    };

    const handleUpdateIssue = async (formData) => {
        try {
            const response = await fetch(`/api/issues/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const updatedIssue = await response.json();
                console.log(updatedIssue);
                fetchIssue();
                //setIssue(updatedIssue);
            } else {
                console.error("Error updating issue");
            }
        } catch (error) {
            console.error("Error executing API request:", error);
        }
    };

    return (
        <div>
            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <List
                        header={<div>Issue Information</div>}
                        bordered
                        dataSource={issue ? [
                            { title: "Name", content: issue.name },
                            { title: "Description", content: issue.description },
                            { title: "Time Spent", content: issue.timeSpent },
                            { title: "Status", content: getStatusText(issue.statusId) },
                            { title: "Assigned To", content: issue.assignedUserName },
                            { title: "Created Date", content: convertToMoscowTime(issue.createdDate) },
                            { title: "Update Date", content: convertToMoscowTime(issue.updateDate) },
                        ] : []}
                        renderItem={(item) => (
                            <List.Item>
                                <Text strong>{item.title}:</Text> {item.content}
                            </List.Item>
                        )}
                    />

                    <div style={{ margin: "20px 0" }}>
                        <h3>Comments:</h3>
                        <List
                            bordered
                            dataSource={comments}
                            renderItem={(comment) => (
                                <List.Item>
                                    <Comment comment={comment} />
                                </List.Item>
                            )}
                        />

                        <Form onFinish={handleSubmitComment}>
                            <Form.Item>
                                <TextArea
                                    rows={4}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Enter comment"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Add Comment
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    {issue && (
                        <Button type="primary" onClick={handleEditIssue} style={{ marginRight: "10px" }}>Edit Issue</Button>
                    )}
                    <Button type="primary" onClick={handleGoBack} style={{ marginTop: "20px" }}>Back</Button>

                </>
            )}

            {/* Модальное окно для редактирования задачи */}
            <Modal
                title="Edit Issue"
                visible={showEditModal}
                onCancel={handleCloseEditModal}
                footer={null}
            >
                {issue && (
                    <IssueForm
                        initialValues={editFormData} // Передаем текущие значения задачи в компонент IssueForm
                        onSubmit={(formData) => {
                            console.log("Form submitted with data:", formData);
                            handleUpdateIssue(formData);
                            handleCloseEditModal();
                        }}
                        onSubmitBack={handleCloseEditModal}
                        statusId={issue.statusId}
                        projectId={issue.projectId}
                    />
                )}
            </Modal>

        </div>
    );
};

export default Issue;
