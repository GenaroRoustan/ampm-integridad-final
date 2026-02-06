import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AMPMLogo } from '@/components/AMPMLogo';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

// MVP: Basic auth - will be replaced with Azure AD
const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'ampm2024',
};

export default function HRLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      sessionStorage.setItem('hr_session', JSON.stringify({
        user: username,
        expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      }));
      navigate('/hr/dashboard');
    } else {
      setError('Credenciales incorrectas. Por favor intente nuevamente.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <AMPMLogo size="lg" className="justify-center mb-6" />
          <h1 className="text-2xl font-bold text-foreground">
            Panel de Recursos Humanos
          </h1>
          <p className="text-muted-foreground mt-2">
            Ingrese sus credenciales para acceder
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input pl-12"
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-12 pr-12"
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Problemas para acceder? Contacte al administrador del sistema.
        </p>
      </div>
    </div>
  );
}
