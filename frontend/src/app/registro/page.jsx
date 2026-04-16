'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle, Check, X } from 'lucide-react';

const tiposUsuario = [
  { value: 'cliente', label: 'Cliente', description: 'Abrir chamados de suporte' },
  { value: 'tecnico', label: 'Técnico', description: 'Atender e resolver chamados' },
  { value: 'admin', label: 'Administrador', description: 'Gerenciar todo o sistema' },
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

  // Validações em tempo real
  const validacoes = useMemo(() => {
    return {
      senhaMinima: senha.length >= 6,
      senhasCoincidentes: senha.length > 0 && confirmaSenha.length > 0 && senha === confirmaSenha,
      emailValido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      nomeValido: nome.trim().length >= 3,
    };
  }, [nome, email, senha, confirmaSenha]);

  const formularioValido = 
    validacoes.nomeValido && 
    validacoes.emailValido && 
    validacoes.senhaMinima && 
    validacoes.senhasCoincidentes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validações finais
    if (!validacoes.nomeValido) {
      setValidationError('Nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!validacoes.emailValido) {
      setValidationError('Email inválido');
      return;
    }

    if (!validacoes.senhaMinima) {
      setValidationError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!validacoes.senhasCoincidentes) {
      setValidationError('As senhas não coincidem');
      return;
    }

    const result = await registro(nome, email, senha, nivelAcesso);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 mb-6 shadow-lg shadow-indigo-500/30">
            <span className="text-3xl font-bold text-white">TR</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TechRent</h1>
          <p className="text-slate-400 text-sm">Crie sua conta para começar</p>
        </div>

        {/* Card de Registro */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4 animate-pulse">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Cadastro realizado com sucesso! ✨
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Bem-vindo ao TechRent! Você será redirecionado para fazer login...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Criar conta</h2>
              <p className="text-slate-400 text-sm mb-8">Preencha os dados abaixo para começar</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Erro de validação local */}
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

                {/* Tipo de Usuário */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-200">
                    Tipo de Usuário
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {tiposUsuario.map((tipo) => (
                      <label
                        key={tipo.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          nivelAcesso === tipo.value
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="nivelAcesso"
                          value={tipo.value}
                          checked={nivelAcesso === tipo.value}
                          onChange={(e) => setNivelAcesso(e.target.value)}
                          disabled={loading}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-semibold text-sm">{tipo.label}</p>
                          <p className="text-xs opacity-75">{tipo.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nome */}
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-sm font-medium text-slate-200">
                    Nome Completo
                  </label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full"
                  />
                  {nome && !validacoes.nomeValido && (
                    <p className="text-xs text-red-400">Mínimo 3 caracteres</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full"
                  />
                  {email && !validacoes.emailValido && (
                    <p className="text-xs text-red-400">Email inválido</p>
                  )}
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label htmlFor="senha" className="text-sm font-medium text-slate-200">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`flex items-center gap-1 text-xs ${validacoes.senhaMinima ? 'text-green-400' : 'text-slate-500'}`}>
                      {validacoes.senhaMinima ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      Mínimo 6 caracteres
                    </div>
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <label htmlFor="confirmaSenha" className="text-sm font-medium text-slate-200">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmaSenha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmaSenha}
                      onChange={(e) => setConfirmaSenha(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmaSenha && (
                    <div className={`flex items-center gap-2 text-xs ${validacoes.senhasCoincidentes ? 'text-green-400' : 'text-red-400'}`}>
                      {validacoes.senhasCoincidentes ? (
                        <>
                          <Check className="w-4 h-4" />
                          Senhas coincidem
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Senhas não coincidem
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Botão Cadastro */}
                <Button
                  type="submit"
                  disabled={loading || !formularioValido}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-xs text-slate-500">OU</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Link para Login */}
              <p className="text-center text-sm text-slate-400">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Faça login
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          © 2024 TechRent. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
