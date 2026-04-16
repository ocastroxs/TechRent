'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminHeader from '@/components/AdminHeader';
import Footer from '@/components/Footer';
import StatCard from '@/components/ui/StatCard';
import ChartBar from '@/components/ui/ChartBar';
import ChartDonut from '@/components/ui/ChartDonut';
import StatusBadge from '@/components/ui/StatusBadge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useDashboard } from '@/hooks/useDashboard';
import { useChamados } from '@/hooks/useChamados';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertCircle, CheckCircle, Clock, AlertTriangle,
  Settings, Monitor, TrendingUp, Activity, RefreshCw,
  ChevronRight, BarChart2
} from 'lucide-react';

const statusChamadoColors = {
  aberto: '#3b82f6',
  em_atendimento: '#f59e0b',
  resolvido: '#22c55e',
  cancelado: '#ef4444',
};

const statusEquipColors = {
  disponivel: '#22c55e',
  alugado: '#3b82f6',
  manutencao: '#f97316',
};

const statusLabels = {
  aberto: 'Aberto',
  em_atendimento: 'Em Atendimento',
  resolvido: 'Resolvido',
  cancelado: 'Cancelado',
  disponivel: 'Disponível',
  alugado: 'Alugado',
  manutencao: 'Manutenção',
};

function AdminDashboard() {
  const { usuario } = useAuth();
  const { dashboardData, loading: loadingDashboard, buscarDadosAdmin } = useDashboard();
  const { chamados, listar: listarChamados } = useChamados();
  const { equipamentos, listar: listarEquipamentos } = useEquipamentos();
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([
      buscarDadosAdmin(),
      listarChamados(),
      listarEquipamentos(),
    ]);
    setIsLoading(false);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resumoChamados = dashboardData?.chamados || [];
  const resumoEquipamentos = dashboardData?.equipamentos || [];

  const totalChamados = resumoChamados.reduce((acc, item) => acc + Number(item.total), 0);
  const totalEquipamentos = resumoEquipamentos.reduce((acc, item) => acc + Number(item.total), 0);
  const chamadosAbertos = Number(resumoChamados.find(r => r.status === 'aberto')?.total || 0);
  const chamadosAtendimento = Number(resumoChamados.find(r => r.status === 'em_atendimento')?.total || 0);
  const chamadosResolvidos = Number(resumoChamados.find(r => r.status === 'resolvido')?.total || 0);

  // Dados para gráficos
  const chartChamados = resumoChamados.map(item => ({
    name: statusLabels[item.status] || item.status,
    total: Number(item.total),
    color: statusChamadoColors[item.status] || '#6366f1',
  }));

  const chartEquipamentos = resumoEquipamentos.map(item => ({
    name: statusLabels[item.status] || item.status,
    total: Number(item.total),
    color: statusEquipColors[item.status] || '#6366f1',
  }));

  // Últimos chamados
  const ultimosChamados = [...(chamados || [])].slice(0, 5);

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const horaAtualizada = lastUpdated
    ? lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Olá, {usuario?.nome?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p className="text-slate-400 mt-1">
              Visão geral do sistema TechRent
              {horaAtualizada && (
                <span className="ml-2 text-xs text-slate-500">· Atualizado às {horaAtualizada}</span>
              )}
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all duration-200 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {isLoading || loadingDashboard ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={BarChart2}
                label="Total de Chamados"
                value={totalChamados}
                color="text-indigo-400"
                bgColor="bg-indigo-500/10"
                borderColor="border-indigo-500/20"
                delay={0}
              />
              <StatCard
                icon={AlertTriangle}
                label="Chamados Abertos"
                value={chamadosAbertos}
                color="text-blue-400"
                bgColor="bg-blue-500/10"
                borderColor="border-blue-500/20"
                delay={100}
              />
              <StatCard
                icon={Clock}
                label="Em Atendimento"
                value={chamadosAtendimento}
                color="text-yellow-400"
                bgColor="bg-yellow-500/10"
                borderColor="border-yellow-500/20"
                delay={200}
              />
              <StatCard
                icon={CheckCircle}
                label="Resolvidos"
                value={chamadosResolvidos}
                color="text-green-400"
                bgColor="bg-green-500/10"
                borderColor="border-green-500/20"
                delay={300}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Chamados */}
              <div className="glass rounded-xl p-6 border border-slate-700/50 animate-fade-in-up delay-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Chamados por Status</h2>
                    <p className="text-slate-400 text-xs mt-1">Distribuição atual dos chamados</p>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Activity className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                {chartChamados.length > 0 ? (
                  <ChartDonut data={chartChamados} />
                ) : (
                  <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                    Nenhum chamado registrado
                  </div>
                )}
              </div>

              {/* Gráfico de Equipamentos */}
              <div className="glass rounded-xl p-6 border border-slate-700/50 animate-fade-in-up delay-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Equipamentos por Status</h2>
                    <p className="text-slate-400 text-xs mt-1">Estado atual do parque de TI</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Monitor className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                {chartEquipamentos.length > 0 ? (
                  <ChartBar data={chartEquipamentos} />
                ) : (
                  <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                    Nenhum equipamento registrado
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Últimos Chamados */}
              <div className="lg:col-span-2 glass rounded-xl p-6 border border-slate-700/50 animate-fade-in-up delay-400">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Últimos Chamados</h2>
                  <span className="text-xs text-slate-500">{chamados?.length || 0} no total</span>
                </div>

                {ultimosChamados.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                    <p className="text-sm">Nenhum chamado encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ultimosChamados.map((chamado) => (
                      <div
                        key={chamado.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-indigo-500/30 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-slate-500 font-mono w-8 flex-shrink-0">#{chamado.id}</span>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate group-hover:text-indigo-400 transition-colors">
                              {chamado.titulo}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{chamado.cliente_nome || chamado.equipamento_nome}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                          <StatusBadge status={chamado.status} showDot />
                          <span className="text-xs text-slate-500 hidden sm:block">{formatarData(chamado.aberto_em)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumo de Equipamentos */}
              <div className="glass rounded-xl p-6 border border-slate-700/50 animate-fade-in-up delay-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Equipamentos</h2>
                  <Link href="/admin/equipamentos">
                    <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors text-xs">
                      <Settings className="w-3.5 h-3.5" />
                      Gerenciar
                    </button>
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <span className="text-sm text-slate-300 font-medium">Total</span>
                    <span className="text-xl font-bold text-white">{totalEquipamentos}</span>
                  </div>
                  {resumoEquipamentos.map((item) => (
                    <div key={item.status} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                      <StatusBadge status={item.status} showDot />
                      <span className="text-lg font-bold text-white">{item.total}</span>
                    </div>
                  ))}
                </div>

                <Link href="/admin/equipamentos" className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 text-sm font-medium">
                  Ver todos os equipamentos
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
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
