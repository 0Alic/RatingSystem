const RatingSystem = artifacts.require("RatingSystemFramework");
const Storage = artifacts.require("AssetStorage");
const User = artifacts.require("User");
const Item = artifacts.require("Item");
const ComputerRegistry = artifacts.require("ComputerRegistry");

contract("RatingSystemFramework: Stresstest", accounts => {

    const alice = accounts[1]; // System creator
    const bob = accounts[3];   // User of the System
    const carl = accounts[0];  // Rater OWA user
    const dave = accounts[2];  // Error Test user
    const eve = accounts[4];   // Rater User user

    const itemName = "Bobs content";
    const timestamp = 1;
    const score = 5;

    describe("Entities like User and Item should not have holes in their storages", function () {

        it("Should create/remove Users continuosly", async() => {

            const ratingSystem = await RatingSystem.deployed();
    
            // Create a User for each account available
            accounts.forEach(async (address, index) => {    
                ratingSystem.createUser(web3.utils.fromUtf8("" + index), {from: address});
            });
    
            assert.equal((await ratingSystem.getUsers()).length, accounts.length, "The system should have " + accounts.length + " users registered");
    
            // Insert again the same users
            accounts.forEach(async (address, index) => {    
                ratingSystem.createUser(web3.utils.fromUtf8("" + (index+111)), {from: address}).then(assert.fail).catch(function(error) {
                    // Should fail because the account "address" is already registered above
                    assert(error.message.indexOf('revert') >= 0, 'User ' + address +  ' already exists');
                });
            });
    
            // Delete half of the Users: check the user array has no holes (even though the ordering isn't preserved without any expensive re-ordering)
            for(let i=0; i<accounts.length; i += 2) {
    
                const user = await ratingSystem.getMyUserContract({from: accounts[i]});
                await ratingSystem.deleteUser(user, {from: accounts[i]});
            }
    
            // To be sure we have no holes, the length should be half of the number of accounts
            assert.equal(await ratingSystem.userCount(), accounts.length/2, "The system should have " + (accounts.length/2) + " users registered");
        }); 
    
        it("Should create/remove Items continuosly", async() => {
    
            const ratingSystem = await RatingSystem.deployed();
    
            const computerRegistry = await ComputerRegistry.deployed();
            const computerAddress = await computerRegistry.getComputer(0); // first computer, the only one deployed
    
            const bobUserAddress = await ratingSystem.getMyUserContract({from: bob});
            const bobInstance = await User.at(bobUserAddress);
    
            // Create n Items for bob
            const n = 20;
            for(let i=0; i<n; i++) {
                await bobInstance.createItem(web3.utils.fromUtf8(""+i), computerAddress, {from: bob});
            }
    
            assert.equal(await bobInstance.itemCount(), n, "Bob should have deployed " + n + " Items");
    
            // Remove half of the Items deployed by bob
            const itemList = await bobInstance.getItems();
            for(let i=0; i<n; i+=2) {
    
                await bobInstance.deleteItem(itemList[i], {from: bob});
            }
    
            assert.equal(await bobInstance.itemCount(), n/2, "Bob should have deployed " + n/2 + " Items");
    
    
        });
    
    });
});
