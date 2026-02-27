import React from "react";
import { LayoutDashboard, Users, FileText, Briefcase, UserCheck, Settings, Layers, User } from "lucide-react";

const AdminSidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", active: true },
        { icon: Users, label: "Employees" },
        { icon: UserCheck, label: "Attendance" },
        { icon: Layers, label: "Projects" },
        { icon: Users, label: "Clients" },
        { icon: Briefcase, label: "Jobs" },
        { icon: FileText, label: "Payroll" },
        { icon: FileText, label: "Reports" },
        { icon: Settings, label: "Settings" },
    ];

    return (
        <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 overflow-y-auto z-50 font-sans">
            <div className="p-6 flex items-center gap-2">
                {/* Logo simulation */}
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">S</div>
                <span className="font-bold text-xl text-gray-800">Smart<span className="text-orange-500">HR</span></span>
            </div>

            <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Main Menu</div>
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <div
                            key={item.label}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium
                  ${item.active
                                    ? "bg-orange-50 text-orange-500"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </div>
                    ))}
                </nav>
            </div>

            <div className="px-4 py-2 mt-4">
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Organization</div>
                <nav className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 text-sm font-medium">
                        <User size={18} /> Profile
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
