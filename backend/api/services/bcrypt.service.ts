import bcrypt from 'bcrypt-nodejs';

export const bcryptService = () => {
  const password = (user: { password: string }) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    return hash;
  };

  const comparePassword = (pw: string, hash: string) => {
    console.log(`compareing passwords ${pw} ${hash}`);
    return bcrypt.compareSync(pw, hash);
  };

  return {
    password,
    comparePassword,
  };
};

export default bcryptService;
