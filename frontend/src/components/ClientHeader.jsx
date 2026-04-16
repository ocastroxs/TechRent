'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Plus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClientHeader() {
  const { usuario, logout } = useAuth();

  return (
    <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
              <span className="text-lg font-bold text-white">TR</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TechRent</h1>
              <p className="text-xs text-slate-400">Área do Cliente</p>
            </div>
          </div>

          {/* Navegação e ações */}
          <div className="flex items-center gap-4">
            {/* Botão Novo Chamado */}
            <Link href="/cliente/novo">
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Novo Chamado
              </Button>
            </Link>

            {/* Menu do usuário */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{usuario?.nome}</p>
                <p className="text-xs text-slate-400">{usuario?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-red-400"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
