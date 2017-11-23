interface InvestAsset {
  value: number;
}

export interface Invest {
  companyAddress: string;
  offerContractAddress: string;
  totalAmount: number;
  grossReturn: number;
  paybackMonths: number;
  investedIn: Date;
  assets: InvestAsset[];
}
