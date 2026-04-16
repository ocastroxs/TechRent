'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Plus, Home } from 'lucide-react';

export default function ClientHeader() {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/cliente" className="flex items-center gap-3 group">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
              <span className="text-sm font-bold text-white">TR</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-none">TechRent</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Área do Cliente</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/cliente"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/cliente'
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              Meus Chamados
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/cliente/novo">
              <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Chamado</span>
                <span className="sm:hidden">Novo</span>
              </button>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">
                  {usuario?.nome?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white leading-none">{usuario?.nome}</p>
                <p className="text-xs text-slate-500 leading-none mt-0.5">{usuario?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ml-1"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
