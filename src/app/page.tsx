import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { BloodDrips } from '@/components/marketing/BloodDrips';
import { Header } from '@/components/marketing/Header';
import { HeroSection } from '@/components/marketing/HeroSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { PricingSection } from '@/components/marketing/PricingSection';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

/**
 * トップページ /
 * ログイン済みならダッシュボードへ、未ログインならLPを表示
 */
export default async function RootPage() {
  try {
    const session = await getSession();
    if (session) {
      redirect('/dashboard');
    }
  } catch {
    // セッション取得失敗時はLPを表示
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative">
      <BloodDrips />
      <main className="relative z-10">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
