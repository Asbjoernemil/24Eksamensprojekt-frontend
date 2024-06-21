import React, { useState, useEffect } from 'react';
import { IParticipant } from '../types/types';

interface ParticipantDetailsProps {
    id: string; //
    onDeleteParticipant: (id: number) => Promise<void>;
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = ({ id, onDeleteParticipant }) => {
    const [participant, setParticipant] = useState<IParticipant | null>(null);
    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                const response = await fetch(`/api/participants/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch participant');
                }
                const data = await response.json();
                setParticipant(data);
            } catch (error) {
                console.error('Error fetching participant:', error);
            }
        };

        fetchParticipant();
    }, [id]);

    const handleDeleteClick = async () => {
        try {
            await onDeleteParticipant(parseInt(id, 10));

        } catch (error) {
            console.error('Error deleting participant:', error);

        }
    };

    if (!participant) {
        return <div>Loading participant details...</div>;
    }

    return (
        <div>
            <h2>{participant.name}</h2>
            <p>Gender: {participant.gender}</p>
            <p>Age: {participant.birthDate}</p>
            <p>Club: {participant.club}</p>
            {participant.disciplines && participant.disciplines.length > 0 && (
                <p>Disciplines: {participant.disciplines.map(d => d.name).join(', ')}</p>
            )}
            <button onClick={handleDeleteClick}>Delete</button>
            <button>Edit</button>
        </div>
    );
};

export default ParticipantDetails;
