import { Injectable } from '@angular/core';
import { HttpService } from '../../../common/services/http.service';

/*
  Generated class for the LoginService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OfferService {

  constructor(public httpService: HttpService) {}

  getMyOffers(): Promise<any> {
    return this.httpService.get('offers/mine');
  }

  acceptInvestor(offerUuid, asset): Promise<any> {
    const data = {
      offerUuid: offerUuid,
      assetUuid: asset.uuid,
      contractAddress: asset.contractAddress,
      investorUuid: asset.investorUuid
    };

    return this.httpService.put('offers/acceptInvestor', data);
  }

  updateMinedOffers(offer): Promise<any> {
    return this.httpService.put('offers/minedOffer', offer);
  }

}
