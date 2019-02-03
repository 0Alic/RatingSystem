const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");
const Item = artifacts.require("./Item");

const fs = require("fs");

var config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

const N = config["development"]["trials"];

module.exports = async () => {

    console.log("init");

    const rsf = await Framework.deployed();
    const item = await Item.at(config["development"]["item"]);
//    const address = await web3.currentProvider.getAddress();
    const bob = config["development"]["bob"];
    const rater = config["development"]["rater"];

    console.log("Account " + rater);

    let i = 0;

    const rateLoop = setInterval(async() => {

        const permission = await item.checkForPermission(rater);

        if(permission == 0) {
            // Ok, I can rate
            await item.rate(5, {from: rater}); // Ricordarsi che su ropsten ci sono i contratti "vecchi" con rate con 2 parametri
            console.log("rated " + i);
            i++;
        }
        else {
            console.log("I can't rate");
        }

        if (i == N) {
            console.log("Rating loop is over");
            clearInterval(rateLoop);
        }

    }, 5000); // every 50 secs
}
