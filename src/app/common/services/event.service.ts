import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class EventService {

  constructor(private http: HttpService) { }

  findByCompany() {
    return this.http.get('event/company');
  }

  update(events) {
    return this.http.post('event/update', events);
  }

}
