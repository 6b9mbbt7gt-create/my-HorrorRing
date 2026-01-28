import Link from 'next/link';
import { Button } from '../common/Button';

export function CTASection() {
  return (
    <section
      id="cta"
      className="py-20 bg-gradient-to-r from-red-900/20 to-orange-900/20 px-4"
    >
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-white">
          恐怖の世界へ、
          <br />
          今すぐ飛び込もう
        </h2>
        <p className="text-gray-300 text-lg">
          HorrorRingで新しい恐怖体験を発見し、
          <br />
          同じ趣味を持つ仲間とつながろう
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              無料で始める
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="secondary" size="lg">
              プランを見る
            </Button>
          </a>
        </div>
        <p className="text-sm text-gray-500 pt-4">
          クレジットカード不要 • 今すぐ開始 • いつでもキャンセル可能
        </p>
      </div>
    </section>
  );
}
