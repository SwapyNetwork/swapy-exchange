import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Invest } from '../../invest/invest.interface';
import { AVAILABLE, PENDING_OWNER_AGREEMENT, INVESTED, FOR_SALE, PENDING_INVESTOR_AGREEMENT,
  RETURNED, DELAYED_RETURN, PENDING_ETHEREUM_CONFIRMATION } from '../../../common/interfaces/offer-asset-status.interface';
import { LinkService } from '../../../common/services/link.service';
import { SwapyProtocolService as SwapyProtocol } from '../../../common/services/swapy-protocol.service';
import { ToastrService } from '../../../common/services/toastr.service';
import { InvestService } from '../../invest/invest.service';
import { WalletService } from '../../../common/services/wallet.service';
import { ErrorLogService } from '../../../common/services/error-log.service';
import { StorageService } from '../../../common/services/storage.service';
import { Web3Service } from '../../../common/services/web3.service';
import { SellAssetService } from '../../sell-asset/sell-asset.service';

import * as env from '../../../../../env.json';

@Component({
  selector: 'app-dashboard-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements OnInit {

  @Input() public investment: Invest;
  @Input() public collapsed: boolean;
  //
  private walletAddress;
  private delayed: boolean;

  public AVAILABLE = AVAILABLE;
  public PENDING_OWNER_AGREEMENT = PENDING_OWNER_AGREEMENT;
  public INVESTED = INVESTED;
  public RETURNED = RETURNED;
  public DELAYED_RETURN = DELAYED_RETURN;
  public FOR_SALE = FOR_SALE;
  public PENDING_INVESTOR_AGREEMENT = PENDING_INVESTOR_AGREEMENT;
  public PENDING_ETHEREUM_CONFIRMATION = PENDING_ETHEREUM_CONFIRMATION;

  public explorerUrl = (<any>env).BLOCK_EXPLORER_URL;

  constructor(private linkService: LinkService,
    private swapyProtocol: SwapyProtocol,
    private investService: InvestService,
    private toastrService: ToastrService,
    private errorLogService: ErrorLogService,
    private storageService: StorageService,
    private sellAssetService: SellAssetService,
    private router: Router,
    private web3Service: Web3Service,
    private walletService: WalletService) { }

  ngOnInit() {
    this.walletAddress = this.walletService.getWallet().address.toLowerCase();
    this.isReturnDelayed();
  }

  public toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  public calculateReturnAmount() {
    return this.investment.totalAmount * (1 + this.investment.grossReturn);
  }

  public calculatePaybackDate() {
    const paybackDate = new Date(this.investment.investedAt);
    paybackDate.setMonth(paybackDate.getMonth() + this.investment.paybackMonths);
    return paybackDate;
  }

  public async isReturnDelayed() {
    const investedAt = new Date(this.investment.assets[0].investedAt);
    const latestBlock = (await this.web3Service.getInstance().eth.getBlock('latest'));
    const now = new Date(latestBlock.timestamp) as any;
    this.delayed = now.valueOf() > investedAt.setDate(investedAt.getDate() + this.investment.paybackMonths * 30).valueOf() ? true : false;
  }

  public statusToString(status) {
    let statusString;
    switch (status) {
      case this.AVAILABLE:
        statusString = '';
        break;
      case this.PENDING_OWNER_AGREEMENT:
        statusString = 'Pending credit company\'s confirmation';
        break;
      case this.INVESTED:
        statusString = 'Succesfully invested';
        break;
      case this.RETURNED:
        statusString = 'Succesfully returned';
        break;
      case this.FOR_SALE:
        statusString = 'For sale';
        break;
      case this.PENDING_INVESTOR_AGREEMENT:
        statusString = 'Pending confirmation to sell';
        break;
      case this.DELAYED_RETURN:
        statusString = 'Delayed return';
        break;
      case this.PENDING_ETHEREUM_CONFIRMATION:
        statusString = 'Pending transaction confirmation';
        break;
    }

    return statusString;

  }

  public exploreContract(address: string) {
    const url = this.explorerUrl + address;
    this.linkService.openLink(url);
  }

  public async cancelInvestment(asset) {
    const status = asset.status;
    this.storageService.setItem(asset.contractAddress, status);
    asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      await this.swapyProtocol.cancelInvestment(asset.contractAddress);
      this.toastrService.getInstance().success('Investment cancelled');
      this.storageService.getItem(asset.contractAddress);
    } catch (error) {
      this.storageService.remove(asset.contractAddress);
      asset.status = status;
      this.toastrService.getInstance().error(error.message);
    }
  }

  public sellAsset(asset) {
    this.sellAssetService.cacheAsset(asset);
    this.router.navigate(['investor/sell']);
  }

  public async cancelSellOrder(asset) {
    const status = asset.status;
    this.storageService.setItem(asset.contractAddress, status);
    asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      await this.swapyProtocol.cancelSellOrder(asset.contractAddress);
      this.toastrService.getInstance().success('Asset deleted of the Marketplace');
      this.storageService.getItem(asset.contractAddress);
    } catch (error) {
      this.storageService.remove(asset.contractAddress);
      asset.status = status;
      this.toastrService.getInstance().error(error.message);
    }
  }

  public async cancelSale(asset) {
    const status = asset.status;
    this.storageService.setItem(asset.contractAddress, status);
    asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      await this.swapyProtocol.cancelSale(asset.contractAddress);
      this.toastrService.getInstance().success('Purchase request cancelled');
      this.storageService.getItem(asset.contractAddress);
    } catch (error) {
      this.storageService.remove(asset.contractAddress);
      asset.status = status;
      this.toastrService.getInstance().error(error.message);
    }
  }

  public async refuseSale(asset) {
    const status = asset.status;
    this.storageService.setItem(asset.contractAddress, status);
    asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      await this.swapyProtocol.refuseSale(asset.contractAddress);
      this.toastrService.getInstance().success('Purchase request cancelled');
      this.storageService.getItem(asset.contractAddress);
    } catch (error) {
      this.storageService.remove(asset.contractAddress);
      asset.status = status;
      this.toastrService.getInstance().error(error.message);
    }
  }

  public async acceptSale(asset) {
    const status = asset.status;
    this.storageService.setItem(asset.contractAddress, status);
    asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      await this.swapyProtocol.acceptSale(asset.contractAddress);
      this.toastrService.getInstance().success('Asset sold');
      this.storageService.getItem(asset.contractAddress);
    } catch (error) {
      this.storageService.remove(asset.contractAddress);
      asset.status = status;
      this.toastrService.getInstance().error(error.message);
    }
  }

  public async requireToken(asset) {
    const status = asset.status;
    this.storageService.setItem(asset.contractAddress, status);
    asset.status = PENDING_ETHEREUM_CONFIRMATION;
    try {
      await this.swapyProtocol.requireToken(asset.contractAddress);
      this.toastrService.getInstance().success('Tokens received');
      this.storageService.getItem(asset.contractAddress);
    } catch (error) {
      this.storageService.remove(asset.contractAddress);
      asset.status = status;
      this.toastrService.getInstance().error('Not eligible to receive SWAPY Tokens. Investment return is not delayed yet.');
    }
  }
}
