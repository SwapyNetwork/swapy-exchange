import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OfferService } from './offer/offer.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { EventService } from '../../common/services/event.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AGREE_INVESTMENT, TRANSFER_FUNDS, CREATE_OFFER } from '../../common/interfaces/events.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public offers;

  constructor(private offerService: OfferService, private exchangeService: ExchangeService,
    private eventService: EventService, private toastr: ToastsManager, vcr: ViewContainerRef,
    private investmentAssetService: InvestmentAssetService) {
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
    this.eventService.findPendingByCompany().then(events => {
      (events as [any]).forEach(event => {
        this.exchangeService.getEvents(event.uuid, 'Offers', (error, ev) => {
          if (error) {
            console.log(error);
          } else if (ev.length > 0) {
            console.log(ev);
            this.eventService.updateMined({ eventUuid: event.uuid, eventContent: ev[ev.length - 1].returnValues }).then(res => {
              this.updateOffers();
            }).catch(err => {
              console.log(err);
            });
          }
        });
      })
    });

    this.eventService.findPendingByCompany().then(events => {
      const createOfferEvents = (events as [any]).forEach(event => {
        let eventType = '';
        switch (event.eventType) {
          case CREATE_OFFER:
            eventType = 'Offers';
            break;
          case AGREE_INVESTMENT:
            eventType = 'Agreements';
            break;
          case TRANSFER_FUNDS:
            eventType = 'Transferred';
            break;
        }
        this.investmentAssetService.getEvents(event.uuid, eventType, event.data.contractAddress, (error, ev) => {
          if (error) {
            console.error(error);
          } else if (ev.length > 0) {
            this.eventService.updateMined({ eventUuid: event.uuid, eventContent: ev[ev.length - 1].returnValues }).then(res => {
              this.updateOffers();
            }).catch(err => {
              console.error(err);
            });
          }
        });
      });
    });
  }
}
