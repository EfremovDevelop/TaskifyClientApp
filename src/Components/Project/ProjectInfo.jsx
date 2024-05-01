import React, { useState, useEffect } from "react";
import { Button, Modal, List, Typography, Divider, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import AddParticipantModal from "./AddParticipantModal"; // Импортируем компонент модального окна

const { Title, Text } = Typography;

const ProjectInfo = () => {
    const [project, setProject] = useState(null);
    const { projectId } = useParams();
    const [projectUsers, setProjectUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для видимости модального окна
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjectInfo();
        fetchUserRole();
    }, [projectId]);

    const fetchProjectInfo = async () => {
        setLoading(true);
        try {
            const projectResponse = await fetch(`/api/projects/${projectId}`);
            const projectData = await projectResponse.json();
            setProject(projectData);

            const projectUsersResponse = await fetch(`/api/ProjectUsers/${projectId}`);
            const projectUsersData = await projectUsersResponse.json();
            setProjectUsers(projectUsersData);
        } catch (error) {
            console.error("Error fetching project info:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRole = async () => {
        try {
            const userResponse = await fetch(`/api/ProjectUsers/${projectId}/me`);
            const userData = await userResponse.json();
            setUserRole(userData.role);
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    const deleteProject = async () => {
        const options = {
            method: "DELETE",
        };
        try {
            const result = await fetch(`/api/projects/${projectId}`, options);
            if (result.ok) {
                console.log("Project deleted successfully.");
                navigate(-1);
            } else {
                console.error("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: "Удалить проект",
            content: "Вы уверены, что хотите удалить этот проект?",
            onOk() {
                deleteProject();
            },
        });
    };

    const handleAddUser = () => {
        if (userRole.name === "Admin") {
            setIsModalVisible(true); // Открываем модальное окно при нажатии на кнопку
        } else {
            message.error("У вас нет прав для добавления пользователя в проект.");
        }
    };

    const closeModal = () => {
        setIsModalVisible(false); // Закрываем модальное окно
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!project) {
        return <p>Project not found.</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>{project.name}</Title>
            <Text>{project.description}</Text>

            <Divider style={{ margin: "20px 0" }} />

            <Title level={3}>Пользователи проекта</Title>
            <List
                dataSource={projectUsers}
                renderItem={(projectUser) => (
                    <List.Item>
                        <Text strong>{projectUser.userName}</Text> - <Text>{projectUser.email}</Text> - <Text>{projectUser.role.name}</Text>
                    </List.Item>

                )}
            />

            <Divider style={{ margin: "20px 0" }} />

            {userRole.name === "Admin" && (
                <>
                    <Button
                        type="primary"
                        danger
                        onClick={handleDelete}
                        style={{ marginRight: "10px" }}
                    >
                        Удалить проект
                    </Button>

                    <Button
                        type="primary"
                        onClick={handleAddUser}
                    >
                        Добавить пользователя в проект
                    </Button>
                </>
            )}

            {/* Модальное окно добавления участника */}
            <AddParticipantModal
                visible={isModalVisible}
                onCancel={closeModal}
                onAdd={(email) => {
                    // Обновление списка участников проекта после успешного добавления
                    fetchProjectInfo();
                    message.success(`Пользователь ${email} успешно добавлен в проект.`);
                }}
                projectId={projectId}
            />
        </div>
    );
};

export default ProjectInfo;
