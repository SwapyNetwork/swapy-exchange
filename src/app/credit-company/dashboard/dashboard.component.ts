import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OfferService } from './offer/offer.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { EventService } from '../../common/services/event.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;

  constructor(private offerService: OfferService, private exchangeService: ExchangeService,
    private eventService: EventService, private toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.updateOffers();
  }

  updateOffers() {
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
            console.log(ev);
            this.offerService.updateMinedOffers({ eventUuid: event.uuid, eventContent: ev[ev.length - 1] }).then(res => {
              this.updateOffers();
            }).catch(err => {
              console.log(err);
            });
          }
        });
      })
    });
  }

}
