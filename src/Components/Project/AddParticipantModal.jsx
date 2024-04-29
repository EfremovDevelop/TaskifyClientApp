import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";

const AddParticipantModal = ({ visible, onCancel, onAdd, projectId }) => {
    const [email, setEmail] = useState("");

    const handleAddParticipant = () => {
        const userData = {
            email: email,
            projectId: projectId
        };
        fetch(`/api/Participants/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                onAdd(email); // Обновить интерфейс или выполнить другие действия при успешном добавлении
                onCancel();
            })
            .catch(error => {
                console.error("Ошибка при отправке запроса:", error);
                message.error("Ошибка при отправке запроса");
            });
    };

    return (
        <Modal
            visible={visible}
            title="Добавить участника"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button key="add" type="primary" onClick={handleAddParticipant}>
                    Добавить
                </Button>,
            ]}
        >
            <Input
                placeholder="Введите email участника"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
        </Modal>
    );
};

export default AddParticipantModal;