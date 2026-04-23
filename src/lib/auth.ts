import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const instructor = await prisma.instructor.findUnique({
            where: { email: credentials.email as string },
          });

          if (!instructor) {
            if (process.env.NODE_ENV === 'development') {
              console.error('AUTHORIZE FAIL: Instructor not found for supplied email');
            } else {
              console.error('AUTHORIZE FAIL: Invalid credentials');
            }
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            instructor.passwordHash
          );

          if (!isPasswordValid) {
            if (process.env.NODE_ENV === 'development') {
              console.error('AUTHORIZE FAIL: Invalid password for supplied email');
            } else {
              console.error('AUTHORIZE FAIL: Invalid credentials');
            }
            return null;
          }

          return {
            id: instructor.id,
            name: instructor.name,
            email: instructor.email,
          };
        } catch (error) {
          console.error('AUTHORIZE ERROR:', error);
          throw error;
        }
      },
    }),
  ],
});
