import React, { useState, useEffect } from 'react';
import { IParticipant } from '../types/types';

interface Props {
    participants: IParticipant[];
    onSelectParticipant?: (id: string) => void; // Make onSelectParticipant optional
}

const ParticipantList: React.FC<Props> = ({ participants }) => {
    const [filteredParticipants, setFilteredParticipants] = useState<IParticipant[]>([]);

    useEffect(() => {
        setFilteredParticipants(participants);
    }, [participants]);

    const handleSort = (key: keyof IParticipant) => {
        const sortedParticipants = [...filteredParticipants].sort((a, b) => {
            // Check if a and b are defined and if key exists in both a and b
            if (a && b && key in a && key in b) {
                const valueA = a[key];
                const valueB = b[key];

                // Ensure that valueA and valueB are not undefined
                if (valueA !== undefined && valueB !== undefined) {
                    if (valueA < valueB) {
                        return -1;
                    }
                    if (valueA > valueB) {
                        return 1;
                    }
                }
            }
            return 0;
        });

        setFilteredParticipants(sortedParticipants);
    };

    return (
        <div>
            {/* Sorting buttons */}
            <button onClick={() => handleSort('name')}>Sort by Name</button>
            <button onClick={() => handleSort('birthDate')}>Sort by Age</button>
            <button onClick={() => handleSort('club')}>Sort by Club</button>

            {/* Render participant list */}
            {filteredParticipants.map(participant => (
                <div key={participant.id}>
                    <h3>{participant.name}</h3>
                    <p>Gender: {participant.gender}</p>
                    <p>Age: {participant.birthDate}</p>
                    <p>Club: {participant.club}</p>
                    {participant.disciplines && (
                        <p>Disciplines: {participant.disciplines.map(d => d.name).join(', ')}</p>
                    )}
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default ParticipantList;
