import React, { useState, useMemo, useEffect } from "react";
import { Card } from "../Lib/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../Lib/select";

// ⭐ ADD FRAMER MOTION
import { motion, AnimatePresence } from "framer-motion";

const MonthYearSelector = ({
  onChange = () => {},
  rangeFormat = "single",
  monthFormat = "short",
  showYear = true,
  showMonth = true,
  showMonthGrid = true,
  className = ""
}) => {

  // ---------------------------------------------
  // SYSTEM CONSTANTS
  // ---------------------------------------------
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0..11

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const longMonths = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
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
    const arr = [];
    for (let i = -5; i <= 5; i++) {
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
  }, [rangeFormat, currentYear]);

  const defaultYearItem =
    yearOptions.find((x) => x.start === currentYear) || yearOptions[5];

  const [selectedRangeItem, setSelectedRangeItem] =
    useState(defaultYearItem);

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
    >
      <div className="space-y-2 relative">
        
        {/* YEAR DROPDOWN */}
        <AnimatePresence>
          {showYear && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-end"
            >
              <Select
                value={selectedRangeItem.key}
                onValueChange={handleRangeItemSelect}
              >
                <SelectTrigger className="w-48 h-9 text-sm">
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-end"
            >
              <Select
                value={`${selectedMonth.monthIndex}`}
                onValueChange={(v) => {
                  const m = monthData[Number(v) - 1];
                  handleMonthSelect(m);
                }}
              >
                <SelectTrigger className="w-48 h-9 text-sm">
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
          <Card className={`w-full space-y-4 p-3 my-2 ${className}`}>
            <div className="flex overflow-x-auto gap-3 py-2 scrollbar-hide">
              {monthData.map((m) => {
                const active =
                  selectedMonth.monthIndex === m.monthIndex &&
                  selectedMonth.year === m.year;

                return (
                  <motion.div
                    key={`${m.year}-${m.monthIndex}`}
                    onClick={() => handleMonthSelect(m)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className={`min-w-[120px] h-[70px] rounded-xl px-3 py-2 cursor-pointer flex flex-col items-center justify-center transition-all ${
                      active
                        ? "bg-emerald-600 text-white scale-[1.03] shadow-lg"
                        : "bg-emerald-100 hover:bg-emerald-200"
                    }`}
                  >
                    <span className="text-sm font-semibold">{m.name}</span>
                    <span className="text-xs opacity-70">{m.year}</span>
                  </motion.div>
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
