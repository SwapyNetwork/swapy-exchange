#!/bin/bash
rm src/contracts/rinkeby/*
cp ../../swapy-exchange-protocol/build/contracts/SwapyExchange.json src/contracts/rinkeby
cp ../../swapy-exchange-protocol/build/contracts/InvestmentAsset.json src/contracts/rinkeby
cp ../../swapy-exchange-protocol/build/contracts/AssetLibrary.json src/contracts/rinkeby
