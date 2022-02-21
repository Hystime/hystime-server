/* eslint-disable @typescript-eslint/no-empty-function */

import fs from 'fs';
import moment from 'moment';
import { ServerInfo } from 'apollo-server';
import os from 'os';

export function assertType<T>(obj: any): asserts obj is T {}

export function assertNonNull<T>(obj: T): asserts obj is NonNullable<T> {
  if (obj === null || obj === undefined) {
    throw new Error(`Expected non-null value, got ${obj}`);
  }
}

export function fileExist(path: string): boolean {
  try {
    fs.accessSync(path, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export function isDebug(): boolean {
  return process.env.NODE_ENV === 'development' || !!process.env.DEBUG;
}

export function endToStart(end: Date, days: number): Date {
  return moment(end).subtract(days, 'days').startOf('day').toDate();
}

export function todayEnd(): Date {
  return moment().endOf('day').toDate();
}

export function serverUrl(info: ServerInfo): string {
  function getIPAddress(): string[] {
    const IPAddress = [];
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
      const IFace = interfaces[devName];
      for (let i = 0; i < IFace.length; i++) {
        const alias = IFace[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          IPAddress.push(alias.address);
        }
      }
    }
    return IPAddress;
  }

  const host = info.address;
  const url = info.url;
  if (isDebug()) {
    if (host === '0.0.0.0' || host === '::') {
      const ips = getIPAddress();
      const local_ips = ips.filter((ip) => ip.startsWith('192.168') || ip.startsWith('172.16'));
      if (local_ips.length > 0) {
        return url.replace(host, local_ips[0]);
      }
    }
  }
  return url;
}
