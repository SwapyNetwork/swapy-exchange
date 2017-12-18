import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('SwapyExchange', {
    clientId: 'CLIENT_ID',
    network: 'rinkeby or ropsten or kovan',
    signer: SimpleSigner('SIGNING KEY')
})

const web3 = uport.getWeb3();
export { web3, uport };
