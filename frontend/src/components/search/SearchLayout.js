"use client"

import Sidebar from "../home/Sidebar"
import RightSidebar from "../home/RightSidebar"

import { getUserByUsername } from "@/utils/accountsApi"
import { getUserProfile } from "@/utils/accountsApi"
import { useState, useEffect } from "react"

import SearchSelector from "./ResearchSelector"
import Searchbar from "./Searchbar"

const SearchLayout = () => {
    const [research, setResearch] = useState('');

    return (
        <div className="flex min-h-screen bg-[color:var(--background)]">
            <Sidebar />
            <div className="flex-1">
                <div className="w-full max-w-4xl p-4">
                    <Searchbar onSearch={setResearch} />
                </div>
                <div className="w-full max-w-4xl p-4">
                    <SearchSelector searchQuery={research} />
                </div>
            </div>
        </div>
    );
}

export default SearchLayout;
