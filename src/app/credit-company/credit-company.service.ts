import { Injectable } from '@angular/core';
import { HttpService } from '../common/services/http.service';

@Injectable()
export class CreditCompanyService {

  constructor(public httpService: HttpService) {}

  getMyOffersInfos(): Promise<any> {
    return this.httpService.get("offers/mine/generalInfo");
  }

}
