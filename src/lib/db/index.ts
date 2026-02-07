import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

function createDb() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not set');
  }
  const isLocalFile = url.startsWith('file:');
  if (!isLocalFile && !process.env.TURSO_AUTH_TOKEN) {
    throw new Error('TURSO_AUTH_TOKEN is not set (required for remote Turso)');
  }
  const client = createClient({
    url,
    ...(isLocalFile ? {} : { authToken: process.env.TURSO_AUTH_TOKEN }),
  });
  return drizzle(client, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

function getDb(): ReturnType<typeof createDb> {
  if (!_db) _db = createDb();
  return _db;
}

// ビルド時は環境変数が無くてもインポート可能。実行時に初回アクセスで初期化する
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// 型エクスポート
export type Database = ReturnType<typeof createDb>;
