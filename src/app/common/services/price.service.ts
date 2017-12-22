
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PriceService {

    protected ethPriceProvider = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';

    constructor(public http: HttpClient) {}

    private async getEthPrice() {
        return new Promise((resolve, reject) => {
            this.http.get(this.ethPriceProvider).subscribe(data => {
                resolve(data[0].price_usd);
            }, error => {
                resolve(440.0);
            });
        });
    }

    public async usdToEth(usd: number) {
        console.log(usd);
        const ethPrice = await this.getEthPrice();
        console.log(ethPrice);
        return usd / (ethPrice as number);
    }
}
