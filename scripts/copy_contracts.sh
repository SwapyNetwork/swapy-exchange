#!/bin/bash
rm src/contracts/*
cp ../../swapy-exchange-protocol/build/contracts/SwapyExchange.json src/contracts
cp ../../swapy-exchange-protocol/build/contracts/InvestmentAsset.json src/contracts
cp ../../swapy-exchange-protocol/build/contracts/AssetLibrary.json src/contracts
