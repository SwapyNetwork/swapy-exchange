export interface Offer {
    companyUuid: string; // UserModel.uuid
    companyName: string; // UserModel.firstName + // UserModel.lastName
    companyPicture: string;
    companyCreatedAt: Date;
    raisingAmount: number;
    roi: number;
    paybackMonths: number;
    createdOn: Date;
    active: boolean;
    uuid: string;
    walletAddress: string;
}
