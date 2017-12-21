import { Injectable } from '@angular/core';

@Injectable()
export class SellAssetService {

  private asset;

  constructor() { }

  public cacheAsset(asset) {
    this.asset = asset;
  }

  public getCachedAsset() {
    return this.asset;
  }

}
