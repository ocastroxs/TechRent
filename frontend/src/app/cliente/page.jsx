'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useChamados } from '@/hooks/useChamados';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertCircle, Plus, Clock, CheckCircle, XCircle,
  AlertTriangle, ChevronRight, Filter, RefreshCw
} from 'lucide-react';

const statusConfig = {
  aberto: { label: 'Aberto', color: 'bg-blue-500/15 border-blue-500/30 text-blue-400', icon: AlertTriangle },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400', icon: Clock },
  resolvido: { label: 'Resolvido', color: 'bg-green-500/15 border-green-500/30 text-green-400', icon: CheckCircle },
  cancelado: { label: 'Cancelado', color: 'bg-red-500/15 border-red-500/30 text-red-400', icon: XCircle },
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
  media: { label: 'Média', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  alta: { label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  critica: { label: 'Crítica', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
};

function ClienteDashboard() {
  const { usuario } = useAuth();
  const { chamados, loading, error, listar } = useChamados();
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    const fetchChamados = async () => {
      await listar();
      setIsLoading(false);
    };
    fetchChamados();
  }, [listar]);

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const chamadosFiltrados = (chamados || []).filter(c =>
    filterStatus === 'todos' || c.status === filterStatus
  );

  // Contadores
  const counts = {
    total: chamados?.length || 0,
    aberto: chamados?.filter(c => c.status === 'aberto').length || 0,
    em_atendimento: chamados?.filter(c => c.status === 'em_atendimento').length || 0,
    resolvido: chamados?.filter(c => c.status === 'resolvido').length || 0,
  };

  const filterOptions = [
    { value: 'todos', label: `Todos (${counts.total})` },
    { value: 'aberto', label: `Abertos (${counts.aberto})` },
    { value: 'em_atendimento', label: `Em Atendimento (${counts.em_atendimento})` },
    { value: 'resolvido', label: `Resolvidos (${counts.resolvido})` },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <ClientHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Olá, {usuario?.nome?.split(' ')[0] || 'Cliente'} 👋
            </h1>
            <p className="text-slate-400 mt-1">Acompanhe seus chamados de suporte técnico</p>
          </div>
          <Link href="/cliente/novo">
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 self-start sm:self-auto">
              <Plus className="w-5 h-5" />
              Novo Chamado
            </button>
          </Link>
        </div>

        {/* Summary cards */}
        {!isLoading && !error && chamados?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up">
            {[
              { label: 'Abertos', value: counts.aberto, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { label: 'Em Atendimento', value: counts.em_atendimento, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
              { label: 'Resolvidos', value: counts.resolvido, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
            ].map((item) => (
              <div key={item.label} className={`glass rounded-xl p-4 border ${item.border} text-center`}>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-slate-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        {!isLoading && !error && chamados?.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 animate-fade-in">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterStatus === opt.value
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading || loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Erro ao carregar chamados</p>
              <p className="text-sm mt-1 opacity-80">{error}</p>
            </div>
          </div>
        ) : chamados.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 mb-6">
              <Plus className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum chamado aberto</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Você ainda não abriu nenhum chamado. Clique no botão abaixo para solicitar suporte.
            </p>
            <Link href="/cliente/novo">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25">
                <Plus className="w-5 h-5" />
                Abrir Primeiro Chamado
              </button>
            </Link>
          </div>
        ) : chamadosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-500 animate-fade-in">
            <p>Nenhum chamado com o status selecionado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chamadosFiltrados.map((chamado, i) => {
              const statusInfo = statusConfig[chamado.status] || statusConfig.aberto;
              const prioridadeInfo = prioridadeConfig[chamado.prioridade] || prioridadeConfig.media;
              const StatusIcon = statusInfo.icon;

              return (
                <Link key={chamado.id} href={`/cliente/chamado/${chamado.id}`}>
                  <div
                    className="glass rounded-xl p-5 border border-slate-700/50 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer group card-hover animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Status icon */}
                      <div className={`flex-shrink-0 p-2.5 rounded-xl border ${statusInfo.color} group-hover:scale-110 transition-transform duration-300`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {chamado.titulo}
                            </h3>
                            <p className="text-sm text-slate-400 mt-0.5">
                              <span className="text-slate-500">Equipamento:</span>{' '}
                              <span className="text-slate-300">{chamado.equipamento_nome}</span>
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <StatusBadge status={chamado.status} showDot />
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${prioridadeInfo.bg} ${prioridadeInfo.color}`}>
                              {prioridadeInfo.label}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-400 text-sm mt-2 line-clamp-1">{chamado.descricao}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="font-mono">#{chamado.id}</span>
                            <span>·</span>
                            <span>{formatarData(chamado.aberto_em)}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ClientePage() {
  return (
    <ProtectedRoute requiredRole="cliente">
      <ClienteDashboard />
    </ProtectedRoute>
  );
}
