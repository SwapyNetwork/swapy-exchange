interface InvestAsset {
  value: number;
}

export interface Invest {
  companyAddress: string;
  creditCompanyAddress: string;
  companyName: string;
  offerContractAddress: string;
  totalAmount: number;
  grossReturn: number;
  paybackMonths: number;
  investedIn: Date;
  assets: InvestAsset[];
}
