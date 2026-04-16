'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ClientHeader from '@/components/ClientHeader';
import { useChamados } from '@/hooks/useChamados';
import { AlertCircle, Loader2, ArrowLeft, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const statusConfig = {
  aberto: {
    label: 'Aberto',
    color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    icon: AlertTriangle,
    description: 'Seu chamado foi registrado e está aguardando atendimento',
  },
  em_atendimento: {
    label: 'Em Atendimento',
    color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    icon: Clock,
    description: 'Um técnico está trabalhando na resolução do seu problema',
  },
  resolvido: {
    label: 'Resolvido',
    color: 'bg-green-500/20 border-green-500/30 text-green-400',
    icon: CheckCircle,
    description: 'Seu problema foi resolvido com sucesso',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-500/20 border-red-500/30 text-red-400',
    icon: XCircle,
    description: 'Este chamado foi cancelado',
  },
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'text-green-400' },
  media: { label: 'Média', color: 'text-yellow-400' },
  alta: { label: 'Alta', color: 'text-orange-400' },
  critica: { label: 'Crítica', color: 'text-red-400' },
};

function DetalheChamadoContent() {
  const params = useParams();
  const { buscarPorId, loading, error } = useChamados();
  const [chamado, setChamado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ClientHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão voltar */}
        <Link href="/cliente">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Voltar para Meus Chamados
          </button>
        </Link>

        {/* Conteúdo */}
        {isLoading || loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Carregando detalhes do chamado...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Erro ao carregar chamado</p>
              <p className="text-sm">{error}</p>
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
              {/* Equipamento */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">EQUIPAMENTO AFETADO</h3>
                <p className="text-lg font-semibold text-white">{chamado.equipamento_nome}</p>
              </div>

              {/* Técnico responsável */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">TÉCNICO RESPONSÁVEL</h3>
                <p className="text-lg font-semibold text-white">
                  {chamado.tecnico_nome || 'Aguardando atribuição'}
                </p>
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

            {/* Informações do cliente */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">INFORMAÇÕES DO SOLICITANTE</h3>
              <p className="text-slate-300">
                <span className="font-semibold">Nome:</span> {chamado.cliente_nome}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DetalheChamadoPage() {
  return (
    <ProtectedRoute requiredRole="cliente">
      <DetalheChamadoContent />
    </ProtectedRoute>
  );
}
