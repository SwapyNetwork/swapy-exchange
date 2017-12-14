interface OfferAsset {
  value: number;
  investorWallet: string;
  contractAddress: string;
  status: string | number;
  investedIn: Date;
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
