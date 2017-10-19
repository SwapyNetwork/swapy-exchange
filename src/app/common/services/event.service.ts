import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class EventService {

  constructor(private http: HttpService) { }

  findByCompany() {
    return this.http.get('event/company');
  }

  findPendingByCompany() {
    return this.http.get('event/company/pending');
  }

  findByInvestor() {
    return this.http.get('event/investor');
  }

  findPendingByInvestor() {
    return this.http.get('event/investor/pending');
  }

  update(events) {
    return this.http.post('event/update', events);
  }

  updateMined(events) {
    return this.http.put('event/mined', events);
  }

}
