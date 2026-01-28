import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { uploadVideo } from '@/lib/storage/r2';

/**
 * POST /api/upload/video
 * 動画をアップロード
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

    // ファイルサイズチェック（100MB制限）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます（最大100MB）' },
        { status: 400 }
      );
    }

    // ファイルタイプチェック
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'サポートされていないファイル形式です' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadVideo(buffer, file.name, file.type);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: '動画のアップロードに失敗しました' },
      { status: 500 }
    );
  }
}
