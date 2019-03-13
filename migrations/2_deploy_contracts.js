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
            await registry.pushComputer(pc.address, web3.utils.fromUtf8("Weighted Average"), {from: alice});

            pc = await deployer.deploy(SimpleComputer, {from: alice});
            await registry.pushComputer(pc.address, web3.utils.fromUtf8("Simple Average"), {from: alice});


            // Create Users
            await system.createUser(web3.utils.fromUtf8("Bob"), {from: bob});
            await system.createUser(web3.utils.fromUtf8("Carl"), {from: carl});

            // Get Users
            let bobUser = await system.getMyUserContract({from: bob});
            bobUser = await User.at(bobUser);
            let carlUser = await system.getMyUserContract({from: carl});
            carlUser = await User.at(carlUser);
            
            // Create Items
            await bobUser.createItem(web3.utils.fromUtf8("Innovation"), {from: bob});
            await bobUser.createItem(web3.utils.fromUtf8("7Wonders"), {from: bob});

            // Create a few ratings
            const items = await bobUser.getItems();
            let item1 = await Item.at(items[0]);
            let item2 = await Item.at(items[1]);

            // TODO fare una funzione
            let scores = [3, 3, 3, 9, 6, 6, 9, 9, 9];
            scores.forEach(async (s) => {

                item1.grantPermission(carlUser.address, {from: bob});
                carlUser.rate(item1.address, s, {from: carl});
            });

            scores = [7, 7, 9, 5, 10, 6, 8, 8];
            scores.forEach(async (s) => {

                item2.grantPermission(carlUser.address, {from: bob});
                carlUser.rate(item2.address, s, {from: carl});
            });

            scores = [10, 10, 10, 10];
            scores.forEach(async (s) => {

                item1.grantPermission(carlUser.address, {from: bob});
                carlUser.rate(item1.address, s, {from: carl});
            });

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
            const system = await deployer.deploy(Framework);
            const avgPc = await deployer.deploy(SimpleComputer);
            const wgtPc = await deployer.deploy(WeightComputer);

            const registryAddress = await system.computerRegistry();
            const registry = await ComputerRegistry.at(registryAddress);

            await registry.pushComputer(avgPc.address, web3.utils.fromUtf8("Simple Average"));
            await registry.pushComputer(wgtPc.address, web3.utils.fromUtf8("Weighted Average"));
        }
        else {
            // Define other networks
        }

    }); 
};
