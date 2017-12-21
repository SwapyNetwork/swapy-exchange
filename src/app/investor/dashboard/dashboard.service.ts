import { Injectable } from '@angular/core';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { LoadingService } from '../../common/services/loading.service';
import { StorageService } from '../../common/services/storage.service';
import { PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offerAssetStatus.interface';


@Injectable()
export class DashboardService {
  public investments;

  constructor(
    private swapyProtocol: SwapyProtocol,
    private errorLogService: ErrorLogService,
    private walletService: WalletService,
    private web3Service: Web3Service,
    private storageService: StorageService,
    private loadingService: LoadingService) { }

  public getCachedInvestments() {
    return this.investments;
  }

  private async getBlockTimestamp(blockHash: string) {
    return (await this.web3Service.getInstance().eth.getBlock(blockHash)).timestamp;
  }

  private async getAssetValues(assets: any[]): Promise<any[]> {
    const promises = [];
    assets.forEach(asset => {
      promises.push(this.swapyProtocol.getAsset(asset));
    });

    return Promise.all(promises);
  }

  private setInvestmentDetails(newInvestment, assetValues) {
    newInvestment.paybackMonths = assetValues[3] / 30;
    newInvestment.totalAmount = assetValues[2] * newInvestment.assets.length / 100;
    newInvestment.grossReturn = assetValues[4] / 10000;
    newInvestment.creditCompanyAddress = assetValues[0];
  }

  private async buildNewInvestment(investment, assetValues) {
    const timestamp = await this.getBlockTimestamp(investment.blockHash);

    return {
      boughtAt: (new Date(timestamp * 1000)).toISOString(),
      investedAt: (new Date(assetValues[0][8] * 1000)).toISOString(),
      assets: [],
      totalAmount: 0,
      grossReturn: 0,
      paybackMonths: 0,
      creditCompanyAddress: null,
      type: investment.event
    };
  }

  async buildInvestment(investment) {
    const assets = await this.getAssetValues(investment.returnValues._assets);

    const newInvestment = await this.buildNewInvestment(investment, assets);

    let myAsset;
    assets.forEach(async (asset, index) => {
      if (asset[6].toLowerCase() === this.walletService.getWallet().address.toLowerCase() ||
          asset[10].toLowerCase() === this.walletService.getWallet().address.toLowerCase()) {
        const storagedStatus = this.storageService.getItem(investment.returnValues._assets[index]);
        let status;
        if (storagedStatus === null || storagedStatus !== Number(asset[5])) {
          status = Number(asset[5]);
        } else {
          status = PENDING_ETHEREUM_CONFIRMATION;
        }
        newInvestment.assets.push({
          contractAddress: investment.returnValues._assets[index],
          status,
          value: asset[2] / 100,
          boughtValue: asset[11] / 100,
          investor: asset[6].toLowerCase(),
          buyer: asset[10].toLowerCase()
        });

        myAsset = asset;
      }
    });

    if (myAsset) {
      this.setInvestmentDetails(newInvestment, myAsset);
    }

    return newInvestment;
  }

  public deleteDuplicatedAssets(investments) {
    for (let index = investments.length - 1; index >= 0; index--) {
        investments[index].assets.forEach(asset => {
          for (let i = index - 1; i >= 0; i--) {
            investments[i].assets.forEach((prevAsset, prevIndex) => {
              if (prevAsset.contractAddress.toLowerCase() === asset.contractAddress.toLowerCase()) {
                investments[i].assets.splice(prevIndex, 1);
              }
          });
        }
      });
    }

    return investments.filter(investment => investment.assets.length > 0);

  }

  async getMyInvestmentsFromBlockchain() {
    let investments = await this.swapyProtocol.get('Investments')
      .filter(investment => investment.returnValues._investor.toLowerCase() === this.walletService.getWallet().address.toLowerCase());
    const bought = await this.swapyProtocol.get('Bought')
      .filter(investment => investment.returnValues._buyer.toLowerCase() === this.walletService.getWallet().address.toLowerCase());
    const promises = [];
    bought.forEach(asset => {
      asset.returnValues._assets = [asset.returnValues._asset];
    })
    investments = investments.concat(bought);
    investments.forEach((investment) => {
      promises.push(this.buildInvestment(investment));
    });
    this.investments = await Promise.all(promises);
    this.investments = this.deleteDuplicatedAssets(this.investments);
    return this.investments;
  }
}
