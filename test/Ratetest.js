const RatingSystem = artifacts.require("RatingSystemFramework");
const Storage = artifacts.require("AssetStorage");
const User = artifacts.require("User");
const Item = artifacts.require("Item");

//RatingSystem.numberFormat = "BN";

contract("RatingSystemFramework", accounts => {

    // Bob's
    const bob = accounts[1];
    const bobName = "Bob";
    const bobItem = accounts[2]; // Use account from ganache as Item's address
    const bobItemName = "Bobs content";
    const timestamp = 1;
    const score = 5;

    const sender = accounts[0];
    var tx;

    getInstanceAtPosition = async(list, pos, contractType) => {

        return await contractType.at(list[pos]);
    }

    it("Should create a user called " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        tx = await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        const bobObject = await getInstanceAtPosition(await ratingSystem.getUsers(), 0, User);
//        console.log(await ratingSystem.userCount());
//        const userList = await ratingSystem.getUsers();
//        const bobObjectAddress = userList[0]; 
//        const bobObject = await User.at(bobObjectAddress);


        // Check ownership
        const owner = await bobObject.owner();
//        console.log("User addr " + bob);
//        console.log("User owner " + owner);
        assert.equal(bob, owner, "The owner is not " + bobName);
    });

    it("Should create an item called " + bobItemName + " for " + bobName, async() => {

        // Retrieve bob's User contract instance        
        const ratingSystem = await RatingSystem.deployed();
        const users = await ratingSystem.getUsers();
        const bobObject = await getInstanceAtPosition(await ratingSystem.getUsers(), 0, User);
        // const userList = await ratingSystem.getUsers();
        // const bobObjectAddress = userList[0]; 
        // const bobObject = await User.at(bobObjectAddress);
        // Create Item for bob
        const tx = await bobObject.createItem(web3.utils.fromUtf8(bobItemName), {from: bob});
        // Retrieve item's contract instance
        const itemObject = await getInstanceAtPosition(await bobObject.getItems(), 0, Item);
        // const itemList = await bobObject.getItems();
        // const deployedItemAddress = itemList[0];
        // const itemObject = await Item.at(deployedItemAddress);

        const itemName = web3.utils.toUtf8(await itemObject.name())
//        console.log("Item name: " + itemName);     
        assert.equal(itemName, bobItemName, "The item is not " + bobItemName);
    }); 

    it("Should remove and insert again " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobObject = await getInstanceAtPosition(await ratingSystem.getUsers(), 0, User);
//        const bobObject = await getInstanceAtPosition(await ratingSystem.getUsers(), 0, User);
        await ratingSystem.deleteUser(bobObject.address, {from: bob});
        await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        
        const userList = await ratingSystem.getUsers();
        for(let i=0; i<userList.length; i++) { // for each non funziona :|
            const user = userList[i];            
            const userObject = await User.at(user);
            const bytes = await userObject.name();
            const name = web3.utils.toUtf8(bytes);
            console.log(name);
        }
    });

    it("Should NOT insert duplicate Users in the Storage contract", async() => {

        const ratingSystem = await RatingSystem.deployed();

        await ratingSystem.createUser(web3.utils.fromUtf8(bobName+"2"), {from: bob}).then(assert.fail).catch(function(error) {
            // Should fail because User "bob" is already registered by "user"
            assert(error.message.indexOf('revert') >= 0, 'User ' + bob +  ' already registerd');
        });
    });

    it("Should test security concerning the Storage contract", async() => {

        const ratingSystem = await RatingSystem.deployed();
    });


    /*
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
    */
});