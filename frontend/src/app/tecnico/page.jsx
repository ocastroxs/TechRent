'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import TechnicoHeader from '@/components/TechnicoHeader';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useChamados } from '@/hooks/useChamados';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertCircle, Clock, CheckCircle, AlertTriangle,
  XCircle, ChevronRight, Wrench, RefreshCw, Zap
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

const prioridadeOrder = { critica: 0, alta: 1, media: 2, baixa: 3 };

function TecnicoDashboard() {
  const { usuario } = useAuth();
  const { chamados, loading, error, listar } = useChamados();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ativos');

  const fetchData = async () => {
    setIsLoading(true);
    await listar();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const chamadosAtivos = [...(chamados || [])]
    .filter(c => c.status === 'aberto' || c.status === 'em_atendimento')
    .sort((a, b) => (prioridadeOrder[a.prioridade] ?? 2) - (prioridadeOrder[b.prioridade] ?? 2));

  const chamadosResolvidos = (chamados || []).filter(c => c.status === 'resolvido');

  const displayedChamados = activeTab === 'ativos' ? chamadosAtivos : chamadosResolvidos;

  const counts = {
    ativos: chamadosAtivos.length,
    resolvidos: chamadosResolvidos.length,
    criticos: chamadosAtivos.filter(c => c.prioridade === 'critica').length,
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <TechnicoHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Olá, {usuario?.nome?.split(' ')[0] || 'Técnico'} 🔧
            </h1>
            <p className="text-slate-400 mt-1">Painel de atendimento técnico</p>
          </div>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Summary cards */}
        {!isLoading && !error && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up">
            <div className="glass rounded-xl p-4 border border-blue-500/20 text-center">
              <p className="text-2xl font-bold text-blue-400">{counts.ativos}</p>
              <p className="text-xs text-slate-400 mt-1">Pendentes</p>
            </div>
            <div className="glass rounded-xl p-4 border border-red-500/20 text-center">
              <p className="text-2xl font-bold text-red-400">{counts.criticos}</p>
              <p className="text-xs text-slate-400 mt-1">Críticos</p>
            </div>
            <div className="glass rounded-xl p-4 border border-green-500/20 text-center">
              <p className="text-2xl font-bold text-green-400">{counts.resolvidos}</p>
              <p className="text-xs text-slate-400 mt-1">Resolvidos</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 mb-6 animate-fade-in">
          <button
            onClick={() => setActiveTab('ativos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'ativos'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            Pendentes
            {counts.ativos > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === 'ativos' ? 'bg-white/20' : 'bg-slate-700'}`}>
                {counts.ativos}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('resolvidos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'resolvidos'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Resolvidos
          </button>
        </div>

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
        ) : displayedChamados.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700 mb-6">
              {activeTab === 'ativos'
                ? <CheckCircle className="w-10 h-10 text-green-400" />
                : <Wrench className="w-10 h-10 text-slate-500" />
              }
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'ativos' ? 'Nenhum chamado pendente' : 'Nenhum chamado resolvido'}
            </h3>
            <p className="text-slate-400">
              {activeTab === 'ativos'
                ? 'Todos os chamados foram resolvidos! Bom trabalho! 🎉'
                : 'Os chamados resolvidos aparecerão aqui.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedChamados.map((chamado, i) => {
              const statusInfo = statusConfig[chamado.status] || statusConfig.aberto;
              const prioridadeInfo = prioridadeConfig[chamado.prioridade] || prioridadeConfig.media;
              const StatusIcon = statusInfo.icon;
              const isCritico = chamado.prioridade === 'critica';

              return (
                <Link key={chamado.id} href={`/tecnico/chamado/${chamado.id}`}>
                  <div
                    className={`glass rounded-xl p-5 border transition-all duration-200 cursor-pointer group card-hover animate-fade-in-up ${
                      isCritico ? 'border-red-500/30 hover:border-red-500/50' : 'border-slate-700/50 hover:border-indigo-500/40'
                    }`}
                    style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}
                  >
                    {isCritico && (
                      <div className="flex items-center gap-1.5 mb-3 text-red-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        PRIORIDADE CRÍTICA
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 p-2.5 rounded-xl border ${statusInfo.color} group-hover:scale-110 transition-transform duration-300`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {chamado.titulo}
                            </h3>
                            <p className="text-sm text-slate-400 mt-0.5">
                              <span className="text-slate-500">Solicitante:</span>{' '}
                              <span className="text-slate-300">{chamado.cliente_nome}</span>
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
                            <span className="hidden sm:inline">{chamado.equipamento_nome}</span>
                            <span className="hidden sm:inline">·</span>
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

export default function TecnicoPage() {
  return (
    <ProtectedRoute requiredRole="tecnico">
      <TecnicoDashboard />
    </ProtectedRoute>
  );
}
