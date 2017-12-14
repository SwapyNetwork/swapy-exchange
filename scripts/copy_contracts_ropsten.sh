#!/bin/bash
rm src/contracts/ropsten/*
cp ../../swapy-exchange-protocol/build/contracts/SwapyExchange.json src/contracts/ropsten
cp ../../swapy-exchange-protocol/build/contracts/InvestmentAsset.json src/contracts/ropsten
cp ../../swapy-exchange-protocol/build/contracts/AssetLibrary.json src/contracts/ropsten
