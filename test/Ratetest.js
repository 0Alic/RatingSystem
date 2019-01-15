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

    it("Should create a user called " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        tx = await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);

        // Check ownership
        const owner = await bobObject.owner();
//        console.log("User addr " + bob);
//        console.log("User owner " + owner);
        assert.equal(bob, owner, "The owner is not " + bobName);
    });

    it("Should create an item called " + bobItemName + " for " + bobName, async() => {

        // Retrieve bob's User contract instance        
        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        // Create Item for bob
        const tx = await bobObject.createItem(web3.utils.fromUtf8(bobItemName), {from: bob});
        // Retrieve item's contract instance
        const itemList = await bobObject.getItems();
        const deployedItemAddress = itemList[0];
        const itemObject = await Item.at(deployedItemAddress);

        const itemName = web3.utils.toUtf8(await itemObject.name())
        assert.equal(itemName, bobItemName, "The item is not " + bobItemName);
    }); 

    it("Should remove and insert again " + bobName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
        const bobObject = await User.at(bobUserAddress);
        await ratingSystem.deleteUser(bobObject.address, {from: bob});
        await ratingSystem.createUser(web3.utils.fromUtf8(bobName), {from: bob});
        
        const userList = await ratingSystem.getUsers();
        for(let i=0; i<userList.length; i++) { // for each non funziona :|
            const user = userList[i];            
            const userObject = await User.at(user);
            const bytes = await userObject.name();
            const name = web3.utils.toUtf8(bytes);
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

});