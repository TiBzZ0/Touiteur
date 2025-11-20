import React, { useState } from 'react';


const Searchbar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex items-center">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Rechercher..."
                className="w-full bg-[color:var(--color-brand-background)] rounded-full px-4 py-2 text-[color:var(--foreground)] placeholder-[color:var(--text-grey)] focus:ring-1 focus:ring-[rgba(139,92,246,0.3)] focus:outline-none"
            />
            <button
                type="submit"
                className="ml-2 px-4 py-2 rounded-full bg-[#007bff] text-white cursor-pointer"
            >
                Rechercher
            </button>
        </form>
    );
};

export default Searchbar;
