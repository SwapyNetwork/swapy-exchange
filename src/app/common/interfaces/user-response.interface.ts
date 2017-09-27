export const INVESTOR = 1;
export const CREDIT_COMPANY = 2;

export interface UserResponseInterface {
  email: string;
  firstName: string;
  lastName: string;
  type: number;
  tfa: boolean;
};
