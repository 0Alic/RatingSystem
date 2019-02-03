const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");
const Item = artifacts.require("./Item");
const User = artifacts.require("./User");

const fs = require("fs");

var config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

module.exports = async () => {

    console.log("initItem.js: start");

    const bob = config["development"]["bob"];
    const rsf = await Framework.deployed();
    let tx = await rsf.createUser(web3.utils.fromUtf8("Bob"), {from: bob});
    const usrAddr = await rsf.getMyUserContract({from: bob});
    const bobUser = await User.at(usrAddr);

    const registryAddr = await rsf.computerRegistry();
    const registry = await ComputerRegistry.at(registryAddr);
    const computer = await registry.getComputer(0);

    tx = await bobUser.createItem(web3.utils.fromUtf8("Bob Content"), computer, {from: bob});
    const itemAddr = await bobUser.getItemByIndex(0);

    console.log("Item: " + itemAddr);

    config["development"]["item"] = itemAddr;

    const json = JSON.stringify(config, null, 4);
    console.log(json)
    fs.writeFileSync('./interactions/config.json', json, 'utf8');

    console.log("initItem.js: end");
}
