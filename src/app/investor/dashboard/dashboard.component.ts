import { Component, OnInit } from '@angular/core';
import { InvestService } from './../invest/invest.service';
import { EventService } from '../../common/services/event.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public investments;

  constructor(private investService: InvestService, private eventService: EventService,
    private exchangeService: ExchangeService) { }

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
    this.eventService.findByInvestor().then(events => {
      (events as [any]).forEach(event => {
        this.exchangeService.getEvents(event.uuid, 'Agreements', (error, ev) => {
          if (error) {
            console.error(error);
          } else if (ev.length > 0) {
            console.log(ev);
            this.investService.updateMinedAgreement({ eventUuid: event.uuid, eventContent: ev[ev.length - 1] }).then(res => {
              this.updateInvestments();
            }).catch(err => {
              console.error(err);
            });
          }
        });

      })
    });

  }

}
