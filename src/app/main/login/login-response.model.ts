import {UserResponseModel} from '../../common/models/user-response.model';

export class LoginResponseModel {
  constructor(
  	public code: string,
  	public message: string,
    public user: UserResponseModel
  ) {  }
}
