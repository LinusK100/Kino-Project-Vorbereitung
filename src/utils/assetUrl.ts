const BASE = import.meta.env.BASE_URL;

export const assetUrl = (path: string): string =>
  BASE + path.replace(/^\//, '');
