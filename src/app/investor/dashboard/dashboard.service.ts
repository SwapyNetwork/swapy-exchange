import { Injectable } from '@angular/core';
import { InvestmentAssetProtocolService as InvestmentAssetService } from '../../common/services/protocol/investment-asset.service';
import { ExchangeProtocolService as ExchangeService } from '../../common/services/protocol/exchange.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { LoadingService } from '../../common/services/loading.service';


@Injectable()
export class DashboardService {
  public investments;

  constructor(
    private exchangeService: ExchangeService,
    private walletService: WalletService,
    private web3Service: Web3Service,
    private loadingService: LoadingService,
    private investmentAssetService: InvestmentAssetService) { }

  public getCachedInvestments() {
    return this.investments;
  }

  public buildInvestments(investment) {
    return new Promise((resolve) => {
      this.web3Service.getInstance().eth.getBlock(investment.blockHash).then(block => {
        const newInvestment = {
          investedIn: (new Date(block.timestamp * 1000)).toISOString(),
          assets: [],
          totalAmount: 0,
          grossReturn: 0,
          paybackMonths: 0,
          creditCompanyAddress: null
        };
        investment.returnValues._assets.forEach((asset, index) => {
          this.investmentAssetService.getContract(asset).methods.getAsset().call().then(assetValues => {
            if (assetValues[6] === this.walletService.getWallet().address) {
              const newAsset = {
                contractAddress: asset,
                status: Number(assetValues[5]),
                value: assetValues[2] / 100
              };
              newInvestment.assets.push(newAsset);
            }
            if (!newInvestment.totalAmount) {
              newInvestment.paybackMonths = assetValues[3] / 30;
              newInvestment.totalAmount = assetValues[2] * investment.returnValues._assets.length / 100;
              newInvestment.grossReturn = assetValues[4] / 10000;
              newInvestment.creditCompanyAddress = assetValues[0];
            }
            if (index === investment.returnValues._assets.length - 1) {
              if (newInvestment.assets.length === 0) {
                resolve(false);
              } else {
                resolve(newInvestment);
              }
            }
          });
        });
      });
    });
  }

  public getMyInvestmentsFromBlockchain(): any {
    return new Promise(resolve => {
      this.loadingService.show();
      this.exchangeService.getMyInvestments(this.walletService.getWallet().address, (error, investmentsEvents) => {
        const promises = [];
        investmentsEvents.forEach((investment) => {
          promises.push(this.buildInvestments(investment));
        });

        Promise.all(promises).then(resolvedInvestments => {
          this.investments = resolvedInvestments.filter(investments => investments);
          resolve(this.investments);
          this.loadingService.hide();
        });
      });
    });
  }

}
