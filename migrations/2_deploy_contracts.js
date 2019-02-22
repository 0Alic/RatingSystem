// Artifacts == truffle's contract abstraction
const Framework = artifacts.require("./RatingSystemFramework");
const User = artifacts.require("./User");
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
            const pc = await deployer.deploy(WeightComputer, {from: alice});
            const registryAddress = await system.computerRegistry();
            const registry = await ComputerRegistry.at(registryAddress);            
            await registry.pushComputer(pc.address, web3.utils.fromUtf8("Weighted Average"), {from: alice});

            // Create Users
            await system.createUser(web3.utils.fromUtf8("Bob"), {from: bob});
            await system.createUser(web3.utils.fromUtf8("Carl"), {from: carl});

            // Create Items
            let bobUser = await system.getMyUserContract({from: bob});
            bobUser = await User.at(bobUser);
            await bobUser.createItem(web3.utils.fromUtf8("Innovation"), pc.address, {from: bob});
            await bobUser.createItem(web3.utils.fromUtf8("7Wonders"), pc.address, {from: bob});

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
