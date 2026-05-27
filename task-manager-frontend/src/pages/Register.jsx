import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length > 40) return 'El nombre debe tener máximo 40 caracteres';
        return '';
      case 'lastname':
        if (!value.trim()) return 'El apellido es requerido';
        if (value.length > 40) return 'El apellido debe tener máximo 40 caracteres';
        return '';
      case 'email':
        if (!value.trim()) return 'El correo es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo válido';
        if (value.length > 60) return 'El correo debe tener máximo 60 caracteres';
        return '';
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length > 60) return 'La contraseña debe tener máximo 60 caracteres';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {
      name: validateField('name', formData.name),
      lastname: validateField('lastname', formData.lastname),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.lastname, formData.email, formData.password);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.error || 'Error al registrar';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crear cuenta</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Regístrate para comenzar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm ${
                      errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    placeholder="Juan"
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Apellido
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm ${
                      errors.lastname ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    placeholder="Pérez"
                  />
                </div>
                {errors.lastname && <p className="mt-1.5 text-sm text-red-500">{errors.lastname}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-xl transition-colors shadow-lg shadow-violet-500/25 text-sm"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}