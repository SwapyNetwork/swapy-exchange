import { Injectable } from '@angular/core';
import * as sha1 from 'sha1';

@Injectable()
export class PendingOfferService {

  private message: string;
  private error;

  constructor() {
    this.message = null;
  }

  getMessage() {
    return this.message;
  }

  getError() {
    return this.error;
  }

  setMessage(message) {
    this.error = false;
    this.message = message;
  }

  setErrorMessage(message) {
    if (message !== null) {
      switch (sha1(message)) {
        case '81c8e9b1e558f0a68e4667560d89a47e7356b593': // Cant pay for gas
          this.message = 'Your wallet does not have the necessary amount of ETH to pay for gas. Transaction will not be mined.'
          break;
        case '699e7c6d81ba58075ee84cf2a640c18a409efcba': // Transaction still being mined
          this.message = 'Transaction is still being mined.' +
            ' Please go to the \'Manage\' page in a few minutes and check if the assets are available.'
          break;
        case '447ac2569cfa905030dda6dd5ed1013f98f1a7b9': // RLP error: leading zero bytes
          this.message = 'Error while doing the transaction. Please add another offer.'
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
