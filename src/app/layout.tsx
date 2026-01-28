import type { Metadata } from "next";
import "./globals.css";
import { AgeVerificationModal } from "@/components/common/AgeVerificationModal";

export const metadata: Metadata = {
  title: "HorrorRing",
  description:
    "ホラーゲーム・心霊スポット・都市伝説のためのSNSプラットフォーム"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-black text-gray-100 antialiased">
        {children}
        <AgeVerificationModal />
      </body>
    </html>
  );
}

