import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "antd";
import ProjectCreate from "./ProjectCreate";

const { Meta } = Card;

const url = 'api/projects'

const Project = ({ user }) => {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    const options = {
        method: "GET"
    };
    const result = await fetch(url, options);
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

  const deleteProject = async (projectId) => {
    const options = {
        method: "DELETE",
    };
    const result = await fetch(`${url}/${projectId}`, options);
    console.log(projectId)
    if (result.ok) {
        await getProjects();
        console.log("Delete project with id:", projectId);
    } else {
        console.error("Failed to delete project");
    }
}

  const handleDelete = (projectId) => {
    Modal.confirm({
      title: "Удалить проект",
      content: "Вы уверены, что хотите удалить этот проект?",
      onOk() {
        deleteProject(projectId);
      },
    });
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
                  danger
                  onClick={() => handleDelete(project.id)}
                >
                  Удалить
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
