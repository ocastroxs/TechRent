'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import { useChamados } from '@/hooks/useChamados';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, ArrowLeft, CheckCircle, Zap, AlertTriangle, Clock, Info } from 'lucide-react';

const prioridadeOptions = [
  { value: 'baixa', label: 'Baixa', desc: 'Problema não urgente, pode aguardar', color: 'text-slate-400', icon: '🟢' },
  { value: 'media', label: 'Média', desc: 'Impacto moderado no trabalho', color: 'text-blue-400', icon: '🔵' },
  { value: 'alta', label: 'Alta', desc: 'Impacto significativo, precisa de atenção', color: 'text-orange-400', icon: '🟠' },
  { value: 'critica', label: 'Crítica', desc: 'Sistema parado, precisa de resolução imediata', color: 'text-red-400', icon: '🔴' },
];

function NovoChamadoForm() {
  const router = useRouter();
  const { criar, loading, error } = useChamados();
  const { equipamentos, listar: listarEquipamentos } = useEquipamentos();
  const [isLoadingEquipamentos, setIsLoadingEquipamentos] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    equipamento_id: '',
    prioridade: 'media',
  });
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchEquipamentos = async () => {
      await listarEquipamentos();
      setIsLoadingEquipamentos(false);
    };
    fetchEquipamentos();
  }, [listarEquipamentos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.titulo.trim()) { setValidationError('Título é obrigatório'); return; }
    if (formData.titulo.trim().length < 5) { setValidationError('Título deve ter pelo menos 5 caracteres'); return; }
    if (!formData.descricao.trim()) { setValidationError('Descrição é obrigatória'); return; }
    if (formData.descricao.trim().length < 10) { setValidationError('Descrição deve ter pelo menos 10 caracteres'); return; }
    if (!formData.equipamento_id) { setValidationError('Selecione um equipamento'); return; }

    const result = await criar(
      formData.titulo,
      formData.descricao,
      parseInt(formData.equipamento_id),
      formData.prioridade
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/cliente'), 2000);
    }
  };

  const selectedPrioridade = prioridadeOptions.find(p => p.value === formData.prioridade);
  const isFormValid = formData.titulo.trim().length >= 5 && formData.descricao.trim().length >= 10 && formData.equipamento_id;

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <ClientHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/cliente" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Meus Chamados
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">Abrir Novo Chamado</h1>
          <p className="text-slate-400 mt-1">Descreva o problema que está enfrentando com seu equipamento</p>
        </div>

        {/* Form card */}
        <div className="glass rounded-2xl border border-slate-700/50 shadow-2xl p-8 animate-fade-in-up">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-green-500/10 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Chamado criado! ✨</h3>
              <p className="text-slate-400">Redirecionando para seus chamados...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {(validationError || error) && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{validationError || error}</span>
                </div>
              )}

              {/* Título */}
              <div className="space-y-1.5">
                <label htmlFor="titulo" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                  Título do Chamado
                  <span className="text-red-400">*</span>
                </label>
                <Input
                  id="titulo"
                  name="titulo"
                  type="text"
                  placeholder="Ex: Monitor não liga, Teclado com teclas travadas..."
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={100}
                  className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl h-11"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Seja específico e direto</p>
                  <p className={`text-xs ${formData.titulo.length > 80 ? 'text-orange-400' : 'text-slate-500'}`}>
                    {formData.titulo.length}/100
                  </p>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <label htmlFor="descricao" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                  Descrição Detalhada
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva o problema em detalhes:&#10;• O que está acontecendo?&#10;• Quando começou?&#10;• Quais são os sintomas?&#10;• Já tentou alguma solução?"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={6}
                  maxLength={1000}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm transition-all resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Quanto mais detalhes, mais rápido o atendimento</p>
                  <p className={`text-xs ${formData.descricao.length > 800 ? 'text-orange-400' : 'text-slate-500'}`}>
                    {formData.descricao.length}/1000
                  </p>
                </div>
              </div>

              {/* Equipamento */}
              <div className="space-y-1.5">
                <label htmlFor="equipamento_id" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                  Equipamento Afetado
                  <span className="text-red-400">*</span>
                </label>
                {isLoadingEquipamentos ? (
                  <div className="flex items-center gap-2 p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Carregando equipamentos...
                  </div>
                ) : (
                  <select
                    id="equipamento_id"
                    name="equipamento_id"
                    value={formData.equipamento_id}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm transition-all"
                  >
                    <option value="">Selecione o equipamento com problema...</option>
                    {equipamentos.map((equip) => (
                      <option key={equip.id} value={equip.id}>
                        {equip.nome} — {equip.categoria}
                      </option>
                    ))}
                  </select>
                )}
                {equipamentos.length === 0 && !isLoadingEquipamentos && (
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <Info className="w-3.5 h-3.5" />
                    Nenhum equipamento disponível. Contate o administrador.
                  </div>
                )}
              </div>

              {/* Prioridade */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Prioridade</label>
                <div className="grid grid-cols-2 gap-2">
                  {prioridadeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, prioridade: opt.value }))}
                      disabled={loading}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                        formData.prioridade === opt.value
                          ? 'bg-indigo-500/15 border-indigo-500/50'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{opt.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${formData.prioridade === opt.value ? 'text-white' : 'text-slate-300'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-tight">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-11"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Criando chamado...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Abrir Chamado
                    </span>
                  )}
                </Button>
                <Link href="/cliente">
                  <button
                    type="button"
                    disabled={loading}
                    className="px-6 border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 h-11 text-sm"
                  >
                    Cancelar
                  </button>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NovoChamadoPage() {
  return (
    <ProtectedRoute requiredRole="cliente">
      <NovoChamadoForm />
    </ProtectedRoute>
  );
}
