const Framework = artifacts.require("./RatingSystemFramework");
const Storage = artifacts.require("./OwnableCRUDStorage");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");
const Item = artifacts.require("./Item");

const fs = require("fs");

var config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
var results = JSON.parse(fs.readFileSync('timeWeightAvg.json', 'utf8'));

const itemAddress = config["ropsten"]["item"];
const trials = config["ropsten"]["computeRateTrials"];
const elements = [1, 10, 50, 100, 250, 500, 1000, 2000, 2250];

/**
 * This script measures the time it takes to executute computeRate() depending on the current number of ratings on an item
 * 
 * At the end, we write an entry on the json file results.json with key the current number of ratings and as value 25 time intervals
 * 
 * 
 * */
module.exports = async () => {

    console.log("init");

    const rsf = await Framework.deployed();
    const registryAddress = await rsf.computerRegistry();
    const registry = await ComputerRegistry.at(registryAddress);
    const pc = await registry.getComputer(2); // lo 0 è ormai "vecchio"
    const computer = await SimpleComputer.at(pc);

    const address = await web3.currentProvider.getAddress();


    for(let j=0; j<elements.length; j++) {

        console.log("Filling with "+elements[j]+" scores");
        let scores = []
        let blocks = []
        let addresses = []
    
        for(let i=0; i<elements[j]; i++) {
            scores.push(Math.floor(Math.random()*10 + 1));
            blocks.push(10000);
            addresses.push(address);
        }

        let init;
        let end;
        let timeList = [];
            
        console.log("start computing");
        for (let i=0; i<trials; i++) {
            
            init = new Date();
            await computer.compute(scores, blocks, addresses);
            end = new Date();
            
            const elapsed = end.getTime() - init.getTime();
            console.log("Time elapsed: " + elapsed);
            timeList.push(elapsed);
        }

        results["computeRateTime"][""+elements[j]] = timeList;
        const json = JSON.stringify(results, null, 4);
        fs.writeFileSync('./interactions/ropsten/timeWeightAvg.json', json, 'utf8'); // I don't know why readsync is ok and this one is not            
    }

    console.log("end");
}
