import { Component, OnInit } from '@angular/core';
import { InvestService } from './../invest/invest.service';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { EventService } from '../../common/services/event.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { AGREE_INVESTMENT, TRANSFER_FUNDS } from '../../common/interfaces/events.interface';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public investments;

  constructor(
    private investService: InvestService,
    private eventService: EventService,
    private exchangeService: ExchangeService,
    private errorLogService: ErrorLogService,
    private investmentAssetService: InvestmentAssetService) { }

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
      const createOfferEvents = (events as [any]).forEach(event => {
        let eventType = '';
        switch (event.eventType) {
          case AGREE_INVESTMENT:
            eventType = 'Agreements';
            break;
          case TRANSFER_FUNDS:
            eventType = 'Transferred';
            break;
        }
        this.investmentAssetService.getEvents(event.uuid, eventType, event.data.contractAddress, (error, ev) => {
          if (error) {
            this.errorLogService.setClassName('DashboardComponent');
            this.errorLogService.setFunctionName('getUpdatesFromBlockchain');
            this.errorLogService.setError(error);
            console.error(error);
          } else if (ev.length > 0) {
            this.eventService.updateMined({ eventUuid: event.uuid, eventContent: ev[ev.length - 1].returnValues }).then(res => {
              this.updateInvestments();
            }).catch(err => {
              console.error(err);
            });
          }
        });
      });
    });
  }

}
