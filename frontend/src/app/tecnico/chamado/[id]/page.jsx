'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import TechnicoHeader from '@/components/TechnicoHeader';
import { useChamados } from '@/hooks/useChamados';
import { useManutencao } from '@/hooks/useManutencao';
import { AlertCircle, Loader2, ArrowLeft, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const statusConfig = {
  aberto: {
    label: 'Aberto',
    color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    icon: AlertTriangle,
    description: 'Aguardando atendimento',
  },
  em_atendimento: {
    label: 'Em Atendimento',
    color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    icon: Clock,
    description: 'Sendo atendido por um técnico',
  },
  resolvido: {
    label: 'Resolvido',
    color: 'bg-green-500/20 border-green-500/30 text-green-400',
    icon: CheckCircle,
    description: 'Problema resolvido com sucesso',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-500/20 border-red-500/30 text-red-400',
    icon: XCircle,
    description: 'Chamado cancelado',
  },
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'text-green-400' },
  media: { label: 'Média', color: 'text-yellow-400' },
  alta: { label: 'Alta', color: 'text-orange-400' },
  critica: { label: 'Crítica', color: 'text-red-400' },
};

function DetalheChamadoTecnico() {
  const params = useParams();
  const router = useRouter();
  const { buscarPorId, atualizarStatus, loading: loadingChamado } = useChamados();
  const { registrar: registrarManutencao, loading: loadingManutencao } = useManutencao();
  const [chamado, setChamado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [descricaoReparo, setDescricaoReparo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChamado = async () => {
      const result = await buscarPorId(params.id);
      if (result.success) {
        setChamado(result.data);
      }
      setIsLoading(false);
    };
    fetchChamado();
  }, [params.id, buscarPorId]);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleIniciarAtendimento = async () => {
    setError('');
    const result = await atualizarStatus(chamado.id, 'em_atendimento');
    if (result.success) {
      setChamado({ ...chamado, status: 'em_atendimento' });
    } else {
      setError(result.error || 'Erro ao iniciar atendimento');
    }
  };

  const handleFinalizarChamado = async () => {
    if (!descricaoReparo.trim()) {
      setError('Descreva o reparo realizado');
      return;
    }

    if (descricaoReparo.trim().length < 10) {
      setError('Descrição deve ter pelo menos 10 caracteres');
      return;
    }

    setError('');
    const result = await registrarManutencao(chamado.id, descricaoReparo);
    if (result.success) {
      setChamado({ ...chamado, status: 'resolvido' });
      setShowModal(false);
      setDescricaoReparo('');
      setTimeout(() => {
        router.push('/tecnico');
      }, 2000);
    } else {
      setError(result.error || 'Erro ao registrar manutenção');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TechnicoHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão voltar */}
        <Link href="/tecnico">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Voltar para Painel
          </button>
        </Link>

        {/* Conteúdo */}
        {isLoading || loadingChamado ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Carregando detalhes do chamado...</p>
            </div>
          </div>
        ) : !chamado ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Chamado não encontrado</h3>
            <p className="text-slate-400">O chamado que você está procurando não existe.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header com título e status */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{chamado.titulo}</h1>
                  <p className="text-slate-400">ID do Chamado: #{chamado.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {(() => {
                    const statusInfo = statusConfig[chamado.status] || statusConfig.aberto;
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusInfo.color}`}>
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-semibold">{statusInfo.label}</span>
                      </div>
                    );
                  })()}
                  {(() => {
                    const prioridadeInfo = prioridadeConfig[chamado.prioridade] || prioridadeConfig.media;
                    return (
                      <div className={`px-4 py-2 rounded-lg border border-slate-600 ${prioridadeInfo.color} font-semibold text-sm`}>
                        Prioridade: {prioridadeInfo.label}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Descrição do status */}
              {(() => {
                const statusInfo = statusConfig[chamado.status] || statusConfig.aberto;
                return (
                  <p className="text-slate-400 text-sm">{statusInfo.description}</p>
                );
              })()}
            </div>

            {/* Informações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Solicitante */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">SOLICITANTE</h3>
                <p className="text-lg font-semibold text-white">{chamado.cliente_nome}</p>
              </div>

              {/* Equipamento */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">EQUIPAMENTO AFETADO</h3>
                <p className="text-lg font-semibold text-white">{chamado.equipamento_nome}</p>
                <p className="text-sm text-slate-400 mt-1">{chamado.equipamento_categoria}</p>
              </div>

              {/* Data de abertura */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">ABERTO EM</h3>
                <p className="text-lg font-semibold text-white">{formatarData(chamado.aberto_em)}</p>
              </div>

              {/* Última atualização */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">ÚLTIMA ATUALIZAÇÃO</h3>
                <p className="text-lg font-semibold text-white">
                  {chamado.atualizado_em ? formatarData(chamado.atualizado_em) : 'Sem atualizações'}
                </p>
              </div>
            </div>

            {/* Descrição completa */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">DESCRIÇÃO DO PROBLEMA</h3>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{chamado.descricao}</p>
            </div>

            {/* Ações */}
            {chamado.status !== 'resolvido' && chamado.status !== 'cancelado' && (
              <div className="flex gap-3">
                {chamado.status === 'aberto' && (
                  <button
                    onClick={handleIniciarAtendimento}
                    disabled={loadingChamado}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingChamado ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                        Iniciando...
                      </>
                    ) : (
                      'Iniciar Atendimento'
                    )}
                  </button>
                )}

                {chamado.status === 'em_atendimento' && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                  >
                    Finalizar e Registrar Reparo
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Reparo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Registrar Reparo</h2>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="descricao" className="text-sm font-medium text-slate-200 block mb-2">
                  Descrição do Reparo
                </label>
                <textarea
                  id="descricao"
                  value={descricaoReparo}
                  onChange={(e) => setDescricaoReparo(e.target.value)}
                  placeholder="Descreva o que foi feito para resolver o problema..."
                  rows={4}
                  disabled={loadingManutencao}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {descricaoReparo.length}/500 caracteres
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loadingManutencao}
                  className="flex-1 border border-slate-600 text-slate-300 hover:bg-slate-700/50 font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalizarChamado}
                  disabled={loadingManutencao}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingManutencao ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                      Finalizando...
                    </>
                  ) : (
                    'Finalizar Chamado'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TecnicoChamadoPage() {
  return (
    <ProtectedRoute requiredRole="tecnico">
      <DetalheChamadoTecnico />
    </ProtectedRoute>
  );
}
