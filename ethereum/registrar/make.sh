#!/bin/bash

commd=$1

if [ -z $commd ]
then
  echo compiling ...
  solcjs --bin --abi --optimize -o ./build Registrar.sol
fi

if [ "$commd" = "clean" ]
then
  echo cleaning ...
  rm -rf build
fi
