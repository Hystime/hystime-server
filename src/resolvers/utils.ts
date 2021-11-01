export function necessary(object: any, ...attributes: string[]): void {
  for (const attribute of attributes) {
    if (object[attribute] === undefined) {
      throw new Error(`${attribute} is necessary`);
    }
  }
}
