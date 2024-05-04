import React, { useState, useEffect } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { Spin, List, Typography, Button } from "antd";

const { Text } = Typography;

const Issue = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Получаем функцию для навигации

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await fetch(`/api/issues/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
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
    }, [id]);

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

    return (
        <div>
        {loading ? (
            <Spin size="large" />
        ) : (
            <>
                <List
                    header={<div>Информация о задаче</div>}
                    bordered
                    dataSource={[
                        ["Название", issue.name],
                        ["Описание", issue.description],
                        ["Затраченное время", issue.timeSpent],
                        ["Статус", getStatusText(issue.statusId)],
                        ["Назначена на", issue.assignedUserName],
                        ["Дата создания", convertToMoscowTime(issue.createdDate)],
                        ["Дата обновления", convertToMoscowTime(issue.updateDate)],
                    ]}
                    renderItem={([fieldName, fieldValue]) => (
                        <List.Item>
                            <Text strong>{fieldName}:</Text> {fieldValue}
                        </List.Item>
                    )}
                />
                <Button type="primary" onClick={handleGoBack} style={{ marginTop: "20px" }}>Назад</Button>
            </>
        )}
    </div>
    );
};

export default Issue;
