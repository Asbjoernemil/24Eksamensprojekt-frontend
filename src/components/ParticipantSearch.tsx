import React, { useState, useEffect } from 'react';

interface ParticipantSearchProps {
    onSearch: (searchTerm: string) => void;
}

const ParticipantSearch: React.FC<ParticipantSearchProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleImmediateSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name..."
            />
            <button onClick={handleImmediateSearch}>Search</button>
        </div>
    );
};

export default ParticipantSearch;
