pragma solidity ^0.5.0;

import "./RatingSystem.sol";
import "./Interfaces.sol";
import "./AssetStorage.sol";
import "./RatingLibrary.sol";
import "./Item.sol";
import "./RatingComputer.sol";

/// @title User
/// @notice This contract represents a user of the RatingSystemFramework. A user can create Items
contract User is Ownable {
    
    // Data
    bytes32                public name;         // Username
    address                public RSF;          // The RatingSystemFramework the User belongs to
    OwnableStoragePointer  private items;       // Structure to store Items published by this user
    RatingLibrary.Rating[] public ratingArray;  // Structure to keep track of the ratings performed by this user

    // Events
    event ItemCreated(Item _itemContract);
    event ItemRated(Item _item, uint8 _score, uint _block, User _rater);


    /// @param _name the username of the User
    /// @param _owner the address of the User
    /// @dev The constructor calls the Ownable constructor to store the owner which should be passed by the RatingSystemFramework
    constructor (bytes32 _name, address _owner) Ownable(_owner)  public {

        RSF = msg.sender;
        items = new OwnableStoragePointer(address(this));
        name = _name;
    }


    /// @notice De-activate this contract
    function destroy() external isOwner {
        // We don't assume User contracts to store ether
        selfdestruct(address(uint160(0x0))); // cast 0x0 to address payable
    }
    

    /// @notice Rate an Item and keep track of the rating
    /// @param _item The Item to rate
    /// @param _score The score to assign to that Item
    function rate(Item _item, uint8 _score) external isOwner {

        uint _block = block.number;

        _item.rate(_score);
        ratingArray.push(RatingLibrary.Rating({isValid: true, 
                                                score: _score, 
                                                inBlock: _block, 
                                                rated: address(_item), 
                                                rater: address(this) }));

        emit ItemRated(_item, _score, _block, this);
    }


    /// @notice Creates an Item with a name
    /// @param _name the name of the Item to create
    function createItem(bytes32 _name) external isOwner {

        Item item = new Item(_name, owner, RSF);
        items.insert(address(item));

        emit ItemCreated(item);
    }


    /// @notice Removes the Item
    /// @param _item the address of the Item to remove
    function deleteItem(Item _item) external isOwner {

        items.remove(address(_item));
    }


    /// @notice Get all the ratings information connected to this Item
    /// @return _scores: the array of scores
    /// @return _blocks: the array of timestamps
    /// @return _rated: the array of addresses rated by this User
    function getAllRatings() external view returns(uint[] memory _scores, 
                                                    uint[] memory _blocks, 
                                                    address[] memory _rated) {

        uint ratingCount = ratingArray.length;

        _scores = new uint[](ratingCount);
        _blocks = new uint[](ratingCount);
        _rated = new address[](ratingCount);

        for(uint i=0; i<ratingCount; i++) {

            _scores[i] = ratingArray[i].score;
            _blocks[i] = ratingArray[i].inBlock;
            _rated[i] = ratingArray[i].rated;
        }
    }


    /// @notice Get all the Item of this User
    /// @return The array of Item
    function getItems() external view returns(address[] memory) {

        return items.getAssets();
    }


    /// @notice Check whether an Item belongs to this User
    /// @param _item The item to check
    /// @return True if the Item belongs to this User; false otherwise
    function isIn(address _item) external view returns(bool) {

        return items.isIn(_item);
    }


    /// @notice Check if I am a registered User of my RatingSystemFramework
    function iAmRegisteredUser() external view returns(bool) {

        RatingSystemFramework rsf = RatingSystemFramework(RSF);
        return rsf.isIn(this);
    }
    
    // Da qui sotto probabilmente inutili

    /// @notice Get the number of Item deployed by this User
    /// @return The number of Item
    function itemCount() external view returns(uint) {

        return items.getCount();
    }


    // /// @notice Get the Item of a given index
    // /// @param _index The index of the Item
    // /// @return The Item
    // function getItemByIndex(uint _index) external view returns(address) {

    //     return items.getKeyAt(_index);
    // }

}
