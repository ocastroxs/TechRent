'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ClientHeader from '@/components/ClientHeader';
import { useChamados } from '@/hooks/useChamados';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const prioridadeOptions = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' },
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validações
    if (!formData.titulo.trim()) {
      setValidationError('Título é obrigatório');
      return;
    }

    if (formData.titulo.trim().length < 5) {
      setValidationError('Título deve ter pelo menos 5 caracteres');
      return;
    }

    if (!formData.descricao.trim()) {
      setValidationError('Descrição é obrigatória');
      return;
    }

    if (formData.descricao.trim().length < 10) {
      setValidationError('Descrição deve ter pelo menos 10 caracteres');
      return;
    }

    if (!formData.equipamento_id) {
      setValidationError('Selecione um equipamento');
      return;
    }

    const result = await criar(
      formData.titulo,
      formData.descricao,
      parseInt(formData.equipamento_id),
      formData.prioridade
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/cliente');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ClientHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão voltar */}
        <Link href="/cliente">
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Voltar para Meus Chamados
          </button>
        </Link>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Abrir Novo Chamado</h1>
          <p className="text-slate-400 mt-2">Descreva o problema que está enfrentando com seu equipamento</p>
        </div>

        {/* Card do formulário */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4 animate-pulse">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Chamado criado com sucesso! ✨
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Você será redirecionado para acompanhar seu chamado...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Erro de validação */}
              {validationError && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{validationError}</span>
                </div>
              )}

              {/* Erro do servidor */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Título */}
              <div className="space-y-2">
                <label htmlFor="titulo" className="text-sm font-medium text-slate-200">
                  Título do Chamado
                </label>
                <Input
                  id="titulo"
                  name="titulo"
                  type="text"
                  placeholder="Ex: Monitor não liga"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  {formData.titulo.length}/100 caracteres
                </p>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <label htmlFor="descricao" className="text-sm font-medium text-slate-200">
                  Descrição Detalhada
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva o problema em detalhes. O que está acontecendo? Quando começou? Quais são os sintomas?"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={6}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200"
                />
                <p className="text-xs text-slate-500">
                  {formData.descricao.length}/1000 caracteres
                </p>
              </div>

              {/* Equipamento */}
              <div className="space-y-2">
                <label htmlFor="equipamento_id" className="text-sm font-medium text-slate-200">
                  Equipamento Afetado
                </label>
                {isLoadingEquipamentos ? (
                  <div className="flex items-center gap-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400">
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
                    className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200"
                  >
                    <option value="">Selecione um equipamento...</option>
                    {equipamentos.map((equip) => (
                      <option key={equip.id} value={equip.id}>
                        {equip.nome} ({equip.categoria})
                      </option>
                    ))}
                  </select>
                )}
                {equipamentos.length === 0 && !isLoadingEquipamentos && (
                  <p className="text-xs text-yellow-400">Nenhum equipamento disponível no momento</p>
                )}
              </div>

              {/* Prioridade */}
              <div className="space-y-2">
                <label htmlFor="prioridade" className="text-sm font-medium text-slate-200">
                  Prioridade
                </label>
                <select
                  id="prioridade"
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg px-3 py-2 transition-all duration-200"
                >
                  {prioridadeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">
                  Selecione a urgência do problema
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Criando chamado...
                    </>
                  ) : (
                    'Abrir Chamado'
                  )}
                </Button>
                <Link href="/cliente" className="flex-1">
                  <button
                    type="button"
                    disabled={loading}
                    className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700/50 font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
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
