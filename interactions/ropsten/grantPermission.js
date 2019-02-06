const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");
const Item = artifacts.require("./Item");

const fs = require("fs");

var config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

const N = config["ropsten"]["trials"];

/**
 * This script should be executed with truffle exec "script path" --network ropsten
 * This script is paired with rate.js where both perform a loop of grant permission - rate actions
 * 
 * The aim is to have a certain number of ratings on an Item to see how much does it take to computeRate() to execute
 * 
 * WARNING Before executing this script, be sure that in truffle.js the account connected with infura is the same
 * of the owner of the item to rate
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
    const address = await web3.currentProvider.getAddress(); // Item owner

    const rsf = await Framework.deployed();
    const item = await Item.at(config["ropsten"]["item"]);
    const owner = await item.owner();
    const rater = config["ropsten"]["rater"];

    if(owner.toLowerCase() != address) {
        console.log("WARINING You are not connected with the item's owner");
        console.log("Account: " + address);
        console.log("Owner: " + owner);
        return;
    }

    console.log("Account " + address);

    let i = 0;

    const grantLoop = setInterval(async() => {

        const permission = await item.checkForPermission(rater);

        if(permission != 0) {
            // Ok, I can rate
            await item.grantPermission(rater); // Ricordarsi che su ropsten ci sono i contratti "vecchi" con rate con 2 parametri
            console.log("granted permission " + i);
            i++;
        }
        else {
            console.log("Wait for him to rate");
        }

        if (i == N) {
            console.log("Granting loop loop is over");
            clearInterval(grantLoop);
        }

    }, 30000); // every 50 secs
}
