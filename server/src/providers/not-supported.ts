export class NotSupportedError extends Error {
  constructor(method: string) {
    super(`NotSupported: ${method}`);
    this.name = 'NotSupportedError';
  }
}
