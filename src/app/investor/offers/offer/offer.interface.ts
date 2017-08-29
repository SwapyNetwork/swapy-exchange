interface OfferAsset {
    uuid: string;
    value: number;
    investorID: string;
    investorName: string;
    investedIn: Date;
}

export interface Offer {
    uuid: string;
    raisingAmount: number;
    paybackMonths: number;
    roi: number;
    walletAddress: string;
    companyName: string;
    companyLogo: string;
	assets: OfferAsset[];
}
