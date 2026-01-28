import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// .env.localを読み込む
config({ path: '.env.local' });

async function runMigrations() {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl || !authToken) {
    console.error('❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set');
    process.exit(1);
  }

  try {
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // マイグレーションファイルを読み込む
    const migrationFiles = [
      'drizzle/0000_sad_boom_boom.sql',
      'drizzle/0001_sticky_thundra.sql',
    ];

    for (const migrationFile of migrationFiles) {
      try {
        const migrationPath = join(process.cwd(), migrationFile);
        const sql = readFileSync(migrationPath, 'utf-8');

        // SQLステートメントを分割（--> statement-breakpointで区切る）
        const statements = sql
          .split('--> statement-breakpoint')
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
          if (statement.trim() && (statement.includes('CREATE') || statement.includes('CREATE UNIQUE'))) {
            try {
              await client.execute(statement);
            } catch (error: any) {
              // テーブルが既に存在する場合はスキップ
              if (
                error.message?.includes('already exists') ||
                error.message?.includes('duplicate') ||
                error.message?.includes('UNIQUE constraint failed')
              ) {
                console.log(`⏭️  Table/index already exists, skipping...`);
                continue;
              }
              throw error;
            }
          }
        }

        console.log(`✅ Applied migration: ${migrationFile}`);
      } catch (error: any) {
        // ファイルが存在しない場合はスキップ
        if (error.code === 'ENOENT') {
          console.log(`⏭️  Skipped: ${migrationFile} (not found)`);
          continue;
        }
        // テーブルが既に存在する場合はスキップ
        if (error.message?.includes('already exists')) {
          console.log(`⏭️  Skipped: ${migrationFile} (tables already exist)`);
          continue;
        }
        throw error;
      }
    }

    console.log('✅ All migrations completed');
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    // エラーがあっても開発サーバーは起動する
    console.log('⚠️  Continuing with server start...');
  }
}

runMigrations();
