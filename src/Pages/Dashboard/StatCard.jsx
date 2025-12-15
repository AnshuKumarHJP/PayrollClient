import React from "react";
import { MoreVertical, User, FileText, UserPlus, TrendingUp, TrendingDown } from "lucide-react";

const iconMap = {
    employees: User,
    leaves: FileText,
    new: UserPlus,
};

const StatCard = ({ title, value, change, type = "employees" }) => {
    const Icon = iconMap[type] || User;

    const isNegative = change && change.startsWith("-");
    const changeColor = isNegative ? "text-red-500" : "text-green-600";
    const TrendIcon = isNegative ? TrendingDown : TrendingUp;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 w-full" >
            {/* Header */}
            <div className="flex justify-between items-start">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-emerald-100/50 flex items-center justify-center shadow-sm">
                    <Icon size={22} className="text-gray-700" />
                </div>

                {/* Menu Icon */}
                <MoreVertical size={20} className="text-gray-500 cursor-pointer" />
            </div>

            {/* Title */}
            <div className="mt-3 text-gray-600 text-sm">{title}</div>

            <div className="flex justify-between">
                {/* Value */}
                <div className="text-lg font-semibold text-gray-900">{value}</div>

                {/* Change Indicator */}
                {change && (
                    <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${changeColor}`}>
                        <TrendIcon size={16} />
                        {change}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
