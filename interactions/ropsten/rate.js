const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");
const Item = artifacts.require("./Item");

const fs = require("fs");

var config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

const N = config["ropsten"]["trials"];
const itemAddress = config["ropsten"]["item"];

/**
 * This script should be executed with truffle exec "script path" --network ropsten
 * This script is paired with grantPermission.js where both perform a loop of grant permission - rate actions
 * 
 * The aim is to have a certain number of ratings on an Item to see how much does it take to computeRate() to execute
 * 
 * WARNING Before executing this script, be sure that in truffle.js the account connected with infura is the same
 * of "rater" in ../config.json
 * 
 * Usage
 * Involved files: rate.js, grantPermission.js truffle.js
 * - Be sure on truffle.js the account index on HDWalletProvider correspond to the account that has deployed the item
 * - run: truffle exec path/grantPermission.js --network ropsten
 * - Be sure on truffle.js the account index on HDWalletProvider correspond to the account that will rate (config.json["ropsten"]["rater"])
 * - run: truffle exec path/rate.js --network ropsten
 * 
 */
module.exports = async () => {

    console.log("init");

    const rsf = await Framework.deployed();
    const item = await Item.at(itemAddress);
    const rater = await web3.currentProvider.getAddress(); // Item rater

    console.log("Account " + rater);

    let i = 0;

    const rateLoop = setInterval(async() => {

        const permission = await item.checkForPermission(rater);

        if(permission == 0) {
            // Ok, I can rate
            const score = Math.floor(Math.random() * 10) + 1; // 1 -> 10
            await item.rate(score);
            console.log("rated " + itemAddress + ": " + i);
            i++;
        }
        else {
            console.log("I can't rate");
        }

        if (i == N) {
            console.log("Rating loop is over");
            clearInterval(rateLoop);
        }

    }, 30000); // every 50 secs
}
