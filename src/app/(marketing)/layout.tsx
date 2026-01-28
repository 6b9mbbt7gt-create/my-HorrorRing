export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <main>{children}</main>
    </div>
  );
}
