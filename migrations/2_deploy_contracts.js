// Artifacts == truffle's contract abstraction
const Framework = artifacts.require("./RatingSystemFramework");
const User = artifacts.require("./User");
const Item = artifacts.require("./Item");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");
const WeightComputer = artifacts.require("./WeightedAverageComputer");

var Web3= require ("web3");

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

module.exports = function(deployer, network, accounts) {

    deployer.then(async () => {

        if(network=="development") {

            // Deploy on local network
            let tx;

            // Get accounts from Ganache
            const alice = accounts[1]; // System creator
            const bob = accounts[3];   // Item Owner
            const carl = accounts[0];  // Rater user

            // Get instance of Framework            
            const system = await deployer.deploy(Framework, {from: alice});

            // Populate ComputerRegistry
            const registryAddress = await system.computerRegistry();
            const registry = await ComputerRegistry.at(registryAddress);

            let pc = await deployer.deploy(WeightComputer, {from: alice});
            tx = await registry.pushComputer(pc.address, web3.utils.fromUtf8("Weighted Average"), {from: alice});
            // console.log("**** Push Computer gas used 1st:" + tx.receipt.gasUsed);

            pc = await deployer.deploy(SimpleComputer, {from: alice});
            tx = await registry.pushComputer(pc.address, web3.utils.fromUtf8("Simple Average"), {from: alice});
            // console.log("**** Push Computer gas used 2nd:" + tx.receipt.gasUsed);


            // Create Users
            tx = await system.createUser(web3.utils.fromUtf8("Bob"), {from: bob});
            // console.log("**** Create User gas used 1st:" + tx.receipt.gasUsed);
            tx = await system.createUser(web3.utils.fromUtf8("Carl"), {from: carl});
            // console.log("**** Create User gas used 2nd:" + tx.receipt.gasUsed);

            // Get Users
            let bobUser = await system.getMyUserContract({from: bob});
            bobUser = await User.at(bobUser);
            let carlUser = await system.getMyUserContract({from: carl});
            carlUser = await User.at(carlUser);
            
            // Create Items
            tx = await bobUser.createItem(web3.utils.fromUtf8("Innovation"), {from: bob});
            // console.log("**** Create Item gas used 1st:" + tx.receipt.gasUsed);
            tx = await bobUser.createItem(web3.utils.fromUtf8("7Wonders"), {from: bob});
            // console.log("**** Create Item gas used 2nd:" + tx.receipt.gasUsed);

            // Create a few ratings
            const items = await bobUser.getItems();
            let item1 = await Item.at(items[0]);
            let item2 = await Item.at(items[1]);

            // TODO fare una funzione
            let scores = [3, 3, 3, 9, 6, 6, 9, 9, 9];
            for(i=0; i<scores.length; i++) {
                
                tx = await item1.grantPermission(carlUser.address, {from: bob});
                // console.log("**** Grant Permission gas used: " + tx.receipt.gasUsed);
                tx = await carlUser.addRate(item1.address, scores[i], {from: carl});
                // console.log("**** Rate gas used: " + tx.receipt.gasUsed);
            }

            scores = [7, 7, 9, 5, 10, 6, 8, 8];
            scores.forEach(async (s) => {

                item2.grantPermission(carlUser.address, {from: bob});
                carlUser.addRate(item2.address, s, {from: carl});
            });

            scores = [10, 10, 10, 10];
            scores.forEach(async (s) => {

                item1.grantPermission(carlUser.address, {from: bob});
                carlUser.addRate(item1.address, s, {from: carl});
            });

            await item1.grantPermission(carlUser.address, {from: bob});
        }
        else if(network=="testing") {
            
            // Deploy on test network for testing scripts

            // Get accounts from Ganache
            const alice = accounts[1]; // System creator

            // Get instance of Framework            
            const system = await deployer.deploy(Framework, {from: alice});

            // Populate ComputerRegistry
            const avgPc = await deployer.deploy(SimpleComputer, {from: alice});
            const wgtPc = await deployer.deploy(WeightComputer, {from: alice});
            const registryAddress = await system.computerRegistry();
            const registry = await ComputerRegistry.at(registryAddress);            
            await registry.pushComputer(avgPc.address, web3.utils.fromUtf8("Simple Average"), {from: alice});
            await registry.pushComputer(wgtPc.address, web3.utils.fromUtf8("Weighted Average"), {from: alice});
        }
        else if(network=="ropsten") {

            // Deploy on ropsten
            let system, avgPc, wgtPc;
            let promises = []

            promises.push(deployer.deploy(Framework));
            promises.push(deployer.deploy(SimpleComputer));
            promises.push(deployer.deploy(WeightComputer));

            [system, avgPc, wgtPc] = await Promise.all(promises);
            // const system = await deployer.deploy(Framework);
            // const avgPc = await deployer.deploy(SimpleComputer);
            // const wgtPc = await deployer.deploy(WeightComputer);

            const registryAddress = await system.computerRegistry();
            const registry = await ComputerRegistry.at(registryAddress);

            promises = [];
            promises.push(registry.pushComputer(avgPc.address, web3.utils.fromUtf8("Simple Average")));
            promises.push(registry.pushComputer(wgtPc.address, web3.utils.fromUtf8("Weighted Average")));

            await Promise.all(promises);
            // await registry.pushComputer(avgPc.address, web3.utils.fromUtf8("Simple Average"));
            // await registry.pushComputer(wgtPc.address, web3.utils.fromUtf8("Weighted Average"));
        }
        else {
            // Define other networks
        }

    }); 
};
