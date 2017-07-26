export class SignUpModel {
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public type: number,
    public password: string,
    public confirmPassword: string,
    public terms: boolean
  ) {  }
}
