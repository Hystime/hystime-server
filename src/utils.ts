/* eslint-disable @typescript-eslint/no-empty-function */

import fs from 'fs';

export function assertType<T>(obj: any): asserts obj is T {}

export function assertNonNull<T>(obj: T): asserts obj is NonNullable<T> {
  if (obj === null || obj === undefined) {
    throw new Error(`Expected non-null value, got ${obj}`);
  }
}

export async function fileExist(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export function isDebug(): boolean {
  return process.env.NODE_ENV === 'development' || !!process.env.DEBUG;
}
