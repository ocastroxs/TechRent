'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { useChamados } from '@/hooks/useChamados';
import {
  AlertCircle, Loader2, ArrowLeft, Clock, CheckCircle,
  AlertTriangle, XCircle, Monitor, User, Calendar, RefreshCw, MessageSquare
} from 'lucide-react';

const statusConfig = {
  aberto: {
    label: 'Aberto',
    color: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    icon: AlertTriangle,
    description: 'Seu chamado foi registrado e está aguardando atendimento.',
    step: 1,
  },
  em_atendimento: {
    label: 'Em Atendimento',
    color: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
    icon: Clock,
    description: 'Um técnico está trabalhando na resolução do seu problema.',
    step: 2,
  },
  resolvido: {
    label: 'Resolvido',
    color: 'bg-green-500/15 border-green-500/30 text-green-400',
    icon: CheckCircle,
    description: 'Seu problema foi resolvido com sucesso!',
    step: 3,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-500/15 border-red-500/30 text-red-400',
    icon: XCircle,
    description: 'Este chamado foi cancelado.',
    step: 0,
  },
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
  media: { label: 'Média', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  alta: { label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  critica: { label: 'Crítica', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
};

const steps = [
  { label: 'Aberto', icon: AlertTriangle },
  { label: 'Em Atendimento', icon: Clock },
  { label: 'Resolvido', icon: CheckCircle },
];

function DetalheChamadoContent() {
  const params = useParams();
  const { buscarPorId, loading, error } = useChamados();
  const [chamado, setChamado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChamado = async () => {
    setIsLoading(true);
    const result = await buscarPorId(params.id);
    if (result.success) setChamado(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChamado();
  }, [params.id]);

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <ClientHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/cliente" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Meus Chamados
          </Link>
          <button
            onClick={fetchChamado}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading || loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400">Carregando detalhes do chamado...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Erro ao carregar chamado</p>
              <p className="text-sm mt-1 opacity-80">{error}</p>
            </div>
          </div>
        ) : !chamado ? (
          <div className="text-center py-24 animate-fade-in">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Chamado não encontrado</h3>
            <p className="text-slate-400">O chamado que você está procurando não existe.</p>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            {/* Header card */}
            <div className="glass rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-500">#{chamado.id}</span>
                    <span className="text-slate-700">·</span>
                    <StatusBadge status={chamado.status} showDot />
                  </div>
                  <h1 className="text-2xl font-bold text-white">{chamado.titulo}</h1>
                </div>
                {chamado.prioridade && (
                  <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${prioridadeConfig[chamado.prioridade]?.bg} ${prioridadeConfig[chamado.prioridade]?.color}`}>
                    {prioridadeConfig[chamado.prioridade]?.label}
                  </span>
                )}
              </div>

              {/* Status description */}
              {(() => {
                const info = statusConfig[chamado.status] || statusConfig.aberto;
                const Icon = info.icon;
                return (
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${info.color}`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{info.description}</p>
                  </div>
                );
              })()}

              {/* Progress steps (only for non-cancelled) */}
              {chamado.status !== 'cancelado' && (
                <div className="mt-5 flex items-center gap-0">
                  {steps.map((step, i) => {
                    const currentStep = statusConfig[chamado.status]?.step || 1;
                    const isCompleted = i + 1 < currentStep;
                    const isActive = i + 1 === currentStep;
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex items-center flex-1">
                        <div className={`flex flex-col items-center ${i === 0 ? '' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted ? 'bg-green-500 border-green-500' :
                            isActive ? 'bg-indigo-500 border-indigo-500' :
                            'bg-slate-800 border-slate-700'
                          }`}>
                            <Icon className={`w-4 h-4 ${isCompleted || isActive ? 'text-white' : 'text-slate-500'}`} />
                          </div>
                          <span className={`text-xs mt-1 font-medium ${isActive ? 'text-indigo-400' : isCompleted ? 'text-green-400' : 'text-slate-500'}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 mb-4 ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Monitor, label: 'Equipamento', value: chamado.equipamento_nome },
                { icon: User, label: 'Técnico Responsável', value: chamado.tecnico_nome || 'Aguardando atribuição' },
                { icon: Calendar, label: 'Aberto em', value: formatarData(chamado.aberto_em) },
                { icon: RefreshCw, label: 'Última Atualização', value: chamado.atualizado_em ? formatarData(chamado.atualizado_em) : 'Sem atualizações' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="glass rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="glass rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição do Problema</h3>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{chamado.descricao}</p>
            </div>

            {/* Solicitante */}
            <div className="glass rounded-xl p-5 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">
                    {chamado.cliente_nome?.charAt(0)?.toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Solicitante</p>
                  <p className="text-white font-semibold">{chamado.cliente_nome}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
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
