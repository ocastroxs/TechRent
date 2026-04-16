'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminHeader from '@/components/AdminHeader';
import { useDashboard } from '@/hooks/useDashboard';
import { useChamados } from '@/hooks/useChamados';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { AlertCircle, Loader2, CheckCircle, Clock, AlertTriangle, Settings } from 'lucide-react';

function AdminDashboard() {
  const { dashboardData, loading: loadingDashboard, buscarDadosAdmin } = useDashboard();
  const { chamados, listar: listarChamados } = useChamados();
  const { equipamentos, listar: listarEquipamentos } = useEquipamentos();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        buscarDadosAdmin(),
        listarChamados(),
        listarEquipamentos(),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, [buscarDadosAdmin, listarChamados, listarEquipamentos]);

  const getStatusColor = (status) => {
    const colors = {
      aberto: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      em_atendimento: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      resolvido: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.aberto;
  };

  const getEquipamentoStatusColor = (status) => {
    const colors = {
      operacional: 'bg-green-500/20 text-green-400 border-green-500/30',
      em_manutencao: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      desativado: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.operacional;
  };

  const resumoChamados = dashboardData?.chamados || [];
  const resumoEquipamentos = dashboardData?.equipamentos || [];

  const totalChamados = resumoChamados.reduce((acc, item) => acc + item.total, 0);
  const totalEquipamentos = resumoEquipamentos.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
          <p className="text-slate-400 mt-2">Visão geral do sistema TechRent</p>
        </div>

        {/* Conteúdo */}
        {isLoading || loadingDashboard ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Carregando dados do dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total de Chamados */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total de Chamados</p>
                    <p className="text-3xl font-bold text-white mt-2">{totalChamados}</p>
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Chamados Abertos */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Chamados Abertos</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">
                      {resumoChamados.find(r => r.status === 'aberto')?.total || 0}
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Chamados em Atendimento */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Em Atendimento</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">
                      {resumoChamados.find(r => r.status === 'em_atendimento')?.total || 0}
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Chamados Resolvidos */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Resolvidos</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">
                      {resumoChamados.find(r => r.status === 'resolvido')?.total || 0}
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/20 text-green-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Equipamentos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resumo de Equipamentos */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Equipamentos</h2>
                  <Link href="/admin/equipamentos">
                    <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Settings className="w-4 h-4" />
                      Gerenciar
                    </button>
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Total de Equipamentos</span>
                    <span className="text-lg font-bold text-white">{totalEquipamentos}</span>
                  </div>
                  {resumoEquipamentos.map((item) => (
                    <div key={item.status} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEquipamentoStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                      </span>
                      <span className="text-lg font-bold text-white">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo de Chamados por Status */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">Chamados por Status</h2>

                <div className="space-y-3">
                  {resumoChamados.map((item) => (
                    <div key={item.status} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                      </span>
                      <span className="text-lg font-bold text-white">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
