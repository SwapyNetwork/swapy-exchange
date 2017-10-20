import { Injectable } from '@angular/core';

@Injectable()
export class SuccessfulInvestmentService {

  private errors: string;
  private messages: string;

  constructor() { }

  public cacheErrors(errors) {
    this.errors = errors.map((error) => error.message);
  }

  public cacheSuccessfulMessages(response) {
    this.messages = response.message
  }

  public getErrorsMessages(): string {
    return this.errors;
  }

  public getSuccessfulMessages(): string {
    return this.messages;
  }

  public cleanMessages() {
    this.errors = undefined;
    this.messages = undefined;
  }

}
