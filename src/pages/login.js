import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(form.email, form.password);

    if (result.success) {
      router.push(redirect || '/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign In - Melodic Instruments</title>
      </Head>

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <svg className="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <span className="text-2xl font-display font-bold text-secondary-900">Melodic</span>
            </Link>
            <h1 className="text-2xl font-bold text-secondary-900 mt-6">Welcome back</h1>
            <p className="text-secondary-600 mt-2">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-600 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary-600 hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700">
              <strong>Admin:</strong> admin@melodic.com / admin123<br />
              <strong>User:</strong> test@example.com / test123
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
