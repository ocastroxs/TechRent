'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, senha);
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
          <p className="text-slate-400 text-sm">Sistema de Gerenciamento de Chamados de TI</p>
        </div>

        {/* Card de Login */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
          <p className="text-slate-400 text-sm mb-8">Faça login para acessar sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Erro */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col space-y-2">
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
                className="w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col space-y-2">
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
                  className="w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                />
              </div>
            </div>

            {/* Botão Login */}
            <Button
              type="submit"
              disabled={loading || !email || !senha}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">OU</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Link para Cadastro */}
          <p className="text-center text-sm text-slate-400">
            Não tem uma conta?{' '}
            <Link href="/registro" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Cadastre-se aqui
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          © 2026 TechRent. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
