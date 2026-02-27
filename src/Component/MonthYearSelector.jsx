import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card } from "../Library/Card";
import AppIcon from "./AppIcon";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Library/Select";

// ⭐ ADD FRAMER MOTION
import { motion, AnimatePresence } from "framer-motion";

const MonthYearSelector = ({
  onChange = () => { },
  rangeFormat = "single",
  monthFormat = "short",
  showYear = true,
  showMonth = true,
  showMonthGrid = true,
  className = "",
  yearRange = 3, // Default +/- 3 years
  customYearOptions = null // Optional override
}) => {

  // ---------------------------------------------
  // SYSTEM CONSTANTS
  // ---------------------------------------------
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0..11

  // ... (keeping existing constants)
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const longMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const pad = (n) => String(n).padStart(2, "0");
  const isoLocal = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // ---------------------------------------------
  // FORMATTERS
  // ---------------------------------------------
  const formatMonthLabel = (monthIndex, year) => {
    const short = months[monthIndex - 1];
    const long = longMonths[monthIndex - 1];

    switch (monthFormat) {
      case "short": return short;
      case "long": return long;
      case "shortYear": return `${short} ${year}`;
      case "longYear": return `${long} ${year}`;
      case "num": return pad(monthIndex);
      case "numYear": return `${pad(monthIndex)}/${year}`;
      case "rangeShort": return `${short} - ${months[(monthIndex % 12)]}`;
      case "rangeLong": return `${long} - ${longMonths[(monthIndex % 12)]}`;
      case "quarter":
        const q = Math.ceil(monthIndex / 3);
        return `Q${q} (${months[(q - 1) * 3]}–${months[q * 3 - 1]})`;
      case "full":
        const days = new Date(year, monthIndex, 0).getDate();
        return `${long} ${year} (${days} days)`;
      default:
        return short;
    }
  };

  const formatYearLabel = (start, end) => {
    switch (rangeFormat) {
      case "single": return `${start}`;
      case "calendar": return `Jan ${start} - Dec ${start}`;
      case "fy": return `FY ${start}-${end}`;
      case "aprmar": return `Apr ${start} - Mar ${end}`;
      case "yearRange": return `${start} - ${end}`;
      case "halfyear": return `H1/H2 ${start}`;
      case "rolling": return `${start - 1} - ${start}`;
      case "rollingFY": return `FY ${start - 1}-${start}`;
      case "shortFY": return `FY-${String(start).slice(2)}-${String(end).slice(2)}`;
      case "fullFY": return `Financial Year ${start}-${end}`;
      default:
        return `${start}`;
    }
  };

  // ---------------------------------------------
  // YEAR OPTIONS
  // ---------------------------------------------
  const yearOptions = useMemo(() => {
    if (customYearOptions) return customYearOptions;

    const arr = [];
    const spread = Math.floor(yearRange);

    // If yearRange is 2, it loops -2 to 2.
    // However, user prompt said "if send 2 thne one past and one future".
    // This implies yearRange might be the TOTAL count of neighbors? 
    // Or maybe they meant `spread = yearRange / 2`?
    // Given ambiguity, I will stick to "yearRange is the +/- radius".
    // If the user wants 1 past/1 future, they should send 1.
    // If they send 2, they get 2 past/2 future. 
    // To support "send 2 -> 1 past/1 future", I could assume yearRange is diameter?
    // No, standard convention is radius. I'll stick to radius.

    for (let i = -spread; i <= spread; i++) {
      const start = currentYear + i;
      const end = start + 1;
      arr.push({
        key: `${rangeFormat}_${start}`,
        start,
        end,
        label: formatYearLabel(start, end),
      });
    }
    return arr;
  }, [rangeFormat, currentYear, yearRange, customYearOptions]);

  const defaultYearItem =
    yearOptions.find((x) => x.start === currentYear) || yearOptions[yearRange] || yearOptions[0];

  const [selectedRangeItem, setSelectedRangeItem] =
    useState(defaultYearItem);

  const scrollRef = useRef(null);

  // ---------------------------------------------
  // MONTH OPTIONS
  // ---------------------------------------------
  const monthData = months.map((m, i) => ({
    name: m,
    monthIndex: i + 1,
    year: selectedRangeItem.start,
  }));

  const defaultMonth = monthData[currentMonthIndex];
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  // ---------------------------------------------
  // MAIN PAYROLL OBJECT
  // ---------------------------------------------
  const buildPayrollObject = (m, selectedRange) => {
    const year = m.year;
    const month = m.monthIndex;

    const totalDays = new Date(year, month, 0).getDate();
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month - 1, totalDays);

    const fyStart = month >= 4 ? year : year - 1;
    const fyEnd = fyStart + 1;

    const formatDM = (date) =>
      `${date.getDate()} ${months[date.getMonth()]}`;

    return {
      year,
      month,
      monthName: m.name,

      totalDays,
      firstDay: isoLocal(first),
      lastDay: isoLocal(last),

      yyyy_mm: `${year}-${pad(month)}`,
      yyyymm: `${year}${pad(month)}`,

      payrollPeriod: `${formatDM(first)} - ${formatDM(last)}, ${year}`,
      financialYear: `FY ${fyStart}-${fyEnd}`,
      quarter: `Q${Math.ceil(month / 3)}`,

      startLabel: `${pad(first.getDate())} ${months[first.getMonth()]} ${year}`,
      endLabel: `${pad(last.getDate())} ${months[last.getMonth()]} ${year}`,

      monthLabel: formatMonthLabel(month, year),
      range: selectedRange,
    };
  };

  // ---------------------------------------------
  // FIRE DEFAULT ON FIRST LOAD
  // ---------------------------------------------
  useEffect(() => {
    const payload = buildPayrollObject(defaultMonth, defaultYearItem);
    onChange(payload);
  }, []);

  // ---------------------------------------------
  // HANDLERS
  // ---------------------------------------------
  const handleMonthSelect = (m) => {
    setSelectedMonth(m);
    const full = buildPayrollObject(m, selectedRangeItem);
    onChange(full);
  };

  const handleRangeItemSelect = (key) => {
    const item = yearOptions.find((it) => it.key === key);
    if (!item) return;

    setSelectedRangeItem(item);

    const newMonth = {
      ...selectedMonth,
      year: item.start,
    };

    setSelectedMonth(newMonth);

    const full = buildPayrollObject(newMonth, item);
    onChange(full);
  };

  // ---------------------------------------------
  // UI START
  // ---------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`w-full relative ${className}`}
    >
      <div className="flex gap-3 relative w-full">

        {/* YEAR DROPDOWN */}
        <AnimatePresence>
          {showYear && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 min-w-0"
            >
              <Select
                value={selectedRangeItem.key}
                onValueChange={handleRangeItemSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((it) => (
                    <SelectItem key={it.key} value={it.key}>
                      {it.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MONTH DROPDOWN */}
        <AnimatePresence>
          {showMonth && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 min-w-0 "
            >
              <Select
                value={`${selectedMonth.monthIndex}`}
                onValueChange={(v) => {
                  const m = monthData[Number(v) - 1];
                  handleMonthSelect(m);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>

                <SelectContent>
                  {monthData.map((m) => (
                    <SelectItem key={m.monthIndex} value={`${m.monthIndex}`}>
                      {formatMonthLabel(m.monthIndex, m.year)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MONTH GRID */}
      {showMonthGrid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-full overflow-hidden space-y-4 p-2 my-2 bg-white items-center dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 shadow-none relative group px-4">

            {/* Left Nav Button */}
            <button
              className="absolute -left-1 z-20 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-white/60 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0"
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
              }}
            >
              <AppIcon name="ChevronLeft" size={18} className="mr-0.5" />
            </button>

            {/* Right Nav Button */}
            <button
              className="absolute -right-1 z-20 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-white/60 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
              }}
            >
              <AppIcon name="ChevronRight" size={18} className="ml-0.5" />
            </button>


            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-3 py-3 px-1 scrollbar-hide snap-x relative mask-gradient"
              onWheel={(e) => {
                if (scrollRef.current) {
                  scrollRef.current.scrollLeft += e.deltaY;
                }
              }}
            >
              {monthData.map((m) => {
                const active =
                  selectedMonth.monthIndex === m.monthIndex &&
                  selectedMonth.year === m.year;

                return (
                  <motion.button
                    key={`${m.year}-${m.monthIndex}`}
                    onClick={() => handleMonthSelect(m)}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className={`
                      relative
                      min-w-[100px] sm:min-w-[110px] flex-1 h-[68px] rounded-lg cursor-pointer 
                      flex flex-col items-center justify-center transition-all duration-300 snap-center select-none
                      outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 dark:focus:ring-offset-slate-900
                      ${active
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-0"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    <span className={`text-[14px] font-bold tracking-wide pointer-events-none ${active ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                      {m.name}
                    </span>
                    <span className={`text-[11px] mt-0.5 font-medium pointer-events-none ${active ? "text-blue-100" : "text-slate-400"}`}>
                      {m.year}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MonthYearSelector;
