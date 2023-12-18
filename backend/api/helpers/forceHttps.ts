import { Response, Request, NextFunction } from 'express';

export const requireHTTPS = (
  req: Request,
  res: Response,
  next: NextFunction | (() => {})
) => {
  if (process.env.NODE_ENV === 'development') {
    next();
  } else {
    // First, check if directly requested via https
    let isHttps = req.secure;

    // Second, if the request headers can be trusted (e.g. because they are send
    // by a proxy), check if x-forward-proto is set to https
    if (!isHttps) {
      isHttps =
        ((req.headers['x-forwarded-proto'] || '') as string).substring(0, 5) ===
        'https';
    }

    if (isHttps) {
      next();
    } else {
      // Only redirect GET methods
      if (req.method === 'GET' || req.method === 'HEAD') {
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        res.redirect(301, 'https://' + host + req.originalUrl);
      }
    }
  }
};
