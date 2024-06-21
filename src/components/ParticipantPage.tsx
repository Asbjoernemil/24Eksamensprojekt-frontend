import React, { useState, useEffect } from 'react';
import ParticipantList from './ParticipantList';
import ParticipantForm from './ParticipantForm';
import ParticipantSearch from './ParticipantSearch';
import ParticipantDetails from './ParticipantDetails';
import { useParticipants } from '../hooks/useParticipants';
import { IParticipant } from '../types/types';

const ParticipantsPage = () => {
    const { participants, fetchParticipants, createParticipant, deleteParticipant } = useParticipants();
    const [filteredParticipants, setFilteredParticipants] = useState<IParticipant[]>([]);
    const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

    useEffect(() => {
        fetchParticipants();
    }, []);

    useEffect(() => {
        setFilteredParticipants(participants);
    }, [participants]);

    const handleSearch = (searchTerm: string) => {
        const filtered = participants.filter(participant =>
            participant.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredParticipants(filtered);
    };

    const handleCreateParticipant = async (participantData: IParticipant) => {
        await createParticipant(participantData);
        fetchParticipants();
    };

    const handleDeleteParticipant = async (id: number) => {
        await deleteParticipant(id);
        fetchParticipants();
    };

    const handleSelectParticipant = (id: string) => {
        setSelectedParticipantId(id);
    };

    return (
        <div>
            <h1>Participants Page</h1>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: '1', marginRight: '20px' }}>
                    <ParticipantSearch onSearch={handleSearch} />
                    <ParticipantList participants={filteredParticipants} onSelectParticipant={handleSelectParticipant} />
                </div>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <ParticipantForm onCreateParticipant={handleCreateParticipant} />
                    {selectedParticipantId && (
                        <ParticipantDetails id={selectedParticipantId} onDeleteParticipant={handleDeleteParticipant} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantsPage;
