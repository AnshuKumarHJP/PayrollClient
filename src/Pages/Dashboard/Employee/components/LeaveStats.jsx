import React from "react";
import { Settings } from "lucide-react";

const LeaveStats = () => {
    return (
        <div className="bg-white rounded-xl shadow p-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800">Leave Details</h3>
                <div className="flex gap-2">
                    <button className="text-xs border px-2 py-1 rounded flex items-center gap-1 text-gray-500">
                        2024
                    </button>
                    <button className="p-1.5 bg-orange-500 rounded text-white">
                        <Settings size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                    <div className="text-xs text-gray-400 mb-1">Total Leaves</div>
                    <div className="text-xl font-bold text-gray-800">16</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 mb-1">Taken</div>
                    <div className="text-xl font-bold text-gray-800">10</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 mb-1">Absent</div>
                    <div className="text-xl font-bold text-gray-800">2</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 mb-1">Request</div>
                    <div className="text-xl font-bold text-gray-800">0</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 mb-1">Worked Days</div>
                    <div className="text-xl font-bold text-gray-800">240</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 mb-1">Loss of Pay</div>
                    <div className="text-xl font-bold text-gray-800">2</div>
                </div>
            </div>

            <button className="w-full mt-auto py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                Apply New Leave
            </button>
        </div>
    );
};

export default LeaveStats;
