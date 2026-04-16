'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function TechnicoHeader() {
  const { usuario, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/tecnico" className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600">
              <span className="text-lg font-bold text-white">TR</span>
            </div>
            <span className="hidden sm:inline text-lg font-bold text-white">TechRent</span>
          </Link>

          {/* Navegação */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/tecnico" className="text-slate-300 hover:text-white transition-colors">
              Painel
            </Link>
          </nav>

          {/* Usuário e Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-white">{usuario?.nome}</p>
              <p className="text-xs text-slate-400">Técnico</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
