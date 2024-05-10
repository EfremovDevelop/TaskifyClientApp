// Issue.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Button } from "antd";
import IssueForm from "./IssueForm";

const Issues = ({ user }) => {
    const { projectId } = useParams();
    const [allIssues, setIssues] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const getIssues = async () => {
        const options = {
            method: "GET"
        };
        const result = await fetch(`/api/projects/${projectId}/issues`, options);
        if (result.ok) {
            const issues = await result.json();
            setIssues(issues);
        }
    };

    useEffect(() => {
        getIssues();
    }, [projectId]);

    const createIssue = async (formData) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                projectId: projectId,
                name: formData.name,
                description: formData.description,
                timeSpent: formData.timeSpent,
                statusId: formData.statusId,
                assignedId: formData.assignedUserId
            }),
        };
        console.log({projectId,formData});
        const response = await fetch("/api/issues", options);
        if (response.ok) {
            getIssues();
            setShowForm(false);
        } else {
            console.error("Failed to create issue");
        }
    }

    const handleAddIssue = () => {
        setShowForm(true);
    };

    const handleSubmitIssueForm = async (formData) => {
        try {
            console.log(formData);
            createIssue(formData);
        } catch (error) {
            console.error("Ошибка при обработке данных формы: ", error);
        }
    };

    const handleBack = () => {
        setShowForm(false);
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/issue/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Status',
            dataIndex: 'statusId',
            key: 'statusId',
            render: statusId => {
                switch (statusId) {
                    case 1:
                        return 'New';
                    case 2:
                        return 'Assigned';
                    case 3:
                        return 'Review';
                    case 4:
                        return 'Reopened';
                    case 5:
                        return 'Closed';
                    default:
                        return 'Unknown';
                }
            },
        },
        {
            title: 'Time Spent',
            dataIndex: 'timeSpent',
            key: 'timeSpent',
        }
    ];

    return (
        <div>
            {showForm ? (
                <IssueForm
                    onSubmit={handleSubmitIssueForm}
                    onSubmitBack={handleBack}
                    statusId="1"
                    projectId = {projectId}
                />
            ) : (
                <>
                    {user.isAuthenticated && (
                        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                            <Button type="primary" onClick={handleAddIssue}>
                                Добавить задачу
                            </Button>
                        </div>
                    )}
                    {user.isAuthenticated ? (
                        <Table dataSource={allIssues} columns={columns} />
                    ) : (
                        <p>Войдите, чтобы увидеть задачи.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Issues;
