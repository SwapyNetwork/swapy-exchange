import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from './web3.service';
import { WalletService } from './wallet.service';
import { ToastrService } from './toastr.service';
import { ErrorLogService } from './error-log.service';
import { StorageService } from './storage.service';

const env = require('../../../../env.json');

const SwapyExchange = require(`../../../contracts/${(env as any).NETWORK_NAME}/SwapyExchange.json`);
const AssetLibrary = require(`../../../contracts/${(env as any).NETWORK_NAME}/AssetLibrary.json`);
const InvestmentAsset = require(`../../../contracts/${(env as any).NETWORK_NAME}/InvestmentAsset.json`);


@Injectable()
export class SwapyProtocolService {
  protected web3;
  protected uportWeb3;
  protected gasPrice = 1;

  protected ethPriceProvider = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

  private SwapyExchangeContract;
  private AssetLibraryContract;
  private InvestmentAssetContract;

  private SwapyExchangeContractUport;
  private AssetLibraryContractUport;
  private InvestmentAssetContractUport;

  constructor(protected toastrService: ToastrService,
    protected web3Service: Web3Service,
    protected walletService: WalletService,
    protected storageService: StorageService,
    public errorLogService: ErrorLogService, public http: HttpClient) {
    this.web3 = this.web3Service.getInstance(false);
    this.SwapyExchangeContract = new this.web3.eth.Contract((SwapyExchange as any).abi, this.getAddressFromBuild(SwapyExchange));
    this.AssetLibraryContract = new this.web3.eth.Contract((AssetLibrary as any).abi);
    this.InvestmentAssetContract = new this.web3.eth.Contract((InvestmentAsset as any).abi);

    if (this.storageService.getItem('uPort')) {
      this.uportWeb3 = this.web3Service.getInstance(this.storageService.getItem('uPort'));
      const SwapyExchangeContractABI = this.uportWeb3.eth.contract((SwapyExchange as any).abi);
      this.SwapyExchangeContractUport = SwapyExchangeContractABI.at(this.getAddressFromBuild(SwapyExchange));
      this.AssetLibraryContractUport = this.uportWeb3.eth.contract((AssetLibrary as any).abi);
      this.InvestmentAssetContractUport = this.uportWeb3.eth.contract((InvestmentAsset as any).abi);
    }
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

    // Callback handler for whether it was mined or not
  private waitForMined = (txHash, response, pendingCB, successCB) => {
    if (response.blockNumber) {
      successCB()
    } else {
      pendingCB()
        this.pollingLoop(txHash, response, pendingCB, successCB)
    }
  }

  // Recursive polling to do continuous checks for when the transaction was mined
  private pollingLoop = (txHash, response, pendingCB, successCB) => {
    const self = this;
    setTimeout(function () {
      this.web3.eth.getTransaction(txHash, (error, response) => {
        if (error) { throw error }
          if (response === null) {
            response = { blockNumber: null }
          } // Some ETH nodes do not return pending tx
          self.waitForMined(txHash, response, pendingCB, successCB)
      })
    }, 1000) // check again in one sec.
  }

  public createOfferUport(payback: number, grossReturn: number, currency: string, value: number, offerTermsHash: string, assets: number[]) {
    const self = this;
    return new Promise((resolve, reject) => {
      this.SwapyExchangeContractUport
      .createOffer(payback,
        grossReturn * 10000,
        currency,
        assets,
        (error, txHash) => {
          if (error) {
            reject(error);
          }
          this.toastrService.getInstance().success('Your fundraising offer is being processed by the Ethereum blockchain.');
          this.waitForMined(txHash, { blockNumber: null }, // see next area
            function pendingCB () { },
            function successCB (data) {
              resolve(data);
              // Great Success!
              // Likely you'll call some eventPublisherMethod(txHash, data)
            }
          )
      })
    })
  }

  public createOfferMetamask(payback: number, grossReturn: number,
    currency: string, value: number, offerTermsHash: string, assets: number[]) {
    return this.SwapyExchangeContract.methods
      .createOffer(
        payback,
        grossReturn * 10000,
        currency,
        assets)
      .send({ from: this.walletService.getWallet().address, gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei') });
  }

  public createOffer(payback: number, grossReturn: number, currency: string, value: number, offerTermsHash: string, assets: number[]) {
    return this.storageService.getItem('uPort') ? this.createOfferUport(payback, grossReturn, currency, value, offerTermsHash, assets) :
      this.createOfferMetamask(payback, grossReturn, currency, value, offerTermsHash, assets);
  }

  public async investUport(assetAddress: string[], value: number) {
    const ethPrice = await this.getEthPrice();
    const ethValue = value / (ethPrice as number);

    return new Promise((resolve, reject) => {
      this.SwapyExchangeContractUport
      .invest(assetAddress, {
        value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
      }, (error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your investment is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () {
            // Signal to the user you're still waiting
            // for a block confirmation
          },
          function successCB (data) {
            resolve(data);
            // Great Success!
            // Likely you'll call some eventPublisherMethod(txHash, data)
          }
        )
      })
    })
  }

  public async investMetamask(assetAddress: string[], value: number) {
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

  public invest(assetAddress: string[], value: number) {
    return this.storageService.getItem('uPort') ? this.investUport(assetAddress, value) :
    this.investMetamask(assetAddress, value);
  }

  public async withdrawFundsMetamask(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .withdrawFunds()
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      });
  }
  public async withdrawFundsUport(contractAddress: string) {
    const assetLibraryContractUport = await this.AssetLibraryContractUport.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContractUport
      .withdrawFunds((error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your withdrawal request is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () {
            // Signal to the user you're still waiting
            // for a block confirmation
          },
          function successCB (data) {
            resolve(data);
            // Great Success!
            // Likely you'll call some eventPublisherMethod(txHash, data)
          }
        )
      })
    })
  }

  public withdrawFunds(contractAddress: string) {
    return this.storageService.getItem('uPort') ? this.withdrawFundsUport(contractAddress) :
    this.withdrawFundsMetamask(contractAddress);
  }

  public refuseInvestmentMetamask(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .refuseInvestment()
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      });
  }

  public async refuseInvestmentUport(contractAddress: string) {
    const assetLibraryContractUport = await this.AssetLibraryContractUport.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContractUport
      .refuseInvestment((error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your refusement is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () {
            // Signal to the user you're still waiting
            // for a block confirmation
          },
          function successCB (data) {
            resolve(data);
            // Great Success!
            // Likely you'll call some eventPublisherMethod(txHash, data)
          }
        )
      })
    })
  }

  public refuseInvestment(contractAddress: string) {
    return this.storageService.getItem('uPort') ? this.refuseInvestmentUport(contractAddress) :
    this.refuseInvestmentMetamask(contractAddress);
  }

  public async returnInvestmentMetamask(contractAddress: string, value: number) {
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

  public async returnInvestmentUport(contractAddress: string, value: number) {
    const ethPrice = await this.getEthPrice();
    const ethValue = value / (ethPrice as number);

    const assetLibraryContractUport = await this.AssetLibraryContractUport.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContractUport
      .returnInvestment({
        value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
      }, (error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your investment return is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () {
            // Signal to the user you're still waiting
            // for a block confirmation
          },
          function successCB (data) {
            resolve(data);
            // Great Success!
            // Likely you'll call some eventPublisherMethod(txHash, data)
          }
        )
      })
    })
  }

  public async returnInvestment(contractAddress: string, value: number) {
    return this.storageService.getItem('uPort') ? this.returnInvestmentUport(contractAddress, value) :
    this.returnInvestmentMetamask(contractAddress, value);
  }


  public async cancelInvestmentUport(contractAddress: string) {
    const assetLibraryContractUport = await this.AssetLibraryContractUport.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContractUport
      .cancelInvestment((error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your cancelment is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () {
            // Signal to the user you're still waiting
            // for a block confirmation
          },
          function successCB (data) {
            resolve(data);
            // Great Success!
            // Likely you'll call some eventPublisherMethod(txHash, data)
          }
        )
      })
    })
  }

  public cancelInvestmentMetamask(contractAddress: string) {
    this.AssetLibraryContract.options.address = contractAddress;
    return this.AssetLibraryContract.methods
      .cancelInvestment()
      .send({
        from: this.walletService.getWallet().address,
        gas: 150000,
        gasPrice: this.web3.utils.toWei(this.gasPrice, 'gwei')
      });
  }

  public async cancelInvestment(contractAddress: string) {
    return this.storageService.getItem('uPort') ? this.cancelInvestmentUport(contractAddress) :
    this.cancelInvestmentMetamask(contractAddress);
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
