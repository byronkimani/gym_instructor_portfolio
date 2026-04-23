'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Dumbbell } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(233,69,96,0.2),transparent_50%)]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/40">
        <div className="border-b border-slate-100 bg-slate-50 px-8 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-red-600 shadow-lg shadow-accent/30">
            <Dumbbell className="h-7 w-7 text-white" aria-hidden />
          </div>
          <h1 className="font-display mt-5 text-2xl font-extrabold tracking-tight text-primary">Instructor portal</h1>
          <p className="mt-2 text-sm text-text-muted">Authorized access · Train smart stack</p>
        </div>

        <div className="px-8 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-bold text-primary">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="instructor@gym.com"
                className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-accent"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-bold text-primary">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-accent"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-xs text-slate-500">
          <Link href="/" className="font-semibold text-primary hover:text-accent">
            ← Back to site
          </Link>
          <p className="mt-2">All actions are logged.</p>
        </div>
      </div>
    </div>
  );
}
