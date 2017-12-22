interface InvestmentAsset {
  uuid: string;
  value: number;
  status: number;
};

export interface Investment {
  uuid: string;
  companyId: string;
  companyName: string;
  offerUuid: string;
  totalAmount: number;
  roi: number;
  paybackMonths: number;
  investedAt: Date;
  assets: InvestmentAsset[];
};
