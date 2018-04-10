import { Injectable } from '@angular/core';
import * as sha1 from 'sha1';

@Injectable()
export class MessageService {

  private error: boolean;
  private message: string;
  private headerMessage: string;

  public investment;

  constructor() { }

  public cacheInvestment(investment) {
    this.investment = investment;
  }

  public getCachedInvestment() {
    return this.investment;
  }

  public setMessage(message) {
    this.error = false;
    this.message = message
  }

  public setHeaderMessage(message) {
    this.error = false;
    this.headerMessage = message
  }

  public getMessage(): string {
    return this.message;
  }

  public getHeaderMessage(): string {
    if (!this.error) {
      return this.headerMessage;
    } else {
      return undefined;
    }
  }

  public getError(): boolean {
    return this.error;
  }

  public cleanMessages() {
    this.error = undefined;
    this.message = undefined;
    this.headerMessage = undefined;
  }

  setErrorMessage(message) {
    if (message !== null) {
      switch (sha1(message)) {
        case '81c8e9b1e558f0a68e4667560d89a47e7356b593': // Cant pay for gas
          this.message = 'Your wallet does not have the necessary amount of ETH to pay for gas. Transaction will not be mined.'
          break;
        case '699e7c6d81ba58075ee84cf2a640c18a409efcba': // Transaction still being mined
          this.message = 'Transaction is still being mined. Please go to the \'Manage\' page in a few minutes and check if your the transaction finished successfully.'
          break;
        case '447ac2569cfa905030dda6dd5ed1013f98f1a7b9': // RLP error: leading zero bytes
          this.message = 'Error while doing the transaction. Please invest again.'
          break;
        default:
          this.message = message;
      }

      if (message.toLowerCase().indexOf('user denied transaction signature') !== - 1) {
        this.message = 'User denied transaction signature';
      }
    }
    this.error = true;
  }

}
