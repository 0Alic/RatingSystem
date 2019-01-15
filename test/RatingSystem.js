//const RatingSystem = artifacts.require("RatingSystem");
//RatingSystem.numberFormat = "BN";
/*
contract("RatingSystem", accounts => {

    const sender = accounts[0];
    const user = accounts[1];
    const userName = "Bob";
    const item = accounts[2]; // Use account from ganache as Item's address
    const itemName = "Bobs content";
    const timestamp = 1;
    const score = 5;


    it("Should create a user called " + userName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const tx = await ratingSystem.insertUser(web3.utils.fromUtf8(userName), {from: user});
        const userBundle = await ratingSystem.viewUser(user);
        const storedUserBytes = userBundle["_name"];

        assert.equal(web3.utils.toUtf8(storedUserBytes), userName, "User's name isn't the inserted one");
    }); 


    it("Should create an item called " + itemName, async() => {

        const ratingSystem = await RatingSystem.deployed();
        const tx = await ratingSystem.insertItem(item, web3.utils.fromUtf8(itemName), {from: user});
        const itemBundle = await ratingSystem.viewItem(user, item);
        const itemNameBytes = itemBundle["_name"];
        
        assert.equal(web3.utils.toUtf8(itemNameBytes), itemName, "Item's name isn't the inserted one");
    });

    it("Should rate the item " + itemName + " " + score + " points", async() => {

        const ratingSystem = await RatingSystem.deployed();
        const tx = await ratingSystem.insertRate(user, item, timestamp, score, {from: sender});
        const itemBundle = await ratingSystem.viewItem(user, item);
        const scores = itemBundle["_score"];

        assert.equal(scores[0].toNumber(), score, "Wrong score array");
    });

    it("should check failure cases: user/item not present", async() => {

        const ratingSystem = await RatingSystem.deployed();

        await ratingSystem.insertItem(item, web3.utils.fromUtf8(itemName), {from: sender}).then(assert.fail).catch(function(error) {
            // Should fail because User "sender" isn't registered, thus cannot insert "item"
            assert(error.message.indexOf('revert') >= 0, 'User ' + sender +  ' not registerd');
        });

        await ratingSystem.insertItem(item, web3.utils.fromUtf8(itemName), {from: user}).then(assert.fail).catch(function(error) {
            // Should fail because Item "item" is already registered by "user"
            assert(error.message.indexOf('revert') >= 0, 'Item ' + sender +  ' not registerd');
        });
    });
});
*/