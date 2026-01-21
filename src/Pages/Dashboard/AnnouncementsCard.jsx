import { MoreVertical } from "lucide-react";
import { Card } from "../../Library/Card";


import React from 'react'

const AnnouncementsCard = () => {
    const notices = [
        { title: "Internal News", date: "09-Oct-2023" },
        { title: "Industry News", date: "09-Oct-2023" },
        { title: "Calendar Events", date: "09-Oct-2023" },
        { title: "Internal News", date: "09-Oct-2023" },
        { title: "Industry News", date: "09-Oct-2023" },
    ];
    return (
        <Card className="p-5 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">Announcements & Notice Board</h2>
                <MoreVertical size={18} className="text-gray-500 cursor-pointer" />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                {notices.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-700">
                        <span>{item.title}</span>
                        <span className="text-gray-500">{item.date}</span>
                    </div>
                ))}
            </div>
                
        </Card>
    )
}
export default AnnouncementsCard
