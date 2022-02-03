import { RelationOptions } from 'typeorm';
import { ServerInfo } from 'apollo-server';
import os from 'os';
import { isDebug } from '../utils';

export const preventWildChild: RelationOptions = {
  orphanedRowAction: 'delete',
  cascade: true,
};

export function serverUrl(info: ServerInfo): string {
  function getIPAddress(): string[] {
    const IPAddress = [];
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
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
      console.info(getIPAddress());
    }
  }
  return url;
}
