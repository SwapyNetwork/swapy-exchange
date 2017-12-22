export interface ProtocolStrategy {

  getAsset(contractAddress: string): any;
  getAssetConstants(contractAddress: string, constantNames: string[]): Promise<any>;
  createOffer(
      payback: number,
      grossReturn: number,
      currency: string,
      value: number,
      offerTermsHash: string,
      assets: number[]): Promise<any>;
  invest(assetAddress: string[], value: number): Promise<any>;
  withdrawFunds(contractAddress: string): Promise<any>;
  refuseInvestment(contractAddress: string): Promise<any>;
  returnInvestment(contractAddress: string, value: number): Promise<any>;
  cancelInvestment(contractAddress: string): Promise<any>;

}
