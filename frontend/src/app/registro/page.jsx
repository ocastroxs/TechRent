'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertCircle, Loader2, Eye, EyeOff, CheckCircle,
  Check, X, ArrowRight, UserCircle, Wrench, Shield
} from 'lucide-react';

const tiposUsuario = [
  { value: 'cliente', label: 'Cliente', description: 'Abrir chamados de suporte', icon: UserCircle, color: 'indigo' },
  { value: 'tecnico', label: 'Técnico', description: 'Atender e resolver chamados', icon: Wrench, color: 'blue' },
  { value: 'admin', label: 'Administrador', description: 'Gerenciar todo o sistema', icon: Shield, color: 'violet' },
];

export default function RegistroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState('cliente');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { registro, loading, error } = useAuth();
  const router = useRouter();

  const validacoes = useMemo(() => ({
    senhaMinima: senha.length >= 6,
    senhasCoincidentes: senha.length > 0 && confirmaSenha.length > 0 && senha === confirmaSenha,
    emailValido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    nomeValido: nome.trim().length >= 3,
  }), [nome, email, senha, confirmaSenha]);

  const formularioValido =
    validacoes.nomeValido &&
    validacoes.emailValido &&
    validacoes.senhaMinima &&
    validacoes.senhasCoincidentes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!validacoes.nomeValido) { setValidationError('Nome deve ter pelo menos 3 caracteres'); return; }
    if (!validacoes.emailValido) { setValidationError('Email inválido'); return; }
    if (!validacoes.senhaMinima) { setValidationError('Senha deve ter pelo menos 6 caracteres'); return; }
    if (!validacoes.senhasCoincidentes) { setValidationError('As senhas não coincidem'); return; }

    const result = await registro(nome, email, senha, nivelAcesso);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/login" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center animate-glow">
              <span className="text-lg font-bold text-white">TR</span>
            </div>
            <span className="text-2xl font-bold text-white">TechRent</span>
          </Link>
          <p className="text-slate-400 text-sm">Crie sua conta para começar</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-slate-700/50 shadow-2xl p-8 animate-fade-in-up">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-green-500/10 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Conta criada! ✨</h3>
              <p className="text-slate-400">Redirecionando para o login...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Criar conta</h2>
                <p className="text-slate-400 text-sm mt-1">Preencha os dados abaixo para começar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {(validationError || error) && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{validationError || error}</span>
                  </div>
                )}

                {/* Tipo de Usuário */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tipo de Usuário</label>
                  <div className="grid grid-cols-3 gap-2">
                    {tiposUsuario.map((tipo) => {
                      const Icon = tipo.icon;
                      const isSelected = nivelAcesso === tipo.value;
                      return (
                        <button
                          key={tipo.value}
                          type="button"
                          onClick={() => setNivelAcesso(tipo.value)}
                          disabled={loading}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <div>
                            <p className="text-xs font-semibold">{tipo.label}</p>
                            <p className="text-xs opacity-60 leading-tight hidden sm:block">{tipo.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nome */}
                <div className="space-y-1.5">
                  <label htmlFor="nome" className="text-sm font-medium text-slate-300">Nome Completo</label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl h-11"
                  />
                  {nome && !validacoes.nomeValido && (
                    <p className="text-xs text-red-400 flex items-center gap-1"><X className="w-3 h-3" />Mínimo 3 caracteres</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl h-11"
                  />
                  {email && !validacoes.emailValido && (
                    <p className="text-xs text-red-400 flex items-center gap-1"><X className="w-3 h-3" />Email inválido</p>
                  )}
                </div>

                {/* Senha */}
                <div className="space-y-1.5">
                  <label htmlFor="senha" className="text-sm font-medium text-slate-300">Senha</label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl h-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${validacoes.senhaMinima ? 'text-green-400' : 'text-slate-500'}`}>
                    {validacoes.senhaMinima ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Mínimo 6 caracteres
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmaSenha" className="text-sm font-medium text-slate-300">Confirmar Senha</label>
                  <div className="relative">
                    <Input
                      id="confirmaSenha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmaSenha}
                      onChange={(e) => setConfirmaSenha(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl h-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmaSenha && (
                    <div className={`flex items-center gap-1 text-xs ${validacoes.senhasCoincidentes ? 'text-green-400' : 'text-red-400'}`}>
                      {validacoes.senhasCoincidentes ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {validacoes.senhasCoincidentes ? 'Senhas coincidem' : 'Senhas não coincidem'}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !formularioValido}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-11 group"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cadastrando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Criar Conta
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-700/50" />
                <span className="text-xs text-slate-500">OU</span>
                <div className="flex-1 h-px bg-slate-700/50" />
              </div>

              <p className="text-center text-sm text-slate-400">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Faça login
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2025 TechRent. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
