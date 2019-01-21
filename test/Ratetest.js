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
    const carl = accounts[0];  // Rater OWA user
    const dave = accounts[2];  // Error Test user
    const eve = accounts[4];   // Rater User user

    const bobName = "Bob";
    const bobItemName = "Bobs content";
    
    const eveName = "Eve";

    const timestamp = 1;
    const score = 5;



    /////////////////
    // Tests concerning Users
    /////////////////


    it("Should test RatingSystemFramework and ComputerRegistry ownership", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const computerRegistry = await ComputerRegistry.deployed();

        assert.equal(await ratingSystem.owner(), alice, "The owner of RatingSystemFramework should be " + alice);
        assert.equal(await computerRegistry.owner(), alice, "The owner of ComputerRegistry should be " + alice);
    });
    // Ok


    it("Should create a user called " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const tx = await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);

        // Check ownership and name
        const owner = await bobObject.owner();
        const name = await bobObject.name();
        assert.equal(bob, owner, "The owner is not " + bobName);
        assert.equal(web3.utils.toUtf8(name), bobName, "The User's name should be " + bobName);

        // Check User's data inside RatingSystemFramework
        let userList = [];
        userList.push(bobUserAddress);
        assert.equal(await ratingSystem.userCount(), 1, "The RatingSystemFramework should have 1 User stored");
        assert.deepEqual(await ratingSystem.getUsers(), userList, "The RatingSystemFramework should have this list of Users: " + userList);
        assert.equal(await ratingSystem.isIn(bobUserAddress), true, bobUserAddress + " should belong to RatingSystemFramework");
    });
    // Ok


    it("Should remove and insert again " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        
        // Remove User contract Bob
        let bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        let bobObject = await User.at(bobUserAddress);
        await ratingSystem.deleteUser(bobObject.address, {from: bob});
        
        // Test RatingSystemFramework state after removal
        assert.equal(await ratingSystem.userCount(), 0, "The RatingSystemFramework should have no User stored");
        assert.deepEqual(await ratingSystem.getUsers(), [], "The RatingSystemFramework should have empty list of Users");
        assert.equal(await ratingSystem.isIn(bobUserAddress), false, bobUserAddress + " should NOT belong to RatingSystemFramework");
        
        // Add again a new User contract created by Bob
        await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        bobObject = await User.at(bobUserAddress);
        // Check ownership and name
        const owner = await bobObject.owner();
        const name = await bobObject.name();
        assert.equal(bob, owner, "The owner is not " + bobName);
        assert.equal(web3.utils.toUtf8(name), bobName, "The User's name should be " + bobName);
        // Check User's data inside RatingSystemFramework
        let userList = [];
        userList.push(bobUserAddress);
        assert.equal(await ratingSystem.userCount(), 1, "The RatingSystemFramework should have 1 User stored");
        assert.deepEqual(await ratingSystem.getUsers(), userList, "The RatingSystemFramework should have this list of Users: " + userList);
        assert.equal(await ratingSystem.isIn(bobUserAddress), true, bobUserAddress + " should belong to RatingSystemFramework");
    });
    // Ok


    it("Should NOT insert duplicate Users / remove non-User in the Storage contract", async() => {

        const ratingSystem = await RatingSystem.deployed();
        bobUserAddress = await ratingSystem.getMyUserContract({from: bob});

        await ratingSystem.createUser(web3.utils.fromUtf8(bobName+"2"), {from: bob}).then(assert.fail).catch(function(error) {
            // Should fail because User "bob" is already registered inside RatingSystem
            assert(error.message.indexOf('revert') >= 0, 'User ' + bob +  ' already registerd');
        });

        await ratingSystem.deleteUser(dave, {from: dave}).then(assert.fail).catch(function(error) {
            // Should fail because dave is not an User contract address
            assert(error.message.indexOf('revert') >= 0, 'User ' + dave +  ' does not exist');
        });
    });
    // Ok


    it("Dave should NOT remove Bob's User contract", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});

        await ratingSystem.deleteUser(bobUserAddress, {from: dave}).then(assert.fail).catch(function(error) {
            // Should fail because dave cannot remove bob's User contract
            assert(error.message.indexOf('revert') >= 0, 'User ' + bobUserAddress +  ' can be removed only by ' + bob);
        });        
    });
    // Ok


    /////////////////
    // Tests concerning Items
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

        // Check correctness of Item creation flow
        const itemName = web3.utils.toUtf8(await itemObject.name());
        const expectedItemList = [deployedItemAddress];
        assert.equal(itemName, bobItemName, "The item is not " + bobItemName);
        assert.equal(await itemObject.owner(), bob, "The owner of " + bobItemName + " should be " + bob);
        assert.equal(await bobObject.itemCount(), 1, "User " + bobUserAddress + " should have only 1 deployed Item");
        assert.deepEqual(await bobObject.getItems(), expectedItemList, "User " + bobUserAddress + " should have this list of Items: " + expectedItemList);
        assert.equal(await bobObject.isIn(deployedItemAddress), true, deployedItemAddress + " should belong to User " + bobUserAddress);
    }); 
    // Ok


    it("Should remove and insert again " + bobItemName, async() => {

        // Retrieve bob's User contract instance
        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);

        // Retrieve ComputerRegistry and the address of the simple average computer
        const computerRegistry = await ComputerRegistry.deployed();
        const computerAddress = await computerRegistry.getComputer(0); // first computer, the only one deployed

        // Retrieve item's contract address
        let itemList = await bobObject.getItems();
        let deployedItemAddress = itemList[0];

        // Remove "Bob's content"
        let tx = await bobObject.deleteItem(deployedItemAddress, {from: bob});

        // Test bob's User contract state after removal
        assert.equal(await bobObject.itemCount(), 0, "Bob's user contract should have no Item stored");
        assert.deepEqual(await bobObject.getItems(), [], "Bob's user contract should have empty list of Item");
        assert.equal(await bobObject.isIn(deployedItemAddress), false, deployedItemAddress + " should NOT belong to bob's User contract");

        // Insert again bob's content
        tx = await bobObject.createItem(web3.utils.fromUtf8(bobItemName), computerAddress, {from: bob});

        // Retrieve item's contract instance
        itemList = await bobObject.getItems();
        deployedItemAddress = itemList[0];
        const itemObject = await Item.at(deployedItemAddress);

        // Check correctness of Item creation flow
        const itemName = web3.utils.toUtf8(await itemObject.name());
        const expectedItemList = [deployedItemAddress];
        assert.equal(itemName, bobItemName, "The item is not " + bobItemName);
        assert.equal(await itemObject.owner(), bob, "The owner of " + bobItemName + " should be " + bob);
        assert.equal(await bobObject.itemCount(), 1, "User " + bobUserAddress + " should have only 1 deployed Item");
        assert.deepEqual(await bobObject.getItems(), expectedItemList, "User " + bobUserAddress + " should have this list of Items: " + expectedItemList);
        assert.equal(await bobObject.isIn(deployedItemAddress), true, deployedItemAddress + " should belong to User " + bobUserAddress);
    });
    // Ok

    
    it("Dave should NOT remove Bob's Item contract", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);

        // Retrieve item's contract address
        const itemList = await bobObject.getItems();
        const deployedItemAddress = itemList[0];

        await bobObject.deleteItem(deployedItemAddress, {from: dave}).then(assert.fail).catch(function(error) {
            // Should fail because dave cannot remove bob's Content contract
            assert(error.message.indexOf('revert') >= 0, 'Item ' + deployedItemAddress +  ' can be removed only by ' + bob);
        });        
    });
    // Ok


    /////////////////
    // Tests concerning rates from OWA
    /////////////////


    it("Should let Carl (OWA) to rate " + bobItemName + " " + score + " stars", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        // Supposing Bob and Carl agreed in some way that Carl can rate Bob's Item
        await bobItem.grantPermission(carl, {from: bob});

        // Check policy's flag of Carl
        const carlPolicy = await bobItem.getMyPolicy({from: carl});
        assert.equal(carlPolicy._granted, true, "Carl should have its policy term equal to true");

        // It's possible to rate in two ways:
            // Being owner of a User contract, and call the function rate() from your own User contract to keep track of your ratings
            // Being an external owned account (OWA) and rate directly from Bob's Item contract
        await bobItem.rate(score, timestamp, {from: carl});

        // Check that Carl cannot rate again
        assert.notEqual(await bobItem.checkForPermission(carl), 0, "Carl's permission status should be 1 or 2");
        
        // Check item's ratings
        const ratingBundle = await bobItem.getAllRatings();
        assert.equal(await bobItem.ratingCount(), 1, bobItemName + " should have only 1 rating");
        assert.equal(ratingBundle._scores.length, 1, bobItemName + " should have only 1 score");
        assert.equal(ratingBundle._timestamps.length, 1, bobItemName + " should have only 1 timestamp");
        assert.equal(ratingBundle._raters.length, 1, bobItemName + " should have only 1 rater");
        assert.equal(ratingBundle._scores[0], score, "The score should be " + score);
        assert.equal(ratingBundle._timestamps[0], timestamp, "The timestamp should be " + timestamp);
        assert.equal(ratingBundle._raters[0], carl, "The rater should be Carl: " + carl);
    });
    // Ok


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
    // Ok


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

        // Check policy's flag of Carl
        const carlPolicy = await bobItem.getMyPolicy({from: carl});
        assert.equal(carlPolicy._granted, false, "Carl should have its policy term equal to false");

        // Carl tries to rate anyway
        await bobItem.rate(score, timestamp, {from: carl}).then(assert.fail).catch(function(error) {
            // Should fail because Carl has no permission to rate
            assert(error.message.indexOf('revert') >= 0, 'Carl ' + carl +  ' has no permission to rate ' + bobItemName);
        });

        // Check that the number of ratings of Bob's Item is still 1
        assert.equal(await bobItem.ratingCount(), 1, bobItemName + " should have only 1 rating");
    });
    // Ok


    it("Should avoid bugs in grantPermission() and revokePermission()", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        // Suppose Bob and Carl agreed in some way that Carl can rate Bob's Item
        await bobItem.grantPermission(carl, {from: bob});

        // Check policy's flag of Carl
        let carlPolicy = await bobItem.getMyPolicy({from: carl});
        assert.equal(carlPolicy._granted, true, "Carl should have its policy term equal to true");

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

        // Check policy's flag of alice/dave/carl
        const alicePolicy = await bobItem.getMyPolicy({from: alice});
        const davePolicy = await bobItem.getMyPolicy({from: dave});
        carlPolicy = await bobItem.getMyPolicy({from: carl});
        assert.equal(alicePolicy._granted, false, "Alice should have its policy term equal to false");
        assert.equal(davePolicy._granted, false, "Dave should have its policy term equal to false");
        assert.equal(carlPolicy._granted, true, "Carl should have its policy term equal to true");
    });
    // Ok
    

    it("Should test the SimpleAverageComputer contract for " + bobItemName , async() => {

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

        // Check the number of registered ratings is ok
        assert.equal(await bobItem.ratingCount(), ratings.length+1, bobItemName + " should have " + (ratings.length+1) + " ratings");

        // Compute the final score
        expectedScore = Math.floor(expectedScore/(ratings.length+1)); // Solidity truncates uint
        // Check final score
        assert.equal(await bobItem.computeRate(), expectedScore, bobItemName + " should have an average score of " + expectedScore);
    });
    // Ok


    /////////////////
    // Tests concerning rates from User contract
    /////////////////


    it("Should create a new User: " + eveName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const tx = await ratingSystem.createUser(web3.utils.fromUtf8(eveName), {from: eve});
        const eveUserAddress = await ratingSystem.getMyUserContract({from: eve});
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const eveObject = await User.at(eveUserAddress);

        // Check ownership and name
        const owner = await eveObject.owner();
        const name = await eveObject.name();
        assert.equal(eve, owner, "The owner is not " + eveName);
        assert.equal(web3.utils.toUtf8(name), eveName, "The User's name should be " + eveName);

        // Check User's data inside RatingSystemFramework
        let userList = [];
        userList.push(bobUserAddress);
        userList.push(eveUserAddress);
        assert.equal(await ratingSystem.userCount(), 2, "The RatingSystemFramework should have 2 User stored");
        assert.deepEqual(await ratingSystem.getUsers(), userList, "The RatingSystemFramework should have this list of Users: " + userList);
        assert.equal(await ratingSystem.isIn(eveUserAddress), true, eveUserAddress + " should belong to RatingSystemFramework");
    });
    // Ok


    it("Should let Eve User contract rate " + bobItemName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const eveUserAddress = await ratingSystem.getMyUserContract({from: eve});
        const eveObject = await User.at(eveUserAddress);
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);

        const bobItemList = await bobObject.getItems();
        const bobItemAddress = bobItemList[0]; // Bob deployed only one Item
        const bobItem = await Item.at(bobItemAddress);

        // Supposing Bob and Eve agreed in some way that Carl can rate Bob's Item
            // Eve gives Bob her User contract in order to use it to rate Bob's Item
        await bobItem.grantPermission(eveUserAddress, {from: bob});

        // Check policy's flag of Eve's contract
        const evePolicy = await bobItem.getMyPolicy({from: eveUserAddress});
        assert.equal(evePolicy._granted, true, "Eve's contract should have its policy term equal to true");
        assert.equal(await bobItem.checkForPermission(eveUserAddress), 0, "Eve's User contract permission status should be 0");

        // Rating performed by Eve's User contract
        await eveObject.rate(bobItemAddress, score, timestamp, {from: eve});

        // Check that Eve's contract cannot rate again
        assert.notEqual(await bobItem.checkForPermission(eveUserAddress), 0, "Carl's permission status should be 1 or 2");
        
        // Check item's ratings
        const ratingBundle = await bobItem.getAllRatings();
        assert.equal(await bobItem.ratingCount(), 11, bobItemName + " should have only 11 rating");
        assert.equal(ratingBundle._scores.length, 11, bobItemName + " should have only 11 score");
        assert.equal(ratingBundle._timestamps.length, 11, bobItemName + " should have only 11 timestamp");
        assert.equal(ratingBundle._raters.length, 11, bobItemName + " should have only 11 rater");
        assert.equal(ratingBundle._scores[10], score, "The score should be " + score);
        assert.equal(ratingBundle._timestamps[10], timestamp, "The timestamp should be " + timestamp);
        assert.equal(ratingBundle._raters[10], eveUserAddress, "The rater should be Eve's User contract: " + eveUserAddress);

        // Check Eve's list of ratings
        const eveRatingBundle = await eveObject.getAllRatings();
        assert.equal(await eveObject.ratingCount(), 1, "Eve's contract should have store only 1 rating");
        assert.equal(eveRatingBundle._scores.length, 1, "Eve's contract should have only 1 score");
        assert.equal(eveRatingBundle._timestamps.length, 1, "Eve's contract should have only 1 timestamp");
        assert.equal(eveRatingBundle._rated.length, 1, "Eve's contract should have only 1 rated Item");
        assert.equal(eveRatingBundle._scores[0], score,  "The score should be " + score);
        assert.equal(eveRatingBundle._timestamps[0], timestamp, "The timestamp should be " + timestamp);
        assert.equal(eveRatingBundle._rated[0], bobItemAddress, "The rated Item should be: " + bobItemAddress);
    });
    // Ok

});