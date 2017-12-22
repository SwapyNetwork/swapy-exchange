#!/bin/bash
rm src/contracts/$1/*
cp ../swapy-exchange-protocol/build/contracts/SwapyExchange.json src/contracts/$1
cp ../swapy-exchange-protocol/build/contracts/InvestmentAsset.json src/contracts/$1
cp ../swapy-exchange-protocol/build/contracts/AssetLibrary.json src/contracts/$1
cp ../swapy-exchange-protocol/build/contracts/Token.json src/contracts/$1
