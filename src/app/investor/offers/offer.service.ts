import { Injectable } from '@angular/core';

import { Offer } from './offer/offer.interface';
import { OFFERS } from './mock-offers';

@Injectable()
export class OfferService {
  getOffers(): Promise<Offer[]> {
    return Promise.resolve(OFFERS);
  }
}