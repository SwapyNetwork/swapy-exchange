import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from './toastr.service';
import { ErrorLogService } from './error-log.service';
import { PriceService } from './price.service';
import { UportService } from './uport.service';
import { Web3Service } from './web3.service';
import { ProtocolStrategy } from '../interfaces/protocol.strategy.interface';

const env = require('../../../../env.json');

const SwapyExchange = require(`../../../contracts/${(env as any).NETWORK_NAME}/SwapyExchange.json`);
const AssetLibrary = require(`../../../contracts/${(env as any).NETWORK_NAME}/AssetLibrary.json`);
const InvestmentAsset = require(`../../../contracts/${(env as any).NETWORK_NAME}/InvestmentAsset.json`);


@Injectable()
export class UportProtocolService implements ProtocolStrategy {

  protected uportWeb3;
  protected web3;

  private SwapyExchangeContract;
  private AssetLibraryContract;
  private InvestmentAssetContract;

  constructor(protected toastrService: ToastrService,
    public errorLogService: ErrorLogService,
    public http: HttpClient,
    public priceService: PriceService,
    public uportService: UportService,
    public web3Service: Web3Service) {

    this.uportWeb3 = this.uportService.getWeb3();
    this.web3 = this.web3Service.getInstance();

    const SwapyExchangeContractABI = this.uportWeb3.eth.contract((SwapyExchange as any).abi);
    this.SwapyExchangeContract = SwapyExchangeContractABI.at(this.getAddressFromBuild(SwapyExchange));
    this.AssetLibraryContract = this.uportWeb3.eth.contract((AssetLibrary as any).abi);
    this.InvestmentAssetContract = this.uportWeb3.eth.contract((InvestmentAsset as any).abi);

}

  private getAddressFromBuild(build: any) {
    let networkId;
    const networkIds = Object.keys(build.networks);
    (env as any).NETWORK_ID ? networkId = (env as any).NETWORK_ID : networkId = networkIds[networkIds.length - 1];
    return build.networks[networkId].address;
  }

  public async getAsset(contractAddress: string) {
    const assetContract = await this.InvestmentAssetContract.at(contractAddress);
    return new Promise((resolve, reject) => {
        assetContract.getAsset((error, data) => {
          if (error) {
            reject(error);
          }
          resolve(data);
        });
    });
  }

  public async getAssetConstants(contractAddress: string, constantNames: string[]) {
    const assetContract = await this.InvestmentAssetContract.at(contractAddress);
    const promises = [];
    const contractObj = {};
    constantNames.forEach(constant => {
      promises.push(
        new Promise((resolve, reject) => {
            assetContract[constant].call((error, value) => {
                if (error) {
                    reject(error);
                }
                contractObj[constant] = value;
                resolve(value);
            });
        })
      );
    });
    return Promise.all(promises).then(resolved => (contractObj as any));
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

  public createOffer(payback: number, grossReturn: number, currency: string, value: number, offerTermsHash: string, assets: number[]) {
    const self = this;
    return new Promise((resolve, reject) => {
      this.SwapyExchangeContract
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
            }
          )
      })
    })
  }

  public async invest(assetAddress: string[], ethValue: number) {
    return new Promise((resolve, reject) => {
      this.SwapyExchangeContract
      .invest(assetAddress, {
        value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
      }, (error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your investment is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () {},
          function successCB (data) {
            resolve(data);
          }
        )
      })
    })
  }

  public async withdrawFunds(contractAddress: string) {
    const assetLibraryContract = await this.AssetLibraryContract.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContract
      .withdrawFunds((error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your withdrawal request is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () { },
          function successCB (data) {
            resolve(data);
          }
        )
      })
    })
  }

  public async refuseInvestment(contractAddress: string) {
    const assetLibraryContract = await this.AssetLibraryContract.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContract
      .refuseInvestment((error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your refusement is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () { },
          function successCB (data) {
            resolve(data);
          }
        )
      })
    })
  }

  public async returnInvestment(contractAddress: string, ethValue: number) {

    const assetLibraryContract = await this.AssetLibraryContract.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContract
      .returnInvestment({
        value: this.web3.utils.toWei(Math.round(ethValue * Math.pow(10, 18)) / Math.pow(10, 18))
      }, (error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your investment return is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () { },
          function successCB (data) {
            resolve(data);
          }
        )
      })
    })
  }

  public async cancelInvestment(contractAddress: string) {
    const assetLibraryContract = await this.AssetLibraryContract.at(contractAddress);
    return new Promise((resolve, reject) => {
      assetLibraryContract
      .cancelInvestment((error, txHash) => {
        if (error) {
          reject(error);
        }
        this.toastrService.getInstance().success('Your cancelment is being processed by the Ethereum blockchain.');
        this.waitForMined(txHash, { blockNumber: null }, // see next area
          function pendingCB () { },
          function successCB (data) {
            resolve(data);
          }
        )
      })
    })
  }


}
