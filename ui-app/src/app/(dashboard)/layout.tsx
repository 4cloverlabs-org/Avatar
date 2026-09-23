import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '../../lib/auth';
import ClientLayout from './ClientLayout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers()
    });
  } catch (err) {
    console.error("Failed to get session:", err);
  }

  if (!session || !session.user) {
    redirect('/login');
  }

  return <ClientLayout>{children}</ClientLayout>;
}
