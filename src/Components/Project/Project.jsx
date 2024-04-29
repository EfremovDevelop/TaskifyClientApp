import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import { useNavigate } from 'react-router-dom';
import ProjectCreate from "./ProjectCreate";

const { Meta } = Card;

const url = 'api/UserProjects'

const Project = ({ user }) => {
    const [projects, setProjects] = useState([]);

    const getProjects = async () => {
        const options = {
            method: "GET"
        };
        const result = await fetch(url, options);
        console.log(url)

        if (result.ok) {
            const projects = await result.json();
            console.log("Data:", projects);
            setProjects(projects);
            return projects;
        }
        return [];
    };

    useEffect(() => {
        getProjects();
    }, []);

    const navigate = useNavigate();
    const showProjectIssues = (projectId) => {
        navigate(`/project/${projectId}/issues`);
    };
    const showProjectInfo = (projectId) => {
        navigate(`/project/${projectId}`);
    };
    return (
        <div>
            {user.isAuthenticated && (
                <ProjectCreate addProject={getProjects} />
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {user.isAuthenticated &&
                    projects.map((project) => (
                        <Card
                            key={project.id}
                            style={{ width: 300 }}
                            actions={[
                                <Button
                                    key="delete"
                                    type="text"
                                    onClick={() => showProjectInfo(project.id)}
                                >
                                    Подробнее
                                </Button>,
                                <Button
                                    key="delete"
                                    type="text"
                                    onClick={() => showProjectIssues(project.id)}
                                >
                                    Задачи
                                </Button>,
                            ]}
                        >
                            <Meta title={project.name} description={project.description} />
                        </Card>
                    ))}
                {!user.isAuthenticated && <p>Войдите, чтобы увидеть проекты.</p>}
            </div>
        </div>
    );
};

export default Project;
