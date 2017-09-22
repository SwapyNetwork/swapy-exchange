interface InvestmentAsset {
	uuid: string;
	value: number;
};

export interface Investment {
	uuid: string;
	companyId: string;
	companyName: string;
	offerUuid: string;
	totalAmount: number;
	roi: number;
	paybackMonths: number;
	investedIn: Date;
	assets: InvestmentAsset[];
};
