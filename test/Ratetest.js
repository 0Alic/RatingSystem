const RatingSystem = artifacts.require("RatingSystemFramework");
const Storage = artifacts.require("AssetStorage");
const User = artifacts.require("User");
const Item = artifacts.require("Item");
const ComputerRegistry = artifacts.require("ComputerRegistry");

//RatingSystem.numberFormat = "BN";

contract("RatingSystemFramework", accounts => {

    // Bob's
    const alice = accounts[1]; // System creator
    const bob = accounts[3];   // User of the System
    const carl = accounts[0];  // Rater user
    const dave = accounts[2];  // Error Test user

    const bobName = "Bob";
    const bobItemName = "Bobs content";
    const timestamp = 1;
    const score = 5;


    /////////////////
    // Tests concerning Users
    /////////////////


    it("Should create a user called " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const tx = await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);

        // Check ownership
        const owner = await bobObject.owner();
        assert.equal(bob, owner, "The owner is not " + bobName);
    });


    it("Should remove and insert again " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        await ratingSystem.deleteUser(bobObject.address, {from: bob});
        await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        
        const userList = await ratingSystem.getUsers();
        let nameList = []
        for(let i=0; i<userList.length; i++) { // for each non funziona :|
            const user = userList[i];            
            const userObject = await User.at(user);
            const bytes = await userObject.name();
            const name = web3.utils.toUtf8(bytes);
            nameList.push(name);
        }

        assert.equal(userList.length, 1, "The user list should be only 1 element long");
        assert.equal(nameList[0], bobName, "The user list should contain only Bob");
    });


    it("Should NOT insert duplicate Users in the Storage contract", async() => {

        const ratingSystem = await RatingSystem.deployed();

        await ratingSystem.createUser(web3.utils.fromUtf8(bobName+"2"), {from: bob}).then(assert.fail).catch(function(error) {
            // Should fail because User "bob" is already registered inside RatingSystem
            assert(error.message.indexOf('revert') >= 0, 'User ' + bob +  ' already registerd');
        });        
    });


    it("Dave should NOT remove Bob's User contract", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});

        await ratingSystem.deleteUser(bobUserAddress, {from: dave}).then(assert.fail).catch(function(error) {
            // Should fail because User "bob" is already registered inside RatingSystem
            assert(error.message.indexOf('revert') >= 0, 'User ' + bobUserAddress +  ' can be removed only by ' + bob);
        });        
    });


    /////////////////
    // Tests concerning Items and rates
    /////////////////


    it("Should create an item called " + bobItemName + " for " + bobName, async() => {

        // Retrieve bob's User contract instance        
        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        // Retrieve ComputerRegistry and the address of the simple average computer
        const computerRegistry = await ComputerRegistry.deployed();
        const computerAddress = await computerRegistry.getComputer(0); // first computer, the only one deployed
        // Create Item for bob
        const tx = await bobObject.createItem(web3.utils.fromUtf8(bobItemName), computerAddress, {from: bob});
        // Retrieve item's contract instance
        const itemList = await bobObject.getItems();
        const deployedItemAddress = itemList[0];
        const itemObject = await Item.at(deployedItemAddress);

        const itemName = web3.utils.toUtf8(await itemObject.name())
        assert.equal(itemName, bobItemName, "The item is not " + bobItemName);
    }); 


    it("Should let Carl to rate " + bobItemName + " " + score + " stars", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        // Suppose Bob and Carl agreed in some way that Carl can rate Bob's Item
        await bobItem.grantPermission(carl, {from: bob});
        // It's possible to rate in two ways:
            // Being owner of a User contract, and call the function rate() from your own User contract to keep track of your ratings
            // Being an external owned account (OWA) and rate directly from Bob's Item contract
        await bobItem.rate(score, timestamp, {from: carl});

        // Check that Carl cannot rate again
        assert.notEqual(await bobItem.checkForPermission(carl), 0, "Carl's permission status should be 1 or 2");
        
        // Check item's ratings
        const ratingBundle = await bobItem.getAllRatings();
        assert.equal(ratingBundle._scores[0], score, "The score should be 5");
        assert.equal(ratingBundle._timestamps[0], timestamp, "The timestamp should be 1");
        assert.equal(ratingBundle._raters[0], carl, "The rater should be Carl: " + carl);
    });


    it("Should not let Carl to rate again", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        await bobItem.rate(score, timestamp, {from: carl}).then(assert.fail).catch(function(error) {
            // Should fail because Carl has no permission to rate
            assert(error.message.indexOf('revert') >= 0, 'Carl ' + carl +  ' has no permission to rate ' + bobItemName);
        });

        // Check that the number of ratings of Bob's Item is still 1
        assert.equal(await bobItem.ratingCount(), 1, bobItemName + " should have only 1 rating");
    });


    it("Should check the revokePermission() from Bob to Carl", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        // Suppose Bob and Carl agreed in some way that Carl can rate Bob's Item
        await bobItem.grantPermission(carl, {from: bob});
        // Suppose Bob decided to revoke Carl's permission for some reason
        await bobItem.revokePermission(carl, {from: bob});

        // Carl tries to rate anyway
        await bobItem.rate(score, timestamp, {from: carl}).then(assert.fail).catch(function(error) {
            // Should fail because Carl has no permission to rate
            assert(error.message.indexOf('revert') >= 0, 'Carl ' + carl +  ' has no permission to rate ' + bobItemName);
        });

        // Check that the number of ratings of Bob's Item is still 1
        assert.equal(await bobItem.ratingCount(), 1, bobItemName + " should have only 1 rating");
    });


    it("Should avoid bugs in grantPermission() and revokePermission()", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        // Suppose Bob and Carl agreed in some way that Carl can rate Bob's Item
        await bobItem.grantPermission(carl, {from: bob});

        // Dave tries to revoke Carl's permissions
        await bobItem.revokePermission(carl, {from: dave}).then(assert.fail).catch(function(error) {
            // Should fail because Carl has no permission to rate
            assert(error.message.indexOf('revert') >= 0, 'Dave ' + dave +  ' cannot revoke permissions to other');
        });

        // Dave tries to grant permissions to himself
        await bobItem.grantPermission(dave, {from: dave}).then(assert.fail).catch(function(error) {
            // Should fail because Carl has no permission to rate
            assert(error.message.indexOf('revert') >= 0, 'Dave ' + dave +  ' cannot grant permission to himself on ' + bobItemName);
        });

        // Dave tries to grant permissions to Alice
        await bobItem.grantPermission(alice, {from: dave}).then(assert.fail).catch(function(error) {
            // Should fail because Carl has no permission to rate
            assert(error.message.indexOf('revert') >= 0, 'Dave ' + dave +  ' cannot grant permission to Alice on ' + bobItemName);
        });
    });
    

    it("Should test the RatingComputer contract for " + bobItemName , async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        // Perform a loop of rating
        let ratings = [];
        let expectedScore = score;
        ratings.push({score: 7, timestamp: 2, rater: alice});
        ratings.push({score: 4, timestamp: 4, rater: dave});
        ratings.push({score: 6, timestamp: 7, rater: carl});

        ratings.push({score: 1, timestamp: 9, rater: carl});
        ratings.push({score: 9, timestamp: 15, rater: dave});
        ratings.push({score: 10, timestamp: 22, rater: carl});

        ratings.push({score: 10, timestamp: 34, rater: carl});
        ratings.push({score: 8, timestamp: 55, rater: dave});
        ratings.push({score: 4, timestamp: 89, rater: dave});

        ratings.forEach(async (rating) => {

            expectedScore += rating.score;
            bobItem.grantPermission(rating.rater, {from: bob});
            bobItem.rate(rating.score, rating.timestamp, {from: rating.rater});
        });

        assert.equal(await bobItem.ratingCount(), ratings.length+1, bobItemName + " should have " + (ratings.length+1) + " ratings");

        // Compute the rating
        expectedScore = Math.floor(expectedScore/(ratings.length+1)); // Solidity truncates uint

        assert.equal(await bobItem.computeRate(), expectedScore, bobItemName + " should have an average score of " + expectedScore);
    });
});