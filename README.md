# Swapy Exchange Dapp

![](https://www.swapy.network/images/swapy-exchange-screen.png)


This project is the frontend of [Swapy Exchange](https://github.com/swapynetwork/swapy-exchange-protocol).

[![Join the chat at https://gitter.im/swapynetwork/general](https://badges.gitter.im/swapynetwork/general.svg)](https://gitter.im/swapynetwork/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Installing

Currently there are 2 options to run the Swapy Electron Dapp in development mode:
1. Run the web app locally connected to the testnet (Rinkeby or Ropsten).
2. Run the web app locally connected to a local blockchain using Ganache.

### **1.** Running in the testnet

Clone the repo:
```
git clone https://github.com/SwapyNetwork/swapy-exchange.git
```

Install the dependencies:
```
npm i
```

Create an `env.json` file from the `sample.env.json` that we provide:
```shell
cp sample.env.json env.json
```

Edit the `env.json` to include your infura key for the HTTP_PROVIDER:
```diff
{
- "HTTP_PROVIDER": "infuraAddress",
+ "HTTP_PROVIDER": "https://rinkeby.infura.io/yourInfuraKey",
  "TEST_RPC_PROVIDER": "http://localhost:8545",
  "WS_PROVIDER": "infuraAddress",
  "BLOCK_EXPLORER_URL": "https://rinkeby.etherscan.io/address/",
  "ENV": "testnet",
  "NETWORK_ID": "4",
  "NETWORK_NAME": "rinkeby"
}
```
Notice that we're connecting to Rinkeby. To connect on Ropsten, use the `NETWORK_ID = 3` and update the other variables.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Using Docker
Optionally, we provide a Dockerfile to run the app using the testnet. To buildit and run it, follow these steps:

Create your Dockerfile from our sample:
```
cp docker/sample.Dockerfile docker/Dockerfile
```

Edit the Docker file to include your infura provider in the env variables at line 9:
```diff
  ENV SWAPY_PROTOCOL_REPOSITORY https://github.com/swapynetwork/swapy-exchange-protocol
  ENV SWAPY_EXCHANGE_REPOSITORY https://github.com/swapynetwork/swapy-exchange
  ENV SWAPY_EXCHANGE_VERSION master
  ENV NETWORK_NAME rinkeby
  ENV NETWORK_ID 4
+ ENV HTTP_PROVIDER "https://rinkeby.infura.io/yourkey"
  ENV WS_PROVIDER ""
  ENV TEST_RPC_PROVIDER "http://localhost:8545"
  ENV DAPP_ENV test
  ENV SWAPY_USER swapy
  ENV SWAPY_PASSWORD 123456
  ENV SWAPY_HOME /home/${SWAPY_USER}
```

Build the Docker container (it may take a while)
```
sudo docker build -t swapy-exchange docker/
```

Run the Docker container
```
sudo docker run -t swapy-exchange
```

Navigate to `http://localhost:4200/`.

### **2.** Running with Ganache

Clone and follow the instructions to install locally [swapy-exchange-protocol](https://github.com/swapynetwork/swapy-exchange-protocol) and build the Smart Contracts.

Clone this repository under the same directory.
```
|- swapy-exchange
|- swapy-exchange-protocol
```

Copy the contracts:
```javascript
cd swapy-exchange && npm run copy
```

Create an `env.json` file from the `sample.env.json` that we provide:
```shell
cp sample.env.json env.json
```

Edit the `env.json` to include the correct variables:
``` javascript
{
  "HTTP_PROVIDER": "",
  "TEST_RPC_PROVIDER": "http://localhost:8545",
  "WS_PROVIDER": "",
  "BLOCK_EXPLORER_URL": "",
  "ENV": "dev",
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
