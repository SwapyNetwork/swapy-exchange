FROM ubuntu:16.04
MAINTAINER luis[at]swapy.network

ENV SWAPY_PROTOCOL_REPOSITORY https://github.com/swapynetwork/swapy-exchange-protocol
ENV SWAPY_FAUCET_REPOSITORY https://github.com/swapynetwork/swapy-test-faucet
ENV SWAPY_PROTOCOL_VERSION master
ENV SWAPY_FAUCET_VERSION master

ENV WALLET_MNEMONIC "twelve words mnemonic ... potato bread coconut pencil"
ENV DEV_NETWORK_ID "number"
ENV TOKEN_ADDRESS "0xSomeHexAddress"

ENV SWAPY_USER swapy
ENV SWAPY_PASSWORD 123456
ENV SWAPY_HOME /home/${SWAPY_USER}

# Install environment dependencies
RUN apt-get update && apt-get install -y nano vim git curl make gcc build-essential g++ apt-utils
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs

# Create user ${SWAPY_USER}
RUN useradd -ms /bin/bash ${SWAPY_USER} && \
    echo "${SWAPY_USER}:${SWAPY_PASSWORD}" | chpasswd

# Go on user
USER ${SWAPY_USER}
WORKDIR ${SWAPY_HOME}

# Clone and build Swapy Test Faucet
RUN mkdir ./www && \
    export PATH=${SWAPY_HOME}/.npm-global/bin:$PATH && \
    export WALLET_MNEMONIC=${WALLET_MNEMONIC} && \
    export DEV_NETWORK_ID=${DEV_NETWORK_ID} && \
    cd ./www && \
    git clone ${SWAPY_FAUCET_REPOSITORY} && \
    cd ./swapy-test-faucet && \
    git checkout ${SWAPY_FAUCET_VERSION} && \
    npm install

# Clone and build Swapy Exchange Protocol
RUN export TOKEN_ADDRESS=${TOKEN_ADDRESS} && \
    cd ./www && \
    git clone ${SWAPY_PROTOCOL_REPOSITORY} && \
    cd ./swapy-exchange-protocol && \
    git checkout ${SWAPY_PROTOCOL_VERSION} && \
    npm install 
    
EXPOSE 8545
