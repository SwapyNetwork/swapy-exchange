import { Component, OnInit } from '@angular/core';
import { InvestService } from './../invest/invest.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { EventService } from '../../common/services/event.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { AGREE_INVESTMENT, TRANSFER_FUNDS } from '../../common/interfaces/events.interface';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public investments;

  constructor(private investService: InvestService, private eventService: EventService,
    private exchangeService: ExchangeService, private investmentAssetService: InvestmentAssetService) { }

  ngOnInit() {
    this.updateInvestments();
  }

  updateInvestments() {
    this.investService.getMyInvestments().then(
      (data: any) => {
        this.investments = data.investments;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getUpdatesFromBlockchain() {
    this.eventService.findPendingByInvestor().then(events => {
      const agreeInvestmentEvents = (events as [any]).filter(event => event.eventType === AGREE_INVESTMENT);
      const transferFundsEvents = (events as [any]).filter(event => event.eventType === TRANSFER_FUNDS);
      // @todo Do Another if when transferFunds gets implemented.
      if (agreeInvestmentEvents.length > 0) {
        agreeInvestmentEvents.forEach(event => {
          this.investmentAssetService.getEvents(event.uuid, 'Agreements', event.data.contractAddress, (error, ev) => {
            if (error) {
              console.error(error);
            } else if (ev.length > 0) {
              console.log(ev);
              this.eventService.updateMined({ eventUuid: event.uuid, eventContent: ev[ev.length - 1].returnValues }).then(res => {
                this.updateInvestments();
              }).catch(err => {
                console.error(err);
              });
            }
          });
        })
      }

      if (transferFundsEvents.length > 0) {
        transferFundsEvents.forEach(event => {
          this.investmentAssetService.getEvents(event.uuid, 'Transferred', event.data.contractAddress, (error, ev) => {
            if (error) {
              console.error(error);
            } else if (ev.length > 0) {
              console.log(ev);
              this.eventService.updateMined({ eventUuid: event.uuid, eventContent: ev[ev.length - 1].returnValues }).then(res => {
                this.updateInvestments();
              }).catch(err => {
                console.error(err);
              });
            }
          });
        })
      }
    });
  }

}
