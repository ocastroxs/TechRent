'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, ChevronDown, Calendar, Tag, User, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedSearch({ onSearch, placeholder = "Buscar chamados, equipamentos ou clientes..." }) {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'todos',
    prioridade: 'todas',
    data: 'qualquer',
  });
  const filterRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.({ query, filters: activeFilters });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, activeFilters, onSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setActiveFilters({ status: 'todos', prioridade: 'todas', data: 'qualquer' });
  };

  const hasActiveFilters = activeFilters.status !== 'todos' || activeFilters.prioridade !== 'todas' || activeFilters.data !== 'qualquer';

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 relative z-40">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-12 pr-24 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-xl group-hover:bg-slate-800/80"
        />

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isFilterOpen || hasActiveFilters
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            ref={filterRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-3 p-6 glass rounded-2xl border border-slate-700/50 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['todos', 'aberto', 'em_atendimento', 'resolvido'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveFilters({ ...activeFilters, status: s })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        activeFilters.status === s
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Prioridade
                </label>
                <div className="flex flex-wrap gap-2">
                  {['todas', 'baixa', 'media', 'alta', 'critica'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setActiveFilters({ ...activeFilters, prioridade: p })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        activeFilters.prioridade === p
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Período
                </label>
                <div className="flex flex-wrap gap-2">
                  {['qualquer', 'hoje', 'semana', 'mes'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setActiveFilters({ ...activeFilters, data: d })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        activeFilters.data === d
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {d === 'qualquer' ? 'Qualquer data' : `Este ${d === 'mes' ? 'mês' : d}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-between">
              <p className="text-[10px] text-slate-500 font-medium">
                Dica: Use #ID para buscar um chamado específico
              </p>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Aplicar Filtros
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
