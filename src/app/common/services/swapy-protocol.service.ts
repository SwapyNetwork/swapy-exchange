import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';
import { WalletService } from './wallet.service';
import { ErrorLogService } from './error-log.service';

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

  constructor(protected web3Service: Web3Service, protected walletService: WalletService,
    public errorLogService: ErrorLogService, public http: HttpClient) {
    this.web3 = this.web3Service.getInstance();

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
        reject(840);
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
      .send({
        from: this.walletService.getWallet().address, gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public async invest(assetsAddress: string[], assetsValues: number[]) {
    const BigNumber = this.web3.utils.BN;
    const ethPrice = await this.getEthPrice();
    assetsValues = assetsValues.map(value => value / (ethPrice as number));
    const assetValue = (this.web3.utils.toWei(assetsValues[0]));
    const value = assetValue * assetsValues.length;
    // console.log(assetValue === value / assetsValues.length);
    // value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
    return this.SwapyExchangeContract.methods
      .invest(assetsAddress, assetValue)
      .send({
        from: this.walletService.getWallet().address,
        gas: 400000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei'),
        value: value
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
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
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
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
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
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
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
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
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
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
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      }).on('transactionHash', (hash) => {
        this.handleOnTransactionHash(hash);
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public cancelSellOrder(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .cancelSellOrder()
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
      })
      .on('error', (error) => {
        this.handleOnError(error);
      });
  }

  public cancelSale(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .cancelSale()
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

  public refuseSale(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .refuseSale()
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

  public acceptSale(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .acceptSale()
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

  public requireToken(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .requireTokenFuel()
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
