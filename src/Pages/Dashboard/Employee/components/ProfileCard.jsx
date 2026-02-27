import React from "react";
import { Edit } from "lucide-react";

const ProfileCard = () => {
    const user = {
        name: "Stephan Peralt",
        role: "Senior Product Designer",
        subRole: "UI/UX Design",
        phone: "+1 324 3453 545",
        email: "Steperde124@example.com",
        office: "Doglas Martini",
        joined: "15 Jan 2024",
        avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    };

    return (
        <div className="bg-white rounded-xl shadow p-5 h-full flex flex-col justify-between">
            {/* Header Black Card */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 text-white relative">
                <div className="w-12 h-12 rounded-full border-2 border-orange-500 overflow-hidden">
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <div className="text-xs text-gray-300 flex items-center gap-2">
                        {user.role} <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> <span className="text-orange-400">{user.subRole}</span>
                    </div>
                </div>
                <button className="absolute top-4 right-4 p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                    <Edit size={14} className="text-gray-300" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6 px-1">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Phone Number</label>
                    <div className="text-sm font-medium text-gray-800">{user.phone}</div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Email Address</label>
                    <div className="text-sm font-medium text-gray-800">{user.email}</div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Report Office</label>
                    <div className="text-sm font-medium text-gray-800">{user.office}</div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Joined on</label>
                    <div className="text-sm font-medium text-gray-800">{user.joined}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
