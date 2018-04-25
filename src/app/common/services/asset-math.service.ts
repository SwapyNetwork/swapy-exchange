import { Injectable } from '@angular/core';

@Injectable()
export class AssetMathService {

  constructor() { }

  public calculateReturnAmount(asset) {
    return asset.value * (1 + asset.grossReturn);
  }

  public calculatePaybackDate(asset) {
    const paybackDate = new Date(asset.investedAt);
    paybackDate.setMonth(paybackDate.getMonth() + asset.paybackMonths);
    return paybackDate;
  }

  public calculateAssetProgression(asset) {
    const paybackDate = new Date(asset.investedAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() * 12 + now.getMonth()) - (paybackDate.getFullYear() * 12 + paybackDate.getMonth());
    return asset.investedAt === null ? 0 : monthsDiff;
  }

  public percentageProgression(asset) {
    const percentage = this.calculateAssetProgression(asset) * 100 / asset.paybackMonths;
    return Math.floor(percentage / 5) * 5;
  }

}
