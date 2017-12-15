# Swapy Exchange Dapp

![](https://www.swapy.network/images/swapy-exchange-screen.png)


This project is the frontend of [Swapy Exchange](https://github.com/swapynetwork/swapy-exchange-protocol).

[![Join the chat at https://gitter.im/swapynetwork/general](https://badges.gitter.im/swapynetwork/general.svg)](https://gitter.im/swapynetwork/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Installing

Clone and follow the instructions to install locally [swapy-exchange-protocol](https://github.com/swapynetwork/swapy-exchange-protocol).

Clone this repository under the same directory.

Copy the contracts:
``` shell
cp ../../swapy-exchange-protocol/build/contracts/SwapyExchange.json src/contracts/ganache
cp ../../swapy-exchange-protocol/build/contracts/InvestmentAsset.json src/contracts/ganache
cp ../../swapy-exchange-protocol/build/contracts/AssetLibrary.json src/contracts/ganache
```

Set up the `env.json` file:
```shell
cp sample.env.json env.json
```

Set up your providers
``` javascript
{
  "HTTP_PROVIDER": "",
  "TEST_RPC_PROVIDER": "",
  "WS_PROVIDER": "",
  "BLOCK_EXPLORER_URL": "https://network.etherscan.io/address/",
  "ENV": "test",
  "NETWORK_ID": "",
  "NETWORK_NAME": "ganache",
}

```

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.
