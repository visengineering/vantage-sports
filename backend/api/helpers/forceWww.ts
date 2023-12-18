import { Response, Request, NextFunction } from 'express';

export const requireWwwHost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    next();
  } else {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (host?.slice(0, 4) !== 'www.' && !host?.includes('-dev')) {
      return res.redirect('https://www.' + host + req.url);
    }
    next();
  }
};
