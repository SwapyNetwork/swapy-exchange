import { Injectable } from '@angular/core';
import { SwapyProtocolService as SwapyProtocol } from '../../common/services/swapy-protocol.service';
import { WalletService } from '../../common/services/wallet.service';
import { Web3Service } from '../../common/services/web3.service';
import { ErrorLogService } from '../../common/services/error-log.service';
import { LoadingService } from '../../common/services/loading.service';
import { StorageService } from '../../common/services/storage.service';
import { INVESTED, PENDING_ETHEREUM_CONFIRMATION } from '../../common/interfaces/offer-asset-status.interface';
import { OWNER, VALUE, PAYBACKDAYS, GROSSRETURN, STATUS,
  INVESTOR, INVESTEDAT, SELLDATA_BUYER, SELLDATA_VALUE, BOUGHTVALUE, TOKENFUEL } from '../../common/interfaces/asset-parameters.interface';

@Injectable()
export class DashboardService {
  public investments;
  public selectedAssets;

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
    newInvestment.paybackMonths = assetValues[PAYBACKDAYS] / 30;
    newInvestment.totalAmount = assetValues[VALUE] * newInvestment.assets.length / 100;
    newInvestment.grossReturn = assetValues[GROSSRETURN] / 10000;
    newInvestment.creditCompanyAddress = assetValues[OWNER];
  }

  private async buildNewInvestment(investment, assetValues) {
    const timestamp = await this.getBlockTimestamp(investment.blockHash);

    return {
      boughtAt: (new Date(timestamp * 1000)).toISOString(),
      investedAt: (new Date(assetValues[0][INVESTEDAT] * 1000)).toISOString(),
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
    const timestamp = await this.getBlockTimestamp(investment.blockHash);

    let myAsset;
    assets.forEach(async (asset, index) => {
      if (asset[INVESTOR].toLowerCase() === this.walletService.getWallet().address.toLowerCase() ||
          asset[SELLDATA_BUYER].toLowerCase() === this.walletService.getWallet().address.toLowerCase()) {
        const storedStatus = this.storageService.getItem(investment.returnValues._assets[index]);
        let status;
        if (storedStatus === null || storedStatus !== Number(asset[STATUS])) {
          status = Number(asset[STATUS]);
        } else {
          status = PENDING_ETHEREUM_CONFIRMATION;
        }
        newInvestment.assets.push({
          contractAddress: investment.returnValues._assets[index],
          status,
          value: asset[VALUE] / 100,
          boughtValue: asset[INVESTOR].toLowerCase() === this.walletService.getWallet().address.toLowerCase() ?
            asset[BOUGHTVALUE] / 100 : asset[SELLDATA_VALUE] / 100,
          investor: asset[INVESTOR].toLowerCase(),
          token: asset[TOKENFUEL] / Math.pow(10, 18),
          buyer: asset[SELLDATA_BUYER].toLowerCase(),


          paybackMonths: asset[PAYBACKDAYS] / 30,
          grossReturn: asset[GROSSRETURN] / 10000,
          creditCompanyAddress: asset[OWNER],
          boughtAt: (new Date(timestamp * 1000)).toISOString(),
          investedAt: (new Date(asset[INVESTEDAT] * 1000)).toISOString(),
          type: investment.event,
          selected: 0

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
    let assets = [];
    this.investments.forEach(investment => {
      assets = assets.concat(investment.assets);
    });
    return assets;
  }

  public setSelectedAssets(assets) {
    this.selectedAssets = assets;
  }

  public getSelectedAssets() {
    return this.selectedAssets;
  }
}
