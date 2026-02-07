import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { uploadImage } from '@/lib/storage/r2';

/**
 * POST /api/upload/image
 * 画像をアップロード
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが指定されていません' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（10MB制限）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます（最大10MB）' },
        { status: 400 }
      );
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'サポートされていないファイル形式です' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer, file.name, file.type);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error('Image upload error:', error);
    const message =
      error?.message?.includes('R2が設定されていません') ||
      error?.message?.includes('R2_BUCKET_NAME')
        ? error.message
        : '画像のアップロードに失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
