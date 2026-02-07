import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  // LP で使うクラスが本番で消えないようフォールバックで safelist
  safelist: [
    { pattern: /^(min-h-screen|bg-black|text-gray-100|antialiased|bg-gradient-to-|from-black|via-|to-|text-center|max-w-|mx-auto|container|px-4|py-|rounded-|border-|text-white|text-red-|text-gray-|flex|grid|items-|justify-|gap-|space-)/ }
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;

