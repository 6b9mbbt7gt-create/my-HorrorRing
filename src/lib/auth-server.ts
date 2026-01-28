import { auth } from './auth';
import { headers } from 'next/headers';

export async function getSession() {
  const headersList = await headers();
  return await auth.api.getSession({
    headers: headersList,
  });
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
