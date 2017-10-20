import { Injectable } from '@angular/core';

@Injectable()
export class PendingOfferService {

  private message: string;

  constructor() {
    this.message = null;
  }

  getMessage() {
    return this.message;

  }

  setMessage(message) {
    this.message = message;

  }

}
