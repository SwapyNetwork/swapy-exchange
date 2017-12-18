import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';
import { WalletService } from './wallet.service';
import { ErrorLogService } from './error-log.service';

const env = require('../../../../env.json');

const SwapyExchange = require(`../../../contracts/${(env as any).NETWORK_NAME}/SwapyExchange.json`);
const AssetLibrary = require(`../../../contracts/${(env as any).NETWORK_NAME}/AssetLibrary.json`);
const InvestmentAsset = require(`../../../contracts/${(env as any).NETWORK_NAME}/InvestmentAsset.json`);


@Injectable()
export class SwapyProtocolService {
  protected web3;
  protected gasPrice = 1;

  protected ethPriceProvider = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

  private SwapyExchangeContract;
  private AssetLibraryContract;
  private InvestmentAssetContract;

  constructor(protected web3Service: Web3Service, protected walletService: WalletService,
    public errorLogService: ErrorLogService, public http: HttpClient) {
    this.web3 = this.web3Service.getInstance();
    this.SwapyExchangeContract = new this.web3.eth.Contract((SwapyExchange as any).abi, this.getAddressFromBuild(SwapyExchange));
    this.AssetLibraryContract = new this.web3.eth.Contract((AssetLibrary as any).abi);
    this.InvestmentAssetContract = new this.web3.eth.Contract((InvestmentAsset as any).abi);
  }

  private getAddressFromBuild(build: any) {
    let networkId;
    const networkIds = Object.keys(build.networks);
    (env as any).NETWORK_ID ? networkId = (env as any).NETWORK_ID : networkId = networkIds[networkIds.length - 1];
    return build.networks[networkId].address;
  }

  private async getEthPrice() {
    return new Promise((resolve, reject) => {
      this.http.get(this.ethPriceProvider).subscribe(data => {
        resolve(data[0].price_usd);
      }, error => {
        resolve(440.0);
      });
    });
  }

  public createOffer(payback: number, grossReturn: number, currency: string, value: number, offerTermsHash: string, assets: number[]) {
    return this.SwapyExchangeContract.methods
      .createOffer(
        payback,
        grossReturn * 10000,
        currency,
        assets)
      .send({ from: this.walletService.getWallet().address, gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei') });
  }

  public async invest(assetAddress: string[], value: number) {
    const ethPrice = await this.getEthPrice();
    const ethValue = value / (ethPrice as number);
    return this.SwapyExchangeContract.methods
      .invest(assetAddress)
      .send({
        from: this.walletService.getWallet().address,
        gas: 400000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei'),
        value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
      });
  }

  public withdrawFunds(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .withdrawFunds()
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      });
  }

  public refuseInvestment(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .refuseInvestment()
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      });
  }

  public async returnInvestment(contractAddress: string, value: number) {
    const ethPrice = await this.getEthPrice();
    const ethValue = value / (ethPrice as number);

    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .returnInvestment()
      .send({
        from: this.walletService.getWallet().address,
        gas: 100000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei'),
        value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
      });
  }

  public cancelInvestment(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .cancelInvestment()
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      });
  }

  public supplyToken(contractAddress: string, value: number) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .supplyToken(value)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      });
  }

  public get(event: string) {
    return this.SwapyExchangeContract.getPastEvents(event, {
      fromBlock: 0,
      toBlock: 'latest'
    });
  }

  public getAsset(contractAddress: string) {
    this.InvestmentAssetContract.options.address = contractAddress;
    return this.InvestmentAssetContract.methods
      .getAsset()
      .call();
  }

  public getAssetConstants(contractAddress: string, constantNames: string[]) {
    this.InvestmentAssetContract.options.address = contractAddress;
    const promises = [];
    const contractObj = {};
    constantNames.forEach(constant => {
      promises.push(this.InvestmentAssetContract.methods[constant]().call().then(value => {
        contractObj[constant] = value;
      }));
    })

    return Promise.all(promises).then(resolved => (contractObj as any));
  }
}
