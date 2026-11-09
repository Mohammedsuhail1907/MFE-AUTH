import { setPublicPath } from 'systemjs-webpack-interop';

// Set the public path for SystemJS when running inside a SystemJS / single-spa container
if (typeof window !== 'undefined' && window.System && typeof window.System.resolve === 'function') {
  try {
    setPublicPath('@hfactor/auth', 1, { skipCheck: true });
  } catch (err) {
    console.warn(
      "[mfe-auth] Could not resolve public path from SystemJS registry for '@hfactor/auth'. Falling back to default Webpack public path.",
      err
    );
  }
}

