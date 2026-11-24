// Resolve assets using the runtime public path configured by main.single-spa.ts.

declare const __webpack_public_path__: string | undefined;

export function assetUrl(url: string): string {
  const runtimePublicPath =
    typeof window !== 'undefined'
      ? (window as any).__hf_auth_public_path__
      : undefined;

  const webpackPublicPath =
    typeof __webpack_public_path__ !== 'undefined'
      ? __webpack_public_path__
      : undefined;

  const publicPath =
    runtimePublicPath || webpackPublicPath || '/';

  const normalizedPublicPath =
    `${publicPath.replace(/\/+$/, '')}/`;

  const normalizedAssetPath = url.replace(/^\/+/, '');

  return `${normalizedPublicPath}assets/${normalizedAssetPath}`;
}