// Artifacts == truffle's contract abstraction
const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");

module.exports = function(deployer, network, accounts) {

    deployer.then(async () => {

        if(network=="development") {

            // Deploy on local network, get accounts from Ganache
            
            const alice = accounts[1]; // System creator
            const bob = accounts[3];   // Good user
            const carl = accounts[0];  // Rater user
    
            const system = await deployer.deploy(Framework, {from: alice});
            const computerRegistry = await deployer.deploy(ComputerRegistry, {from: alice});
            const simpleAvgComputer = await deployer.deploy(SimpleComputer, {from: alice});
    
            computerRegistry.pushComputer(simpleAvgComputer.address, web3.utils.fromUtf8("Simple Average"),{from: alice})
        }
        else if(network=="ropsten") {

            // Deploy on ropsten
            await deployer.deploy(Framework);
            await deployer.deploy(ComputerRegistry);
        }
        else {
            // Define other networks
        }

    }); 
};
