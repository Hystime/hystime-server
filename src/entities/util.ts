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
      const ips = getIPAddress();
      const local_ips = ips.filter((ip) => ip.startsWith('192.168') || ip.startsWith('172.16'));
      if (local_ips.length > 0) {
        return url.replace(host, local_ips[0]);
      }
    }
  }
  return url;
}
