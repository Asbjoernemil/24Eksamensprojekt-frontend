import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd'; // Importer Ant Design komponenter
import { IParticipant } from '../types/types'; // Importer IParticipant interface

interface Props {
    isOpen: boolean;
    onClose: () => void;
    participant: IParticipant;
    onSave: (participant: IParticipant) => void;
    onUpdateParticipant: (participant: IParticipant) => void;
}

const ParticipantModal: React.FC<Props> = ({ isOpen, onClose, participant, onSave }) => {
    const initialFormData: IParticipant = {
        id: participant.id || 0,
        name: participant.name || '',
        age: participant.age !== undefined ? participant.age : 0,
        club: participant.club || '',
        gender: participant.gender || 'MALE',
        disciplines: participant.disciplines || [],
    };

    const [formData, setFormData] = useState<IParticipant>({ ...initialFormData });

    // Opdater formData, når participant prop ændrer sig
    useEffect(() => {
        setFormData({ ...initialFormData });
    }, [participant]);

    // Håndter ændringer i inputfelter
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'age' ? parseInt(value, 10) : value });
    };

    // Gem ændringer og kald onSave prop
    const handleSubmit = () => {
        onSave(formData);
        onUpdateParticipant(formData);
        onClose();
    };

    return (
        <Modal
            title="Rediger deltager"
            visible={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Annuller
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Gem ændringer
                </Button>,
            ]}
        >
            <Form layout="vertical">
                <Form.Item label="Navn">
                    <Input name="name" value={formData.name} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Alder">
                    <Input type="number" name="age" value={formData.age !== undefined ? formData.age.toString() : ''} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Klub">
                    <Input name="club" value={formData.club} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Køn">
                    <Select value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value })}>
                        <Select.Option value="MALE">Male</Select.Option>
                        <Select.Option value="FEMALE">Female</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ParticipantModal;
