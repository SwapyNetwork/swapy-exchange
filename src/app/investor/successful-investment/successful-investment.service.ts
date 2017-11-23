import { Injectable } from '@angular/core';
const sha1 = require('sha1');

@Injectable()
export class SuccessfulInvestmentService {

  private error: boolean;
  private message: string;

  constructor() { }

  public setMessage(message) {
    this.error = false;
    this.message = message
  }

  public getMessage(): string {
    return this.message;
  }

  public getError(): boolean {
    return this.error;
  }

  public cleanMessages() {
    this.error = undefined;
    this.message = undefined;
  }

  setErrorMessage(message) {
    if (message !== null) {
      switch (sha1(message)) {
        case '81c8e9b1e558f0a68e4667560d89a47e7356b593': // Cant pay for gas
          this.message = 'Your wallet does not have the necessary amount of ETH to pay for gas. Transaction will not be mined.'
          break;
        case '699e7c6d81ba58075ee84cf2a640c18a409efcba': // Transaction still being mined
          this.message = 'Transaction is still being mined. Please go to the \'Manage\' page in a few minutes and check if your investment was successful.'
          break;
        case '447ac2569cfa905030dda6dd5ed1013f98f1a7b9': // RLP error: leading zero bytes
          this.message = 'Error while doing the transaction. Please invest again.'
          break;
        default:
          this.message = message;
      }
    }
    this.error = true;
  }

}
