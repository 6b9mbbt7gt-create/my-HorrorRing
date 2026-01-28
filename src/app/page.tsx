export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black via-slate-950 to-purple-950 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-sm tracking-[0.3em] text-purple-400 uppercase">
          HorrorRing
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          ホラー好きのための
          <br />
          コミュニティSNS
        </h1>
        <p className="text-gray-300">
          ホラーゲーム、心霊スポット、都市伝説。
          <br />
          すべてを一つのリングに集約し、共有し、語り合う場所。
        </p>
        <p className="text-xs text-gray-500">
          ※ これはプレースホルダー画面です。このあと要件定義に沿って画面と機能を拡張していきます。
        </p>
      </div>
    </main>
  );
}

