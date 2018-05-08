import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';
import { WalletService } from './wallet.service';
import { ErrorLogService } from './error-log.service';
import { StorageService } from './storage.service';
import { SuccessfulInvestmentService } from '../../investor/successful-investment/successful-investment.service';
import { MessageService } from '../message/message.service';
import { BigNumber } from 'bignumber.js';

const env = require('../../../../env.json');

const SwapyExchange = require(`../../../contracts/${(env as any).NETWORK_NAME}/SwapyExchange.json`);
const AssetLibrary = require(`../../../contracts/${(env as any).NETWORK_NAME}/AssetLibrary.json`);
const InvestmentAsset = require(`../../../contracts/${(env as any).NETWORK_NAME}/InvestmentAsset.json`);
const Token = require(`../../../contracts/${(env as any).NETWORK_NAME}/Token.json`);


@Injectable()
export class SwapyProtocolService {
  protected web3;
  protected gasPrice = 1;

  protected ethPriceProvider = 'https://api.infura.io/v1/ticker/ethusd';

  private SwapyExchangeContract;
  private AssetLibraryContract;
  private InvestmentAssetContract;
  private Token;

  constructor(
    protected web3Service: Web3Service,
    protected walletService: WalletService,
    public errorLogService: ErrorLogService,
    public http: HttpClient,
    public successfulInvestmentService: SuccessfulInvestmentService,
    public messageService: MessageService,
    public storageService: StorageService
  ) {
    this.web3 = this.web3Service.getInstance();
    BigNumber.config({ DECIMAL_PLACES: 18 });

    if ((window as any).isElectron) {
      this.injectMetamaskPopupHandler(this.web3.eth.Contract);
    }
    this.SwapyExchangeContract = new this.web3.eth.Contract((SwapyExchange as any).abi, this.getAddressFromBuild(SwapyExchange));
    this.AssetLibraryContract = new this.web3.eth.Contract((AssetLibrary as any).abi);
    this.InvestmentAssetContract = new this.web3.eth.Contract((InvestmentAsset as any).abi);
    this.Token = new this.web3.eth.Contract((Token as any).abi, this.getAddressFromBuild(Token));
  }

  private injectMetamaskPopupHandler(contractFunction) {
    const origCall = contractFunction.prototype._executeMethod;
    contractFunction.prototype._executeMethod = function () {
      if (arguments[0] === 'send') {
        setTimeout(() => {
          (window as any).chrome.ipcRenderer.send('open-metamask-notification');
        }, 500)
      }
      return origCall.apply(this, arguments);
    };
  }
  private storeTransactionHash(addresses: string[], hash: string) {
    addresses.forEach(address => {
      this.storageService.setItem(address, hash);
    });

    let notifications = this.storageService.getItem('notifications');
    if (notifications == null) {
      this.storageService.setItem('notifications', {})
    }
    notifications = this.storageService.getItem('notifications');
    notifications[hash] = 0;
    this.storageService.setItem('notifications', notifications);
  }

  private handleOnTransactionHash(hash: string) {
    if ((window as any).isElectron) {
      (window as any).chrome.ipcRenderer.send('close-metamask-notification');
    }
  }

  private handleOnError(error: string) {
    if ((window as any).isElectron) {
      (window as any).chrome.ipcRenderer.send('close-metamask-notification');
    }
  }

  private getAddressFromBuild(build: any) {
    let networkId;
    const networkIds = Object.keys(build.networks);
    (env as any).NETWORK_ID ? networkId = (env as any).NETWORK_ID : networkId = networkIds[networkIds.length - 1];
    return build.networks[networkId].address;
  }

  public async getEthPrice() {
    return new Promise((resolve, reject) => {
      this.http.get(this.ethPriceProvider).subscribe(data => {
        resolve((data as any).bid);
      }, error => {
        reject(560); // On main net check if user has access to the internet. If not, do not log in.
      });
    });
  }

  public createOffer(payback: number, grossReturn: number, currency: string, value: number, assets: number[]) {
    return this.SwapyExchangeContract.methods
      .createOffer(
        payback,
        grossReturn * 10000,
        currency,
        assets)
      .send({
        from: this.walletService.getWallet().address, gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash([], hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public async invest(assetsAddress: string[], assetsValues: number[]) {
    let ethPrice = await this.getEthPrice();
    ethPrice = (ethPrice as number).toFixed(2);

    const assetValueBN = new BigNumber(assetsValues[0]).div(new BigNumber(ethPrice as number));
    const assetValue = (this.web3.utils.toWei(assetValueBN));
    const value = (this.web3.utils.toWei(assetValueBN.times(new BigNumber(assetsValues.length))));
    return this.SwapyExchangeContract.methods
      .invest(assetsAddress, assetValue)
      .send({
        from: this.walletService.getWallet().address,
        gas: 400000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei'),
        value: value
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public async withdrawFunds(contractAddresses: string[]) {
    return this.SwapyExchangeContract.methods
      .withdrawFunds(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.storeTransactionHash(contractAddresses, hash);
        this.handleOnTransactionHash(hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public refuseInvestment(contractAddresses: string[]) {
    return this.SwapyExchangeContract.methods
      .refuseInvestment(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public async returnInvestment(contractAddresses: string[], values: number[]) {
    const ethPrice = await this.getEthPrice();
    let total = new BigNumber(0);
    let eth;
    values.forEach(value => {
      eth = new BigNumber(value).div(new BigNumber(ethPrice as number));
      total = total.plus(eth);
    });
    const ethValue = this.web3.utils.toWei(total);
    const ethValues = values.map(value => this.web3.utils.toWei(new BigNumber(value).div(new BigNumber(ethPrice as number))));

    return this.SwapyExchangeContract.methods
      .returnInvestment(contractAddresses, ethValues)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei'),
        value: ethValue
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public cancelInvestment(contractAddresses: string[]) {
    return this.SwapyExchangeContract.methods
      .cancelInvestment(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public transferToken(contractAddress: string, value: number) {
    return this.Token.methods
      .approve(contractAddress, value)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public supplyTokenFuel(contractAddress: string, value: number) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .supplyFuel(value)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public sellAssets(contractAddresses: string[], values: number[]) {
    return this.SwapyExchangeContract.methods
      .sellAssets(contractAddresses, values)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');

      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public cancelSellOrder(contractAddresses: string[]) {
    return this.SwapyExchangeContract.methods
      .cancelSellOrder(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');

      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public async buyAsset(contractAddress: string, value: number) {
    const ethPrice = await this.getEthPrice();
    const ethValue = value / (ethPrice as number);

    return this.SwapyExchangeContract.methods
      .buyAsset(contractAddress)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei'),
        value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');

      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public cancelSale(contractAddresses: string[]) {
    return this.SwapyExchangeContract.methods
      .cancelSale(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');

      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public refuseSale(contractAddresses: string[]) {
    return this.SwapyExchangeContract.methods
      .refuseSale(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public acceptSale(contractAddresses: string[]) {
    return this.SwapyExchangeContract.methods
      .acceptSale(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.storeTransactionHash(contractAddresses, hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public requireToken(contractAddresses: string) {
    return this.SwapyExchangeContract.methods
      .requireTokenFuel(contractAddresses)
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000 * contractAddresses.length,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
        this.messageService.setLoadingState(true);
        this.messageService.setMessage('Your transaction is being processed. You will be notified when your transaction gets confirmed.');
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public get(event: string) {
    return this.SwapyExchangeContract.getPastEvents(event, {
      fromBlock: 0,
      toBlock: 'latest'
    });
  }

  public getAssetEvent(contractAddress: string, event: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.getPastEvents(event, {
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

  public async getTokenBalance() {
    return this.Token.methods
    .balanceOf(this.walletService.getWallet().address)
    .call();
  }
}
