/* eslint-disable @typescript-eslint/no-empty-function */

export function assert<T>(obj: any): asserts obj is T {}
export function assertNonNull<T>(obj: T): asserts obj is NonNullable<T> {}
