#!/bin/bash
rm -rf ../src/contracts/ganache
mkdir ../src/contracts/ganache 
#$1 = Docker container name , i.e, stranger_name
sudo docker cp $1:home/swapy/www/swapy-exchange-protocol/build/contracts/SwapyExchange.json  ../src/contracts/ganache/
sudo docker cp $1:home/swapy/www/swapy-exchange-protocol/build/contracts/InvestmentAsset.json ../src/contracts/ganache/
sudo docker cp $1:home/swapy/www/swapy-exchange-protocol/build/contracts/AssetLibrary.json ../src/contracts/ganache/
sudo docker cp $1:home/swapy/www/swapy-exchange-protocol/build/contracts/Token.json ../src/contracts/ganache/

