import { createClient } from '@libsql/client';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { config } from 'dotenv';

// .env.localを読み込む
config({ path: '.env.local' });

async function runMigrations() {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const isLocalFile = databaseUrl?.startsWith('file:');

  if (!databaseUrl) {
    console.error('❌ TURSO_DATABASE_URL is not set');
    process.exit(1);
  }
  if (!isLocalFile && !authToken) {
    console.error('❌ TURSO_AUTH_TOKEN is required for remote Turso');
    process.exit(1);
  }

  try {
    if (isLocalFile) {
      const pathPart = databaseUrl.replace(/^file:/, '');
      const dir = join(process.cwd(), dirname(pathPart));
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
    const client = createClient({
      url: databaseUrl,
      ...(isLocalFile ? {} : { authToken: authToken! }),
    });

    // マイグレーションファイルを読み込む
    const migrationFiles = [
      'drizzle/0000_sad_boom_boom.sql',
      'drizzle/0001_sticky_thundra.sql',
      'drizzle/0002_user_role.sql',
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
          const isCreate = statement.includes('CREATE') || statement.includes('CREATE UNIQUE');
          const isAlter = statement.trimStart().toUpperCase().startsWith('ALTER TABLE');
          if (statement.trim() && (isCreate || isAlter)) {
            try {
              await client.execute(statement);
            } catch (error: any) {
              const msg = error.message?.toLowerCase() || '';
              // テーブル・インデックスが既に存在 / カラム重複はスキップ
              if (
                msg.includes('already exists') ||
                msg.includes('duplicate') ||
                msg.includes('unique constraint failed') ||
                msg.includes('duplicate column name')
              ) {
                console.log(`⏭️  Already applied, skipping...`);
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
