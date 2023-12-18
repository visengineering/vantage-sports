const JWTService = require('../services/auth.service');

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req: any, res: any, next: any) => {
  /* if request.path is query events , coaches */
  const allowed = ['query Event', 'query Coach'];
  const target = req.body?.query;
  if (new RegExp(allowed.join('|')).test(target)) {
    return next();
  }

  let tokenToVerify;

  if (req.cookies['jwt'] != '') {
    tokenToVerify = req.cookies['jwt'];
  } else if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ');

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        return res
          .status(401)
          .json({ msg: 'Format for Authorization: Bearer [token]' });
      }
    } else {
      return res
        .status(401)
        .json({ msg: 'Format for Authorization: Bearer [token]' });
    }
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    delete req.query.token;
  } else {
    return res.status(401).json({ msg: 'No Authorization was found' });
  }

  return JWTService().verify(tokenToVerify, (err: any, thisToken: string) => {
    if (err) return res.status(401).json({ err });
    req.currentUser = 'test';
    req.token = thisToken;
    return next();
  });
};
