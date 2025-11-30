import { FormEvent, useState } from 'react';
import Router from 'next/router';
import { Layout } from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      Router.push('/search');
    } else {
      const body = await res.json();
      setError(body.error || 'Login failed');
    }
  };

  return (
    <Layout>
      <div className="mx-auto flex max-w-md flex-col space-y-4 px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-600">Log in to continue searching and managing your pipeline.</p>
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-brand-600 px-4 py-2 text-white shadow hover:bg-brand-700"
          >
            Log in
          </button>
        </form>
      </div>
    </Layout>
  );
}
