import React, { useState } from "react";
import { useParticipants } from "../hooks/useParticipants";
import { IParticipant } from "../types/types";
import toast from "react-hot-toast";

const Participants: React.FC = () => {
    const { participants, loading, createParticipant } = useParticipants();
    const [newParticipantName, setNewParticipantName] = useState("");

    const handleCreateParticipant = async () => {
        try {
            const newParticipant: Partial<IParticipant> = {
                name: newParticipantName,
                // Add other fields as needed
            };
            await createParticipant(newParticipant);
            setNewParticipantName(""); // Clear input field after successful creation
        } catch (error) {
            toast.error("Der opstod en fejl ved oprettelse af deltageren.");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewParticipantName(event.target.value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Deltagere</h1>

            {/* Form for creating a new participant */}
            <form onSubmit={(e) => { e.preventDefault(); handleCreateParticipant(); }}>
                <input
                    type="text"
                    placeholder="Indtast deltagerens navn"
                    value={newParticipantName}
                    onChange={handleInputChange}
                />
                <button type="submit">Opret Deltager</button>
            </form>

            {/* List of participants */}
            <ul>
                {participants.map((participant) => (
                    <li key={participant.id}>
                        {participant.name}
                        {/* Implement details, edit, and delete buttons as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Participants;
