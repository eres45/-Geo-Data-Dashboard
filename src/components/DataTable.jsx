import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

const PAGE_SIZE = 50;

export default function DataTable({ data, selectedId, onRowClick, highlightedId, setHighlightedId }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('All');

    // Filter & Sort Logic
    const processedData = useMemo(() => {
        let result = [...data];

        // 1. Filter
        if (filterText) {
            const lower = filterText.toLowerCase();
            result = result.filter(item =>
                item.projectName.toLowerCase().includes(lower) ||
                item.status.toLowerCase().includes(lower)
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter(item => item.status === statusFilter);
        }

        // 2. Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, filterText, statusFilter, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(processedData.length / PAGE_SIZE);
    const currentData = processedData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const uniqueStatuses = ['All', ...new Set(data.map(item => item.status))];

    return (
        <div className="flex flex-col h-full">
            {/* Controls */}
            <div className="p-5 border-b border-white/5 flex flex-col gap-4 shrink-0">
                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <select
                            className="bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-8 text-sm text-slate-200 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 appearance-none cursor-pointer hover:bg-slate-800/50 transition-colors"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 flex justify-between items-center">
                    <span>{processedData.length} Projects Found</span>
                    <span>Page {currentPage} / {totalPages}</span>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-900/30 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-white/5 shrink-0 select-none">
                <div className="col-span-4 cursor-pointer flex items-center gap-1 hover:text-sky-400 transition-colors" onClick={() => requestSort('projectName')}>
                    PROJECT {sortConfig.key === 'projectName' && (sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div className="col-span-3 cursor-pointer flex items-center gap-1 hover:text-sky-400 transition-colors" onClick={() => requestSort('status')}>
                    STATUS {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
                <div className="col-span-3 text-right">Coordinates</div>
                <div className="col-span-2 text-right">Updated</div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto">
                {currentData.map(item => (
                    <div
                        key={item.id}
                        className={`grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-white/5 text-sm cursor-pointer transition-all duration-200
              ${selectedId === item.id ? 'bg-sky-500/10 border-l-2 border-l-sky-400 pl-[22px]' : 'border-l-2 border-l-transparent hover:bg-white/5'}
              ${highlightedId === item.id && selectedId !== item.id ? 'bg-white/5' : ''}
            `}
                        onClick={() => onRowClick(item)}
                        onMouseEnter={() => setHighlightedId(item.id)}
                        onMouseLeave={() => setHighlightedId(null)}
                    >
                        <div className="col-span-4 font-medium text-slate-200 truncate flex items-center gap-2">
                            {selectedId === item.id && <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />}
                            <span title={item.projectName}>{item.projectName}</span>
                        </div>
                        <div className="col-span-3 flex items-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border
                ${item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' :
                                    item.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        item.status === 'Maintenance' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                            'bg-slate-500/10 text-slate-400 border-slate-500/20'}
              `}>
                                {item.status}
                            </span>
                        </div>
                        <div className="col-span-3 text-right text-slate-500 text-xs font-mono flex items-center justify-end gap-1 opacity-70">
                            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                        </div>
                        <div className="col-span-2 text-right text-slate-500 text-xs flex items-center justify-end">
                            {new Date(item.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                ))}
                {currentData.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
                        <Search size={24} className="opacity-20" />
                        <span className="text-sm">No projects found matching your criteria</span>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-white/5 flex justify-between items-center bg-slate-900/20 shrink-0">
                <button
                    className="px-4 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 hover:bg-slate-700/50 transition-colors"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                >
                    Previous
                </button>
                <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        // Simple pagination logic for demo
                        let pageNum = currentPage;
                        if (currentPage < 3) pageNum = i + 1;
                        else if (currentPage > totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                            <button
                                key={pageNum}
                                className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${currentPage === pageNum
                                        ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                                        : 'text-slate-500 hover:bg-white/5'
                                    }`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        )
                    })}
                </div>
                <button
                    className="px-4 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 hover:bg-slate-700/50 transition-colors"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
