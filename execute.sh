#!/bin/bash
options="arguments (--network):\n\t--network: development or ropsten"

if [ "$1" == "--help" ]; then
    echo -e $options
    exit 0
fi

if [ "$1" == "development" ]; then
    truffle migrate --reset
    echo "Executing initItem.js"
    truffle exec interactions/development/initItem.js
    echo "Executing grantPermission.js"
    truffle exec interactions/development/grantPermission.js &
    echo "Executing rate.js"
    truffle exec interactions/development/rate.js &
fi
