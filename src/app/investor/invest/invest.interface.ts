interface InvestAsset {
  uuid: string;
  value: number;
  investedIn: Date;
}

export interface Invest {
  uuid: string;
  companyUuid: string;
  companyName: string;
  offerUuid: string;
  totalAmount: number;
  roi: number;
  paybackMonths: number;
  assets: InvestAsset[];
}
