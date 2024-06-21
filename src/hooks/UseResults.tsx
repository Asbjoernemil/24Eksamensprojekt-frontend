import { useState, useEffect } from "react";
import { IResult } from "../types/types";
import { handleHttpErrors, HttpException, makeOptions } from "../utils/fetchUtils";
import toast from "react-hot-toast";
import API_BASE_URL from "../settings";

function useResults() {
    const RESULTS_URL = API_BASE_URL + "/results";
    const [results, setResults] = useState<IResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchResults = async () => {
        try {
            const res = await fetch(RESULTS_URL);
            const data = await handleHttpErrors(res);
            return data;
            console.log("Results fetched successfully:", data);
        } catch (error) {
            console.error("Error fetching results:", error);
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error("Der skete en uventet fejl");
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchResults();
                setResults(data);
                console.log("Results fetched successfully:", data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        return () => { };
    }, []);

    const fetchResultsById = async (id: number) => {
        try {
            const res = await fetch(RESULTS_URL + "/" + id);
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

    const fetchResultsByParticipantId = async (participantId: number) => {
        setLoading(true);
        try {
            const res = await fetch(`${RESULTS_URL}/participant/${participantId}`);
            const data = await res.json();
            setResults(data);
        } catch (error) {
            toast.error("Der opstod en fejl ved hentning af resultater for deltager.");
        } finally {
            setLoading(false);
        }
    };

    const fetchResultsByParticipantName = async (name: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${RESULTS_URL}/participant/name/${name}`);
            const data = await res.json();
            setResults(data);
        } catch (error) {
            toast.error("Der opstod en fejl ved hentning af resultater for deltager.");
        } finally {
            setLoading(false);
        }
    };

    const createResult = async (result: Partial<IResult>) => {
        try {
            const options = makeOptions("POST", result);
            const res = await fetch(RESULTS_URL, options);
            const data = await handleHttpErrors(res);
            setResults(prev => [...prev, data]);
            toast.success("Resultat oprettet");
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error("Der skete en uventet fejl");
            }
        }
    }

    const editResult = async (id: number, result: Partial<IResult>) => {
        try {
            const options = makeOptions("PUT", result);
            const res = await fetch(RESULTS_URL + "/" + id, options);
            if (!res.ok) {
                throw new Error(`Server returned ${res.status} ${res.statusText}`);
            }
            const data = await handleHttpErrors(res);

            // Opdater local state med det opdaterede resultat
            setResults(prevResults =>
                prevResults.map(prevResult => prevResult.id === data.id ? data : prevResult)
            );

            toast.success("Resultat opdateret");
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error("Der skete en uventet fejl");
                console.error("Unexpected error occurred:", error); // Log fejlen til konsollen for yderligere fejlfinding
            }
            throw error; // Sørg for at kaste fejlen videre, så den kan håndteres korrekt i calling code
        }
    };



    const deleteResult = async (id: number) => {
        try {
            const options = makeOptions("DELETE", null);
            const res = await fetch(RESULTS_URL + "/" + id, options);
            await handleHttpErrors(res);

            setResults(prevResults => prevResults.filter(result => result.id !== id));

            toast.success("Resultat slettet");
        } catch (error) {
            if (error instanceof HttpException) {
                toast.error(error.message);
            } else {
                toast.error("Der skete en uventet fejl");
            }
        }
    }
    return { results, loading, fetchResultsById, createResult, deleteResult, fetchResults, fetchResultsByParticipantName, fetchResultsByParticipantId, editResult };



}

export default useResults;
