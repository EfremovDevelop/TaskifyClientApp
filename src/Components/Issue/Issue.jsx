import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, List, Typography, Button, Input, Form, Row, Col } from "antd";

const { Text } = Typography;
const { TextArea } = Input;

const Issue = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const navigate = useNavigate(); // Получаем функцию для навигации

    const convertToMoscowTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    };

    const handleGoBack = () => {
        navigate(-1);
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
                fetchComments(); // Вызываем fetchComments после успешного добавления комментария
                setCommentText(""); // Очищаем поле ввода
            } else {
                console.error("Ошибка при добавлении комментария");
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса к API:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/IssueComments/${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setComments(data);
            } else {
                console.error("Ошибка при получении комментариев");
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса к API:", error);
        }
    };

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await fetch(`/api/issues/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setIssue(data);
                    setLoading(false);
                } else {
                    console.error("Ошибка при получении данных о задаче");
                }
            } catch (error) {
                console.error("Ошибка при выполнении запроса к API:", error);
            }
        };

        fetchIssue();
        fetchComments();
    }, [id]);

    return (
        <div>
            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <List
                        header={<div>Информация о задаче</div>}
                        bordered
                        dataSource={issue ? [
                            { title: "Название", content: issue.name },
                            { title: "Описание", content: issue.description },
                            { title: "Затраченное время", content: issue.timeSpent },
                            { title: "Статус", content: getStatusText(issue.statusId) },
                            { title: "Назначена на", content: issue.assignedUserName },
                            { title: "Дата создания", content: convertToMoscowTime(issue.createdDate) },
                            { title: "Дата обновления", content: convertToMoscowTime(issue.updateDate) },
                        ] : []}
                        renderItem={(item) => (
                            <List.Item>
                                <Text strong>{item.title}:</Text> {item.content}
                            </List.Item>
                        )}
                    />

                    <div style={{ margin: "20px 0" }}>
                        <h3>Комментарии:</h3>
                        <List
                            bordered
                            dataSource={comments}
                            renderItem={(comment) => (
                                <List.Item>
                                    <Row gutter={16} justify="space-between">
                                        <Col>
                                            <Text strong>Комментарий: </Text>
                                            <Text>{comment.comment}</Text>
                                            <br />
                                        </Col>
                                        <Col>
                                            <Row gutter={8}>
                                                <Col>
                                                    <Text strong>{comment.user.userName}</Text>
                                                </Col>
                                                <Col>
                                                    <Text strong>{convertToMoscowTime(comment.createdDate)}</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </List.Item>
                            )}
                        />

                        <Form onFinish={handleSubmitComment}>
                            <Form.Item>
                                <TextArea
                                    rows={4}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Введите комментарий"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Добавить комментарий
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <Button type="primary" onClick={handleGoBack} style={{ marginTop: "20px" }}>Назад</Button>
                </>
            )}
        </div>
    );
};

export default Issue;
