const RatingSystem = artifacts.require("RatingSystemFramework");
const User = artifacts.require("User");
const Item = artifacts.require("Item");

//RatingSystem.numberFormat = "BN";

contract("RatingSystemFramework", accounts => {

    const sender = accounts[0];
    const user = accounts[1];
    const userName = "Bob";
    const item = accounts[2]; // Use account from ganache as Item's address
    const itemName = "Bobs content";
    const timestamp = 1;
    const score = 5;
    var tx;

    it("Should create a user called " + userName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const userName = "Bob";
        tx = await ratingSystem.createUser(web3.utils.fromUtf8(userName), {from: user});
        const userList = await ratingSystem.getAssets();
        const userAddress = userList[0];
        const userObject = await User.at(userAddress);

        const owner = await userObject.owner();

        console.log("User addr " + user);
        console.log("User owner " + owner);

        tx = await userObject.createItem(web3.utils.fromUtf8(itemName), {from: user});
        const itemList = await userObject.getAssets();
        const deployedItemAddress = itemList[0];

        const itemObject = await Item.at(deployedItemAddress);

        console.log(web3.utils.toUtf8(await itemObject.name()));
    }); 

    const n = 5;
    it("Should insert " + n + " Items", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const userList = await ratingSystem.getAssets();
        const userAddress = userList[0];
        const userObject = await User.at(userAddress);

        for(let i=0; i<n; i++) {

            let tx = await userObject.createItem(web3.utils.fromUtf8("Item " + 1), {from: user});
        }
    })

    it("Should test how long does it take to retrieve " + n + " Items", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const userList = await ratingSystem.getAssets();
        const userAddress = userList[0];
        const userObject = await User.at(userAddress);

        const itemList = await userObject.getAssets();
        console.log(itemList);
    })

    const m = 10;
    it("Should insert " + n + " ratings", async() => {

        const ratingSystem = await RatingSystem.deployed();
        
        // Retrieve User
        const userList = await ratingSystem.getAssets();
        const userAddress = userList[0];
        const userObject = await User.at(userAddress);

        // Retrieve Item
        const itemList = await userObject.getAssets();
        const deployedItemAddress = itemList[0];
        const itemObject = await Item.at(deployedItemAddress);

        const min = 1;
        const max = 10;
        let scores = [];

        for(let i=0; i<m; i++) {

            let score = Math.floor(Math.random() * (max - min)) + min;
            scores.push(score);
            let tx = await itemObject.grantPermission(sender, {from: user});
            tx = await itemObject.rate(score, Date.now(), {from: sender});
        }
    });

    it("Should test how long does it take to compute the mean on " + n + " ratings", async() => {

        const ratingSystem = await RatingSystem.deployed();
        
        // Retrieve User
        const userList = await ratingSystem.getAssets();
        const userAddress = userList[0];
        const userObject = await User.at(userAddress);

        // Retrieve Item
        const itemList = await userObject.getAssets();
        const deployedItemAddress = itemList[0];
        const itemObject = await Item.at(deployedItemAddress);

        console.log(await itemObject.computeRate());

        const dataBundle = await itemObject.getAllRatings();
        const scores = dataBundle._scores;
        const timestamps = dataBundle._timestamps;
        const raters = dataBundle._raters;

        console.log(scores.map( e => e.toNumber()));
        console.log(timestamps.map( e => e.toNumber()));
        console.log(raters);
    });

});