import React, { useState, useEffect } from 'react';
import { getTeamUsers } from "../../PayrollChecklistService";

const TeamActiveCard = ({ members = [] }) => {
    const [teamUsers, setTeamUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getTeamUsers();
                setTeamUsers(data);
            } catch (error) {
                console.error("Failed to fetch team users", error);
            }
        };
        fetchUsers();
    }, []);
    // Mocking members if none provided
    const displayMembers = members.length > 0 ? members : teamUsers;

    const extraCount = Math.max(0, displayMembers.length - 4);
    const totalWorking = displayMembers.length;

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[2rem] shadow-lg shadow-indigo-200 dark:shadow-none min-w-[280px]">
            <h3 className="text-white text-lg font-bold mb-4 tracking-tight">Team Active</h3>

            <div className="flex items-center mb-4">
                <div className="flex -space-x-3 overflow-hidden">
                    {displayMembers.slice(0, 4).map((member, i) => (
                        <div key={i} className="relative group">
                            <img
                                className="inline-block h-10 w-10 rounded-full ring-2 ring-indigo-500/50 object-cover"
                                src={member.avatar}
                                alt={member.name}
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-indigo-600 rounded-full shadow-sm"></div>
                        </div>
                    ))}

                    {/* The +2 bubble */}
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white ring-2 ring-indigo-500/50 text-indigo-700 text-xs font-black shadow-inner">
                        +{extraCount || 2}
                    </div>
                </div>
            </div>

            <p className="text-white/90 text-sm font-bold tracking-wide">
                {totalWorking} members working now
            </p>
        </div>
    );
};

export default TeamActiveCard;
