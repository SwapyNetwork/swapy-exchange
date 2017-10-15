interface InvestAsset {
  uuid: string;
  value: number;
}

export interface Invest {
  uuid: string;
  companyUuid: string;
  companyName: string;
  offerUuid: string;
  totalAmount: number;
  roi: number;
  paybackMonths: number;
  investedIn: Date;
  assets: InvestAsset[];
  contractAddress: string;
}
