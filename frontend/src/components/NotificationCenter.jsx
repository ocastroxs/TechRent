'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, AlertCircle, Clock, CheckCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const mockNotifications = [
  { id: 1, type: 'status', title: 'Chamado Resolvido', message: 'Seu chamado #102 foi finalizado pelo técnico.', time: new Date(Date.now() - 1000 * 60 * 15), read: false, icon: CheckCircle, color: 'text-green-400' },
  { id: 2, type: 'alert', title: 'Novo Chamado Crítico', message: 'Um novo chamado de alta prioridade foi aberto.', time: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false, icon: AlertCircle, color: 'text-red-400' },
  { id: 3, type: 'info', title: 'Manutenção Agendada', message: 'O sistema ficará instável hoje às 22h.', time: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true, icon: Clock, color: 'text-blue-400' },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 glass rounded-2xl border border-slate-700/50 shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Notificações
                {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px]">{unreadCount} novas</span>}
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-semibold text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-wider"
                >
                  Lidas
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm">Nenhuma notificação por aqui.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-slate-800/40 transition-colors relative group ${!n.read ? 'bg-indigo-500/[0.03]' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center flex-shrink-0 ${n.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-bold truncate ${!n.read ? 'text-white' : 'text-slate-400'}`}>
                                {n.title}
                              </p>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap mt-0.5">
                                {formatDistanceToNow(n.time, { addSuffix: true, locale: ptBR })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              {!n.read && (
                                <button 
                                  onClick={() => markAsRead(n.id)}
                                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Marcar como lida
                                </button>
                              )}
                              <button 
                                onClick={() => removeNotification(n.id)}
                                className="text-[10px] font-bold text-slate-500 hover:text-red-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" /> Remover
                              </button>
                            </div>
                          </div>
                        </div>
                        {!n.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-800/30 border-t border-slate-700/50 text-center">
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Ver todas as notificações
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
