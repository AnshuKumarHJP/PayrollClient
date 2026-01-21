import { Badge } from "@/Lib/badge";
import { ScrollArea } from "@/Lib/scroll-area";
import { Dot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";

export default function RequestsCard() {
    const requests = [
        { type: "New Laptop Request", status: "Accepted", date: "09-Oct-2023" },
        { type: "Loan Request", status: "Rejected", date: "08-Oct-2023" },
        { type: "Salary Request", status: "Pending", date: "05-Oct-2023" },
        { type: "Leaves Requests", status: "Pending", date: "05-Oct-2023" },
    ];

    const statusColor = {
        Accepted: "bg-emerald-500 text-white",
        Rejected: "bg-red-500 text-white",
        Pending: "bg-yellow-400 text-white",
    };

    return (
        <Card className="w-full">
            {/* Header */}
            <CardHeader>
                <CardTitle className="text-lg flex flex-wrap justify-between items-center gap-2">
                    <span>Requests</span>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center text-emerald-600 gap-1">
                            <Dot className="w-4 h-4 text-emerald-600" /> Approved
                        </span>
                        <span className="flex items-center text-red-600 gap-1">
                            <Dot className="w-4 h-4 text-red-600" /> Rejected
                        </span>
                        <span className="flex items-center text-yellow-500 gap-1">
                            <Dot className="w-4 h-4 text-yellow-500" /> Pending
                        </span>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent>
                {/* Table Header */}
                <div className="
                    grid grid-cols-3 
                    text-sm text-gray-500 
                    mb-2 px-1
                    max-sm:text-xs
                ">
                    <span>Request Type</span>
                    <span>Status</span>
                    <span>Date</span>
                </div>

                {/* Scrollable List */}
                <ScrollArea className="h-[170px] pr-1 w-full">
                    {requests.map((item, index) => (
                        <div
                            key={index}
                            className="
                                grid grid-cols-3 
                                items-center 
                                py-2 border-b last:border-none text-sm
                                max-sm:text-xs
                                max-sm:grid-cols-1
                                max-sm:gap-1
                            "
                        >
                            {/* Request Type */}
                            <span className="flex items-center gap-2">
                                <span className="text-gray-500">{index + 1}.</span>
                                {item.type}
                            </span>

                            {/* Status */}
                            <Badge
                                className={`
                                    ${statusColor[item.status]} 
                                    px-3 py-1 
                                    rounded-full 
                                    text-xs 
                                    w-fit mx-auto
                                `}
                            >
                                {item.status}
                            </Badge>

                            {/* Date */}
                            <span className="text-gray-600 text-right max-sm:text-left">
                                {item.date}
                            </span>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
