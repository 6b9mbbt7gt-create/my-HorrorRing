import { BloodDrips } from '@/components/marketing/BloodDrips';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-gray-100 relative">
      <BloodDrips />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
