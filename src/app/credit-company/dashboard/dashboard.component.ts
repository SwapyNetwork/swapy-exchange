import { Component, OnInit } from '@angular/core';
import { OfferService } from './offer/offer.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { EventService } from '../../common/services/event.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;

  constructor(private offerService: OfferService,
    private exchangeService: ExchangeService, private eventService: EventService) { }

  ngOnInit() {
    this.offerService.getMyOffers().then(
      (data: any) => {
        this.offers = data.offers;
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  getUpdatesFromBlockchain() {
    this.eventService.findByCompany().then(events => {
      (events as [any]).forEach(event => {
        this.exchangeService.getEvents(event.uuid, (error, ev) => {
          if (error) {
            console.log(error);
          } else if (ev.length > 0) {
            ev.eventUuid = event.uuid;
            return this.eventService.update(ev);
          }
        });
      })
    });
  }

}
