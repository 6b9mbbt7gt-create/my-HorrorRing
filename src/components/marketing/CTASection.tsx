import Link from 'next/link';
import { Button } from '../common/Button';

export function CTASection() {
  return (
    <section
      id="cta"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0000 0%, #1a0505 50%, #0d0000 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.15)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-900/80" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-950/80" />

      <div className="container mx-auto max-w-4xl text-center space-y-8 relative">
        <p className="text-red-800 text-xs font-bold tracking-[0.3em] uppercase">
          GET STARTED
        </p>
        <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
          <span className="blood-text">恐怖の世界へ、</span>
          <br />
          今すぐ参加しよう
        </h2>
        <p className="text-red-200/90 text-lg max-w-xl mx-auto">
          HorrorRingで新しいホラー体験を発見し、
          <br />
          同じ趣味の仲間とつながれます
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-red-700 hover:bg-red-600 border-2 border-red-500/60 text-white font-bold shadow-[0_0_25px_rgba(139,0,0,0.5)]"
            >
              無料で始める
            </Button>
          </Link>
          <a href="#pricing">
            <Button
              variant="secondary"
              size="lg"
              className="bg-red-950/80 border-2 border-red-900 text-red-200 hover:bg-red-900"
            >
              プランを見る
            </Button>
          </a>
        </div>
        <p className="text-red-900/90 text-sm pt-4">
          クレジットカード不要 • 今すぐ開始 • いつでもやめられます
        </p>
      </div>
    </section>
  );
}
