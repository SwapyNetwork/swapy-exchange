class UserResponse {
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public type: number
  ) {  }
}

export class LoginResponseModel {
  constructor(
  	public code: string,
  	public message: string,
    public user: UserResponse
  ) {  }
}

export const INVESTOR = 1;
export const CREDIT_COMPANY = 2;