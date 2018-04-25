interface OfferAsset {
  value: number;
  investorAddress: string;
  contractAddress: string;
  status: string | number;
  investedAt: Date;
};

export interface Offer {
  raisingAmount: number;
  paybackMonths: number;
  grossReturn: number;
  walletAddress: string;
  companyAddress: string;
  assets: OfferAsset[];
  createdOn: string;
  contractAddress: string;
  displayWalletAddress: string;
};
