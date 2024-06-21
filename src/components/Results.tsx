import React, { useEffect, useState } from "react";
import { IResult } from "../types/types";
import toast from "react-hot-toast";
import useResults from "../hooks/UseResults";


const Results: React.FC = () => {
    const { results, loading, fetchResults, deleteResult, fetchResultsByParticipantId, fetchResultsByParticipantName, editResult } = useResults();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState<"id" | "name">("id");

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const handleDeleteResult = async (id: number) => {
        try {
            await deleteResult(id);
            toast.success("Resultat slettet!");
            window.location.reload();
        } catch (error) {
            toast.error("Der opstod en fejl ved sletning af resultatet.");
        }
    };

    const handleUpdateResult = async (id: number) => {


        const result = results.find(result => result.id === id);
        if (!result) {
            toast.error("Kunne ikke finde resultatet");
            return;
        }

        const newResultValue = prompt("Indtast ny værdi for resultatet", result.resultValue);
        if (!newResultValue) {
            return;
        }

        try {
            await editResult(id, { resultValue: newResultValue });
            toast.success("Resultat opdateret!");
            fetchResults();

        } catch (error) {
            toast.error("Der opstod en fejl ved opdatering af resultatet.");
        }
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchType === "id") {
            await fetchResultsByParticipantId(Number(searchTerm));
        } else {
            await fetchResultsByParticipantName(searchTerm);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchType(e.target.value as "id" | "name");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Resultater</h1>


            {/* Søgeformular til at finde resultater */}
            <form onSubmit={handleSearch}>
                <label>
                    Søg efter:
                    <select value={searchType} onChange={handleSearchTypeChange}>
                        <option value="id">Deltager ID</option>
                        <option value="name">Deltager navn</option>
                    </select>
                </label>
                <label>
                    Søg:
                    <input type="text" value={searchTerm} onChange={handleInputChange} required />
                </label>
                <button type="submit">Søg</button>
            </form>

            {/* List of results */}
            <ul>
                {results.map((result: IResult) => (
                    <li key={result.id}>
                        {result.participantName} - {result.disciplineName} - {result.date} - {result.resultValue}
                        <button onClick={() => handleDeleteResult(result.id)}>Slet</button>
                        <button onClick={() => handleUpdateResult(result.id)}>Opdater</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Results;
