import {UserResponseModel} from '../../common/models/user-response.model';

export class LoginResponseModel {
  constructor(
  	public code: string,
  	public message: string,
    public user: UserResponseModel
  ) {  }
}

export const INVESTOR = 1;
export const CREDIT_COMPANY = 2;