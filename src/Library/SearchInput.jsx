import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => (

  <div className="relative w-full flex-1">
    {/* Search Icon */}
    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
    {/* Input */}
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl bg-white dark:bg-slate-800 pl-11 pr-4 py-3 text-sm font-medium
                                    text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500
                                     shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all duration-200  focus:outline-none
                                      focus:ring-2 focus:ring-indigo-500/30 focus:shadow-md hover:ring-slate-300 dark:hover:ring-slate-600"/>
  </div>
);

export default SearchInput;
