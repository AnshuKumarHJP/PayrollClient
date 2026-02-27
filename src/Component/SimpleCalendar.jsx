import { useState, useRef, useEffect } from 'react';
import AppIcon from '../Component/AppIcon';

const SimpleCalendar = ({ selectedDate, onSelect, disablePast = false, disableFuture = false, minDate, maxDate }) => {
    // ... (currentDate state and helpers remain same)
    const [currentDate, setCurrentDate] = useState(selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : new Date());

    // Helpers
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const isDateDisabled = (day) => {
        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        dateToCheck.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (disablePast && dateToCheck < today) return true;
        if (disableFuture && dateToCheck > today) return true;

        if (minDate) {
            const min = new Date(minDate);
            min.setHours(0, 0, 0, 0);
            if (dateToCheck < min) return true;
        }

        if (maxDate) {
            const max = new Date(maxDate);
            max.setHours(0, 0, 0, 0);
            if (dateToCheck > max) return true;
        }

        return false;
    };

    const handleDateClick = (e, day) => {
        if (e) e.preventDefault(); // Prevent accidental form submission
        if (isDateDisabled(day)) return;
        // Re-construct the full date object
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        onSelect(newDate);
    };

    const renderDays = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanksArray = Array.from({ length: firstDay }, (_, i) => null);
        const allCells = [...blanksArray, ...daysArray];

        return (
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map(d => (
                    <div key={d} className="text-xs font-medium text-slate-400 py-1">{d}</div>
                ))}
                {allCells.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} className="h-8"></div>;

                    const isDisabled = isDateDisabled(day);

                    const isSelected = selectedDate && !isNaN(new Date(selectedDate)) &&
                        day === new Date(selectedDate).getDate() &&
                        currentDate.getMonth() === new Date(selectedDate).getMonth() &&
                        currentDate.getFullYear() === new Date(selectedDate).getFullYear();

                    const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={(e) => handleDateClick(e, day)}
                            disabled={isDisabled}
                            className={`h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all duration-200
                                ${isDisabled ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' :
                                    isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105' :
                                        isToday ? 'bg-slate-100 text-blue-600 font-bold border border-blue-200' :
                                            'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 hover:scale-110 active:scale-95'}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl w-72 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-800 dark:text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                <div className="flex gap-1">
                    <button type='button' onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-500">
                        <AppIcon name="ChevronLeft" size={16} />
                    </button>
                    <button type='button' onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-500">
                        <AppIcon name="ChevronRight" size={16} />
                    </button>
                </div>
            </div>
            {renderDays()}
        </div>
    );
};

export default SimpleCalendar;
