import React from "react";
import { Row, Col, Typography } from "antd";

const { Text } = Typography;

const Comment = ({ comment }) => {
    const convertToMoscowTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    };

    return (
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
    );
};

export default Comment;