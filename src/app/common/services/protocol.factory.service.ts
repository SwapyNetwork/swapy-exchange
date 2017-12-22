import { Injectable } from '@angular/core';
import { UportProtocolService } from './uportProtocol.service';
import { Web3ProtocolService } from './web3Protocol.service';
import { StorageService } from './storage.service';

@Injectable()
export class ProtocolFactory {

    constructor(public uportProtocol: UportProtocolService,
        public web3Protocol: Web3ProtocolService,
        public storageService: StorageService) { }

    public getProtocol() {
        const uPort = this.storageService.getItem('uPort');
        return uPort ? this.uportProtocol : this.web3Protocol;
    }
}
