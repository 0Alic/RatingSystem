pragma solidity 0.5.0;

import "./Interfaces.sol";
import "./AssetStorage.sol";
import "./RatingLibrary.sol";
import "./Item.sol";
import "./RatingComputer.sol";

/// @title User
/// @notice This contract represents a user of the RatingSystemFramework. A user can create Items
contract User is Ownable {

    // Username
    bytes32 public name;

    // Structure to store Items published by this user    
    OwnableCRUDStorage private items;

    // Structure to keep track of the ratings done by this user
    uint public ratingCount = 0;    
    mapping(uint => RatingLibrary.Rating) public ratingMap;


    /// @param _name the username of the User
    /// @param _owner the address of the User
    /// @dev The constructor calls the Ownable constructor to store the owner which should be passed by the RatingSystemFramework
    constructor (bytes32 _name, address _owner) Ownable(_owner)  public {

        items = new OwnableCRUDStorage(address(this));
        name = _name;
    }


    /// @notice Function to call to rate an Item and keep track of the rating
    /// @param _item The Item to rate
    /// @param _score The score to assign to that Item
    /// @param _timestamp The timestamp of the rating (should be provided by higher level call)
    function rate(Item _item, uint8 _score, uint _timestamp) external isOwner {

        _item.rate(_score, _timestamp);

        ratingMap[ratingCount] = RatingLibrary.Rating({isValid: true,
                                                        score: _score,
                                                        timestamp: _timestamp,
                                                        rater: address(this),
                                                        rated: address(_item) });
        ratingCount++;
    }


    /// @notice Get all the ratings information connected to this Item
    /// @return _scores: the array of scores
    /// @return _timestamps: the array of timestamps
    /// @return _rated: the array of addresses rated by this User
    function getAllRatings() external view returns(uint[] memory _scores, 
                                                    uint[] memory _timestamps,
                                                    address[] memory _rated) {

        _scores = new uint[](ratingCount);
        _timestamps = new uint[](ratingCount);
        _rated = new address[](ratingCount);

        for(uint i=0; i<ratingCount; i++) {

            _scores[i] = ratingMap[i].score;
            _timestamps[i] = ratingMap[i].timestamp;
            _rated[i] = ratingMap[i].rated;
        }
    }


    /// @notice Creates an Item with a name
    /// @param _name the name of the Item to create
    /// @param _computer The RatingComputer to attach for the computation of the final score of this Item
    function createItem(bytes32 _name, RatingComputer _computer) external isOwner {

        Item item = new Item(_name, owner, _computer);
        items.insert(address(item));
    }


    /// @notice Removes the Item
    /// @param _item the address of the Item to remove
    function deleteItem(Item _item) external isOwner {

        items.remove(address(_item));
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

    
    // Da qui sotto probabilmente inutili

    /// @notice Get the number of Item deployed by this User
    /// @return The number of Item
    function itemCount() external view returns(uint) {

        return items.getCount();
    }


    /// @notice Get the Item of a given index
    /// @param _index The index of the Item
    /// @return The Item
    function getItemByIndex(uint _index) external view returns(address) {

        return items.getKeyAt(_index);
    }

}
