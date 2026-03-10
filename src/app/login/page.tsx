'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A1A2E] text-white rounded-full mb-4">
              <span className="text-2xl font-bold">GI</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Instructor Portal</h1>
            <p className="text-gray-500 mt-2">Sign in to manage your schedule</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 italic">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 block"
              >
                Email Address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="instructor@gym.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A1A2E] focus:border-transparent outline-none transition-all"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 block"
              >
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A1A2E] focus:border-transparent outline-none transition-all"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A1A2E] text-white py-3 rounded-lg font-bold hover:bg-[#252542] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Authorized access only. All actions are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
