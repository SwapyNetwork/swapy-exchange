#!/bin/bash
rm src/contracts/*
cp ../../swapy-exchange-protocol/build/contracts/SwapyExchange.json src/contracts
cp ../../swapy-exchange-protocol/build/contracts/InvestmentAsset.json src/contracts
cp ../../swapy-exchange-protocol/build/contracts/FinId.json src/contracts
