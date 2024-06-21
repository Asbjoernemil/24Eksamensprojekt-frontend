import React, { useEffect, useState } from "react";
import { useParticipants } from "../hooks/useParticipants";
import { IParticipant } from "../types/types";
import toast from "react-hot-toast";

const Participants: React.FC = () => {
    const { participants, loading, fetchParticipants, deleteParticipant, createParticipant } = useParticipants();
    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        club: "",
        gender: "MALE", // Default value
    });

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    const handleDeleteParticipant = async (id: number) => {
        try {
            await deleteParticipant(id);
            toast.success("Deltager slettet!");
            fetchParticipants(); // Opdater listerne efter sletning
        } catch (error) {
            toast.error("Der opstod en fejl ved sletning af deltageren.");
        }
    };

    const handleCreateParticipant = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { name, birthDate, club, gender } = formData;


        // Debugging logs
        console.log("Form data:", formData);


        try {
            const newParticipant: IParticipant = {
                id: 0,
                name,
                birthDate,
                club,
                gender: gender as 'MALE' | 'FEMALE',
            };

            console.log("New participant:", newParticipant);

            await createParticipant(newParticipant);
            toast.success("Deltager oprettet!");
            fetchParticipants();
            setFormData({ name: "", birthDate: "", club: "", gender: "MALE" });
        } catch (error) {
            toast.error("Der opstod en fejl ved oprettelse af deltageren.");
            console.error("Error creating participant:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;


        console.log("Input change:", name, value);

        setFormData({ ...formData, [name]: value });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="participants-container">
            <h1>Deltagere</h1>


            <form onSubmit={handleCreateParticipant}>
                <label>
                    Navn:
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </label>
                <label>
                    Alder:
                    <input type="number" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required />
                </label>
                <label>
                    Klub:
                    <input type="text" name="club" value={formData.club} onChange={handleInputChange} required />
                </label>
                <label>
                    Køn:
                    <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="MALE">Mand</option>
                        <option value="FEMALE">Kvinde</option>
                    </select>
                </label>
                <button type="submit">Opret deltager</button>
            </form>


            <ul className="participants-list">
                {participants.map((participant) => (
                    <li key={participant.id} className="participant-item">
                        <div>
                            <span className="participant-name">{participant.name}</span>
                            <span className="participant-details"> - {participant.birthDate} år - {participant.club} - {participant.gender}</span>
                        </div>
                        <button className="delete-button" onClick={() => handleDeleteParticipant(participant.id)}>Slet</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Participants;
