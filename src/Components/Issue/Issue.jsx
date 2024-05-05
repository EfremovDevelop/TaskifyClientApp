import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, List, Typography, Button, Input, Form } from "antd";
import Comment from "./Comment";

const { Text } = Typography;
const { TextArea } = Input;

const Issue = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const navigate = useNavigate();

    const convertToMoscowTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
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
        navigate(-1);
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
                    <Button type="primary" onClick={handleGoBack} style={{ marginTop: "20px" }}>Back</Button>
                </>
            )}
        </div>
    );
};

export default Issue;
