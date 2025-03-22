declare global {
  var broadcastUpdate: ((channel: string, data: any) => void) | undefined;
}

export {};
