import React from "react";
import { Search, Bell, MessageSquare, ChevronDown } from "lucide-react";

const AdminHeader = () => {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <h1 className="text-lg font-semibold text-gray-800 hidden md:block">Admin Dashboard</h1>

                {/* Search Bar */}
                <div className="relative ml-8 w-64 hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search in HRMS..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button className="relative text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <MessageSquare size={20} />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Adrian+M&background=random" alt="User" />
                    </div>
                    <div className="hidden md:block text-left">
                        <div className="text-sm font-semibold text-gray-800 leading-none">Adrian. M</div>
                        <div className="text-xs text-gray-500 mt-1">Admin</div>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
