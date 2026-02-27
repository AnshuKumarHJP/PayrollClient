import React from "react";
import { X, ChevronDown, Calendar, Download } from "lucide-react";

import ProfileCard from "./components/ProfileCard";
import LeaveChart from "./components/LeaveChart";
import LeaveStats from "./components/LeaveStats";
import AttendanceWidget from "./components/AttendanceWidget";
import TimeStats from "./components/TimeStats";

const EmployeeDashboard = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen font-sans p-6">
            <div className="flex-1 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            🏠 / Dashboard / Employee Dashboard
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                            <Download size={14} /> Export <ChevronDown size={14} />
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                            <Calendar size={14} /> 2024
                        </button>
                        <button className="p-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50">
                            <ChevronDown size={14} className="rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Alert Banner */}
                <div className="bg-cyan-50 border border-cyan-100 text-cyan-700 px-4 py-3 rounded-lg flex justify-between items-center text-sm">
                    <span>Your Leave Request on <span className="font-bold">"24th April 2024"</span> has been Approved!!!</span>
                    <button className="text-cyan-400 hover:text-cyan-600"><X size={16} /></button>
                </div>

                {/* Main Grid: Profile | LeaveChart | LeaveStats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[420px]">
                    <div className="lg:col-span-1 h-full">
                        <ProfileCard />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <LeaveChart />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <LeaveStats />
                    </div>
                </div>

                {/* Bottom Section: Attendance | TimeStats */}
                {/* Note: The image shows Attendance as a card on the left, and then 4 small cards on the right. 
                    Structure: 2 columns? Left col = Attendance (Large card?), Right col = Grid of 4 cards?
                    Actually looking at image bottom row:
                    Left: Attendance Card (Orange/White)
                    Right: 4 Stats Cards in a row.
                    
                    Wait, looking at the crop 4, Attendance is one card, and "Total Hours Today", "Total Hours Week" are separate cards next to it.
                    So it's a row of 5 cards effectively? Or 1 big card + 4 small.
                    Let's structure it as a grid of 5 columns or mix.
                */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/4">
                        <AttendanceWidget />
                    </div>
                    <div className="w-full lg:w-3/4">
                        <TimeStats />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboard;
