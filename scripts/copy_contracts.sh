#!/bin/bash
rm src/contracts/ganache/*
cp ../swapy-exchange-protocol/build/contracts/SwapyExchange.json src/contracts/ganache
cp ../swapy-exchange-protocol/build/contracts/InvestmentAsset.json src/contracts/ganache
cp ../swapy-exchange-protocol/build/contracts/AssetLibrary.json src/contracts/ganache
