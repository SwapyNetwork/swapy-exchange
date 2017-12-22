import { Injectable } from '@angular/core';

@Injectable()
export class SupplyTokenService {

  private asset;

  constructor() { }

  public cacheAsset(asset) {
    this.asset = asset;
  }

  public getCachedAsset() {
    return this.asset;
  }

}
