'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ClientHeader from '@/components/ClientHeader';
import { useChamados } from '@/hooks/useChamados';
import { AlertCircle, Loader2, Plus, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const statusConfig = {
  aberto: {
    label: 'Aberto',
    color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    icon: AlertTriangle,
  },
  em_atendimento: {
    label: 'Em Atendimento',
    color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    icon: Clock,
  },
  resolvido: {
    label: 'Resolvido',
    color: 'bg-green-500/20 border-green-500/30 text-green-400',
    icon: CheckCircle,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-500/20 border-red-500/30 text-red-400',
    icon: XCircle,
  },
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'text-green-400' },
  media: { label: 'Média', color: 'text-yellow-400' },
  alta: { label: 'Alta', color: 'text-orange-400' },
  critica: { label: 'Crítica', color: 'text-red-400' },
};

function ClienteDashboard() {
  const { chamados, loading, error, listar } = useChamados();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChamados = async () => {
      await listar();
      setIsLoading(false);
    };
    fetchChamados();
  }, [listar]);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ClientHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com título e botão */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Meus Chamados</h1>
            <p className="text-slate-400 mt-2">Acompanhe o status de todos os seus chamados de suporte</p>
          </div>
          <Link href="/cliente/novo">
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
              <Plus className="w-5 h-5" />
              Novo Chamado
            </button>
          </Link>
        </div>

        {/* Conteúdo */}
        {isLoading || loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Carregando seus chamados...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Erro ao carregar chamados</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : chamados.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum chamado aberto</h3>
            <p className="text-slate-400 mb-6">Você ainda não abriu nenhum chamado. Clique no botão abaixo para começar.</p>
            <Link href="/cliente/novo">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                <Plus className="w-5 h-5" />
                Abrir Chamado
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {chamados.map((chamado) => {
              const statusInfo = statusConfig[chamado.status] || statusConfig.aberto;
              const prioridadeInfo = prioridadeConfig[chamado.prioridade] || prioridadeConfig.media;
              const StatusIcon = statusInfo.icon;

              return (
                <Link key={chamado.id} href={`/cliente/chamado/${chamado.id}`}>
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      {/* Conteúdo principal */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-lg border ${statusInfo.color}`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                              {chamado.titulo}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">
                              Equipamento: <span className="text-slate-300">{chamado.equipamento_nome}</span>
                            </p>
                          </div>
                        </div>

                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{chamado.descricao}</p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>ID: #{chamado.id}</span>
                          <span>•</span>
                          <span>Aberto em: {formatarData(chamado.aberto_em)}</span>
                          {chamado.atualizado_em && (
                            <>
                              <span>•</span>
                              <span>Atualizado em: {formatarData(chamado.atualizado_em)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status e prioridade */}
                      <div className="flex flex-col items-end gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border border-slate-600 ${prioridadeInfo.color}`}>
                          {prioridadeInfo.label}
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
