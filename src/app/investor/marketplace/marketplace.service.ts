import { Injectable } from '@angular/core';

@Injectable()
export class MarketplaceService {

  private cachedAsset;

  constructor() { }

  public cacheAsset(asset) {
    this.cachedAsset = asset;
  }

  public getCachedAsset() {
    return this.cachedAsset;
  }

}
