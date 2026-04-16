'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import TechnicoHeader from '@/components/TechnicoHeader';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import { useChamados } from '@/hooks/useChamados';
import { useManutencao } from '@/hooks/useManutencao';
import {
  AlertCircle, Loader2, ArrowLeft, Clock, CheckCircle,
  AlertTriangle, XCircle, Monitor, User, Calendar, Wrench,
  Play, CheckSquare, MessageSquare, RefreshCw
} from 'lucide-react';

const statusConfig = {
  aberto: { label: 'Aberto', color: 'bg-blue-500/15 border-blue-500/30 text-blue-400', icon: AlertTriangle, description: 'Aguardando atendimento' },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400', icon: Clock, description: 'Sendo atendido por um técnico' },
  resolvido: { label: 'Resolvido', color: 'bg-green-500/15 border-green-500/30 text-green-400', icon: CheckCircle, description: 'Problema resolvido com sucesso' },
  cancelado: { label: 'Cancelado', color: 'bg-red-500/15 border-red-500/30 text-red-400', icon: XCircle, description: 'Chamado cancelado' },
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
  media: { label: 'Média', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  alta: { label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  critica: { label: 'Crítica', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
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
  const [success, setSuccess] = useState(false);

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
    if (!descricaoReparo.trim()) { setError('Descreva o reparo realizado'); return; }
    if (descricaoReparo.trim().length < 10) { setError('Descrição deve ter pelo menos 10 caracteres'); return; }

    setError('');
    const result = await registrarManutencao(chamado.id, descricaoReparo);
    if (result.success) {
      setChamado({ ...chamado, status: 'resolvido' });
      setShowModal(false);
      setDescricaoReparo('');
      setSuccess(true);
      setTimeout(() => router.push('/tecnico'), 2500);
    } else {
      setError(result.error || 'Erro ao registrar manutenção');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <TechnicoHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/tecnico" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Painel
          </Link>
          <button
            onClick={fetchChamado}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 mb-6 animate-fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-semibold">Chamado finalizado com sucesso! Redirecionando...</p>
          </div>
        )}

        {isLoading || loadingChamado ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400">Carregando detalhes do chamado...</p>
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
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: User, label: 'Solicitante', value: chamado.cliente_nome },
                { icon: Monitor, label: 'Equipamento', value: `${chamado.equipamento_nome}${chamado.equipamento_categoria ? ` — ${chamado.equipamento_categoria}` : ''}` },
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

            {/* Actions */}
            {chamado.status !== 'resolvido' && chamado.status !== 'cancelado' && (
              <div className="glass rounded-xl p-5 border border-slate-700/50">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Ações</h3>
                {error && (
                  <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-4 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
                {chamado.status === 'aberto' && (
                  <button
                    onClick={handleIniciarAtendimento}
                    disabled={loadingChamado}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-yellow-500/25"
                  >
                    {loadingChamado ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Iniciando...</>
                    ) : (
                      <><Play className="w-4 h-4" />Iniciar Atendimento</>
                    )}
                  </button>
                )}
                {chamado.status === 'em_atendimento' && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Finalizar e Registrar Reparo
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Modal de Reparo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass rounded-2xl border border-slate-700 p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Registrar Reparo</h2>
                <p className="text-sm text-slate-400">Descreva o que foi feito para resolver o problema</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Descrição do Reparo</label>
                <textarea
                  value={descricaoReparo}
                  onChange={(e) => { setDescricaoReparo(e.target.value); setError(''); }}
                  placeholder="Ex: Substituído o cabo de alimentação defeituoso. Testado o funcionamento após a troca..."
                  rows={5}
                  disabled={loadingManutencao}
                  maxLength={500}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl px-4 py-3 text-sm transition-all resize-none disabled:opacity-50"
                />
                <p className={`text-xs mt-1 text-right ${descricaoReparo.length > 400 ? 'text-orange-400' : 'text-slate-500'}`}>
                  {descricaoReparo.length}/500
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowModal(false); setError(''); setDescricaoReparo(''); }}
                  disabled={loadingManutencao}
                  className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalizarChamado}
                  disabled={loadingManutencao || descricaoReparo.trim().length < 10}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingManutencao ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Finalizando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Finalizar Chamado
                    </span>
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
