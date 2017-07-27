export class UserResponseModel {
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public type: number
  ) {  }
}

export const INVESTOR = 1;
export const CREDIT_COMPANY = 2;
