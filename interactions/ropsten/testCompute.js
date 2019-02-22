const Framework = artifacts.require("./RatingSystemFramework");
const ComputerRegistry = artifacts.require("./ComputerRegistry");
const SimpleComputer = artifacts.require("./SimpleAvarageComputer");

const fs = require("fs");

var config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
//var results = JSON.parse(fs.readFileSync(output, 'utf8'));

const samples = config["ropsten"]["samples"];               // Numer of times I want to call the compute() function
const elements = config["ropsten"]["ratingList"];           // The list of the dimension of the input arrays 
const degrees = config["ropsten"]["degrees"];                 // The list of the number of function calls to propagate simultaneously
const computerObject = config["ropsten"]["ratingComputer"];     // Id of the interested RatingComputer

/**
 * This script measures the time it takes to executute computeRate() depending on the current number of ratings on an item
 * 
 * At the end, we write an entry on the json file results.json with key the current number of ratings and as value 25 time intervals
 * 
 * 
 * */

// NB Weighted average non cambia il risultato perché il valore block inserito è costante
//  viene valuata solo la latenza di calcolo
module.exports = async () => {

    try {

        console.log("init");

        const rsf = await Framework.deployed();
        const registryAddress = await rsf.computerRegistry();
        const registry = await ComputerRegistry.at(registryAddress);
        const address = await web3.currentProvider.getAddress();

        let results = {};
        let output = "test.json";

        // Iterate over provided computers
        for(pcId in computerObject) {

            // Get computer
            const pc = await registry.getComputer(parseInt(pcId));
            const computer = await SimpleComputer.at(pc);

            // Create entry in json result object
            const computerName = config["ropsten"]["ratingComputer"][pcId];

            results[""+computerName] = {};
            console.log("Computer: " + computerName);

            // Iterate over network degree
            for(d in degrees) {

                const degree = degrees[d];

                results[computerName][degree] = {}; 

                console.log("\tDegree: " + degree);
                // Iterate over array of rating sizes
                for(let j=0; j<elements.length; j++) {

                    console.log("\t\tFilling with "+elements[j]+" scores");

                    // Create input arrays
                    let scores = []
                    let blocks = []
                
                    for(let i=0; i<elements[j]; i++) {
                        scores.push(Math.floor(Math.random()*10 + 1));
                        blocks.push(10000);
                    }

                    let init;
                    let end;
                    let timeList = [];
                        
                    console.log("\t\tstart computing");

                    // Iterate over the samples to take measurements
                    for (let i=0; i<samples; i++) {
                            
                        let promises = [];

                        init = new Date();

                        // Create "degree" calls to compute()
                        for(var k=0; k<degree; k++) {
                            promises.push(computer.compute(scores, blocks));
                        }
                        
                        // Wait for all these calls
                        const list = await Promise.all(promises);

                        // let res =  await computer.compute(scores, blocks, addresses);
                        end = new Date();
                        
                        const elapsed = end.getTime() - init.getTime();
                        console.log("\t\t* Time elapsed: " + elapsed);
                        timeList.push(elapsed);
                    }

                    // Create entry in Result json
                    results[computerName][degree][""+elements[j]] = timeList;
                }
            }
        }

        const json = JSON.stringify(results, null, 4);
        fs.writeFileSync('./interactions/ropsten/Results/'+output, json, 'utf8'); // I don't know why readsync is ok and this one is not            
    }
    catch(e) {
        console.log(e);
    }

    console.log("end");
}
