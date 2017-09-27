import { Injectable } from '@angular/core';
import { HttpService } from '../common/services/http.service';

@Injectable()
export class InvestorService {

  constructor(public httpService: HttpService) { }

  getMyInvestmnetsInfo(): Promise<any> {
    return this.httpService.get('investment/mine/generalInfo');
  }

}
