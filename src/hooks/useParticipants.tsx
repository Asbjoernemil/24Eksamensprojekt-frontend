import { useEffect, useState } from "react";
import { HttpException, handleHttpErrors, makeOptions } from "../utils/fetchUtils";
import toast from "react-hot-toast";
import { IParticipant } from "../types/types";
import API_BASE_URL from "../settings";

export const useParticipants = () => {
    const PARTICIPANT_URL = API_BASE_URL + '/participants';
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchParticipants = async () => {
        try {
            const res = await fetch(PARTICIPANT_URL);
            const data = await handleHttpErrors(res);
            return data; // Return data to be set in setParticipants
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error('Der skete en uventet fejl');
            }
            throw error; // Rethrow the error to propagate it further if needed
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchParticipants();
                setParticipants(data);
            } catch (error) {

                console.error('Error fetching participants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures it runs only once on mount


    const fetchParticipantsById = async (id: number) => {
        try {
            const res = await fetch(PARTICIPANT_URL + "/" + id);
            const data = await handleHttpErrors(res);
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error("Der skete en uventet fejl");
            }
        }
    }

    const createParticipant = async (participant: IParticipant) => {
        try {
            const options = makeOptions("POST", participant);
            const res = await fetch(PARTICIPANT_URL, options);
            const data = await handleHttpErrors(res);
            setParticipants(prev => [...prev, data]);
            toast.success("Deltager oprettet");
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error("Der skete en uventet fejl");
            }
        }
    };


    const updateParticipant = async (participant: Partial<IParticipant>) => {
        try {
            const options = makeOptions("PUT", participant);
            const res = await fetch(PARTICIPANT_URL + "/" + participant.id, options);
            const data = await handleHttpErrors(res);
            setParticipants(prev => prev.map(p => p.id === data.id ? data : p));
            toast.success("Deltager opdateret");
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error("Der skete en uventet fejl");
            }
        }
    }

    const deleteParticipant = async (id: number) => {
        try {
            const options = makeOptions("DELETE", null);
            const res = await fetch(PARTICIPANT_URL + "/" + id, options);
            await handleHttpErrors(res);

            // Opdater participants kun hvis sletning er succesfuld
            setParticipants(prev => prev.filter(p => p.id !== id));

            toast.success("Deltager slettet");
        } catch (error) {
            console.error("Error deleting participant:", error);

            if (error instanceof HttpException) {
                toast.error(error.message);
            }

        }
    };


    return { participants, loading, fetchParticipants, fetchParticipantsById, createParticipant, updateParticipant, deleteParticipant };
};