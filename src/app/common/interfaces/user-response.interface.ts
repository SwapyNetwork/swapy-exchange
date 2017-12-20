export const INVESTOR = 1;
export const CREDIT_COMPANY = 2;

export const UPORT = 0;
export const METAMASK = -1;

export interface UserResponseInterface {
  email: string;
  firstName: string;
  lastName: string;
  type: number;
  tfa: boolean;
};
