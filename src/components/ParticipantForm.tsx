import React, { useState, useEffect } from 'react';
import { IDiscipline, IParticipant } from '../types/types';

interface Props {
    onCreateParticipant: (participantData: IParticipant) => Promise<void>;
}

const ParticipantForm: React.FC<Props> = ({ onCreateParticipant }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
    const [birthDate, setBirthDate] = useState('');
    const [club, setClub] = useState('');
    const [disciplines, setDisciplines] = useState<IDiscipline[]>([]);
    const [availableDisciplines, setAvailableDisciplines] = useState<IDiscipline[]>([]);

    useEffect(() => {
        // Fetch available disciplines from backend and update state
        const fetchDisciplines = async () => {
            try {
                // Replace with actual fetch call to get disciplines
                const response = await fetch('API_BASE_URL/disciplines');
                const data = await response.json();
                setAvailableDisciplines(data); // Assuming data is in correct format like IDiscipline[]
            } catch (error) {
                console.error('Error fetching disciplines:', error);
            }
        };

        fetchDisciplines();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const participantData: IParticipant = {
            id: 0,
            name,
            gender,
            birthDate,
            club,
            disciplines: disciplines.map(discipline => ({
                id: discipline.id,
                name: discipline.name, // Assuming discipline object has name field
                resultType: discipline.resultType // Assuming discipline object has resultType field
            })),
        };

        try {
            await onCreateParticipant(participantData);
            // Optionally reset form fields after successful submission
            setName('');
            setGender('MALE');
            setBirthDate('');
            setClub('');
            setDisciplines([]);
        } catch (error) {
            console.error('Error creating participant:', error);
            // Handle error state or display error message
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Gender:
                <select value={gender} onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')} required>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
            </label>
            <label>
                Birth Date:
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </label>
            <label>
                Club:
                <input type="text" value={club} onChange={(e) => setClub(e.target.value)} required />
            </label>
            <label>
                Disciplines:
                <select
                    multiple
                    value={disciplines.map(d => d.id.toString())}
                    onChange={(e) => {
                        const selectedIds = Array.from(e.target.selectedOptions, option => Number(option.value));
                        const selectedDisciplines = availableDisciplines.filter(discipline => selectedIds.includes(discipline.id));
                        setDisciplines(selectedDisciplines);
                    }}
                >
                    {availableDisciplines.map(discipline => (
                        <option key={discipline.id} value={discipline.id.toString()}>
                            {discipline.name}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit">Create Participant</button>
        </form>
    );
};

export default ParticipantForm;
