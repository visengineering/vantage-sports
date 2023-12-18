import { UserTypeEnum } from 'src/types';

export const mapStringToUserType = (
  str: string,
  def: UserTypeEnum | undefined = undefined
) =>
  str === UserTypeEnum.COACH
    ? UserTypeEnum.COACH
    : str === UserTypeEnum.TRAINEE
    ? UserTypeEnum.TRAINEE
    : def;
