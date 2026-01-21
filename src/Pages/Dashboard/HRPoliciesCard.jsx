import { Download, ExternalLink, FileText } from "lucide-react";
import { Card } from "../../Library/Card";
import React from 'react'

const HRPoliciesCard = () => {
    const docs = [
        { name: "Attendance policy 13-Oct-23", icon: FileText },
        { name: "WFH policy 13-Oct-23", icon: FileText },
    ];
    return (
        <Card className="p-5 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">HR Policies</h2>
                <span className="text-sm text-blue-600 flex items-center gap-1 cursor-pointer">
                    <ExternalLink size={15} />
                    Open in Browser
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {docs.map((doc, i) => (
                    <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-4 text-center flex flex-col items-center"
                    >
                        <doc.icon size={40} className="text-red-500" />
                        <p className="text-xs mt-2 text-gray-700">{doc.name}</p>
                    </div>
                ))}
            </div>  
            <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download
                </button>
            </div>
        </Card>
    )
}

export default HRPoliciesCard
