import type { NextAuthConfig } from 'next-auth';

function authSecret(): string {
  const fromEnv = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (fromEnv?.trim()) return fromEnv.trim();

  // `next build` runs with NODE_ENV=production but no runtime secrets — do not throw during compile.
  const isCompilePhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (process.env.NODE_ENV === 'production' && !isCompilePhase) {
    throw new Error('AUTH_SECRET or NEXTAUTH_SECRET must be set in production.');
  }

  // Development / build-time fallback only — set AUTH_SECRET in every deployed environment.
  return 'dev-only-insecure-secret-change-for-local-work-only-32chars';
}

export const authConfig = {
  secret: authSecret(),
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                          nextUrl.pathname.startsWith('/calendar') ||
                          nextUrl.pathname.startsWith('/appointments') ||
                          nextUrl.pathname.startsWith('/clients') ||
                          nextUrl.pathname.startsWith('/sessions');

      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
