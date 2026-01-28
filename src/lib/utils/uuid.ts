import { randomUUID } from 'crypto';

/**
 * UUIDを生成する
 */
export function generateId(): string {
  return randomUUID();
}
