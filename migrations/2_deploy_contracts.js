// Artifacts == truffle's contract abstraction
const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");
const WeightComputer = artifacts.require("./WeightedAverageComputer");

module.exports = function(deployer, network, accounts) {

    deployer.then(async () => {

        if(network=="development") {

            // Deploy on local network, get accounts from Ganache
            
            const alice = accounts[1]; // System creator
            const bob = accounts[3];   // Good user
            const carl = accounts[0];  // Rater user
    
            const system = await deployer.deploy(Framework, {from: alice});
            const pc = await deployer.deploy(WeightComputer, {from: alice});
            const registryAddress = await system.computerRegistry();
            const registry = await ComputerRegistry.at(registryAddress);            
            await registry.pushComputer(pc.address, web3.utils.fromUtf8("Weighted Average"), {from: alice});
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
