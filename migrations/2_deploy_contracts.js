// Artifacts == truffle's contract abstraction
const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");

module.exports = function(deployer, network, accounts) {

    deployer.then(async () => {

        const alice = accounts[1]; // System creator
        const bob = accounts[3];   // Good user
        const carl = accounts[0];  // Bad user

        const system = await deployer.deploy(Framework, {from: alice});
/*
        const aa = await deployer.deploy(AA);
        await aa.insert(bob);
        await aa.remove(bob, {from: bob});
        await aa.insert(bob);
//        let tx = await system.createUser(web3.utils.fromUtf8("Bob"), {from: bob});
        const storageAddress = await aa.data();
        const storageContract = await Storage.at(storageAddress);
        await storageContract.remove(bob, {from: carl});
        console.log("Bob: " + await storageContract.owner());
        console.log("Carl: " + carl);
        console.log(await storageContract.isIn(bob));
*/
    }); 
};
