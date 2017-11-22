interface InvestAsset {
  value: number;
}

export interface Invest {
  uuid: string;
  companyWallet: string;
  offerContractAddress: string;
  totalAmount: number;
  grossReturn: number;
  paybackMonths: number;
  investedIn: Date;
  assets: InvestAsset[];
}
