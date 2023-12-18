import jwt from 'jsonwebtoken';

const secret =
  process.env.NODE_ENV === 'production'
    ? process.env.JWT_SECRET || ''
    : 'secret';
export const JWT_SECRET = secret;

export const authService = () => {
  const issue = (payload: string | Buffer | object) =>
    jwt.sign(payload, secret, { expiresIn: 10800 /* 3 hours */ });
  const verify = (token: string, cb?: (err: any, userToken: any) => void) =>
    jwt.verify(token, secret, {}, cb);

  return {
    issue,
    verify,
  };
};

export default authService;
