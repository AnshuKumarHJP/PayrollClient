import { Mail } from "lucide-react";
import { Card } from "../../Library/Card";

import React from 'react'

const MyTeamCard = () => {
    const team = [
        { name: "Umair Ali", dept: "Devops" },
        { name: "Hassan", dept: "Front-end Developer" },
        { name: "Murtaza", dept: "UI UX Designer" },
        { name: "Amara", dept: "HR Manager" },
    ];
    return (
        <Card className="p-5 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">My Team</h2>
                <span className="text-blue-600 text-sm cursor-pointer">View All</span>
            </div>
             <div className="h-[190px] pr-1 ">
                {team.map((member, i) => (
                    <div key={i} className="flex items-center justify-between mb-1 border-b last:border-none pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{member.name}</p>    
                                <p className="text-xs text-gray-500">{member.dept}</p>
                            </div>
                        </div>
                        <Mail size={18} className="text-gray-400 cursor-pointer" />
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default MyTeamCard
