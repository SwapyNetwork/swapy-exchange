FROM ubuntu:16.04
MAINTAINER icaro[at]swapy.network

ENV SWAPY_PROTOCOL_REPOSITORY https://github.com/swapynetwork/swapy-exchange-protocol
ENV SWAPY_EXCHANGE_REPOSITORY https://github.com/swapynetwork/swapy-exchange
ENV SWAPY_EXCHANGE_VERSION master
ENV NETWORK_NAME rinkeby
ENV NETWORK_ID 4
ENV HTTP_PROVIDER "https://rinkeby.infura.io/yourkey"
ENV WS_PROVIDER ""
ENV TEST_RPC_PROVIDER "http://localhost:8545"
ENV DAPP_ENV test
ENV SWAPY_USER swapy
ENV SWAPY_PASSWORD 123456
ENV SWAPY_HOME /home/${SWAPY_USER}

# Install environment dependencies
RUN apt-get update && apt-get install -y nano vim git curl make gcc build-essential g++ apt-utils
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash
RUN apt-get install -y nodejs

# Create user ${SWAPY_USER}
RUN useradd -ms /bin/bash ${SWAPY_USER} && \
    echo "${SWAPY_USER}:${SWAPY_PASSWORD}" | chpasswd

# Go on user
USER ${SWAPY_USER}
WORKDIR ${SWAPY_HOME}

# Config npm global dir
RUN mkdir ${SWAPY_HOME}/.npm-global && \
    npm config set prefix '${SWAPY_HOME}/.npm-global' && \
    echo "export PATH=${SWAPY_HOME}/.npm-global/bin:$PATH" >> ${SWAPY_HOME}/.profile && \
    export PATH=${SWAPY_HOME}/.npm-global/bin:$PATH && \
    npm install -g pm2 http-server webpack @angular/cli && \
    alias ng="${SWAPY_HOME}/.npm-global/lib/node_modules/@angular/cli/bin/ng"

# Clone and build Swapy Exchange
RUN mkdir ./www && \
    export PATH=${SWAPY_HOME}/.npm-global/bin:$PATH && \
    cd ./www && \
    git clone ${SWAPY_EXCHANGE_REPOSITORY} && \
    cd ./swapy-exchange && \
    git checkout ${SWAPY_EXCHANGE_VERSION} && \
    printf '{"HTTP_PROVIDER": "${HTTP_PROVIDER}", "TEST_RPC_PROVIDER": "${TEST_RPC_PROVIDER}", "WS_PROVIDER": "${WS_PROVIDER}", "BLOCK_EXPLORER_URL": "https://${NETWORK_NAME}.etherscan.io/address/", "ENV": "${DAPP_ENV}", "NETWORK_ID": "${NETWORK_ID}", "NETWORK_NAME": "${NETWORK_NAME}"}' >> env.json && \
    npm install
EXPOSE 4200
WORKDIR ${SWAPY_HOME}/www/swapy-exchange
CMD npm run start.dev
