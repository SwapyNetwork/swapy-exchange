import { UserResponseInterface } from '../../common/interfaces/user-response.interface';

export interface LoginResponseModel {
  code: string;
  message: string;
  user: UserResponseInterface;
  accessToken: string;
  tfa: boolean;
};
