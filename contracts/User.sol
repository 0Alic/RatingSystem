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
    /// @param _timestamp The timestamp of the rating (provided by higher call)
    function rate(Item _item, uint8 _score, uint _timestamp) public isOwner {

        _item.rate(_score, _timestamp);

        ratingMap[ratingCount] = RatingLibrary.Rating({isValid: true,
                                                        score: _score,
                                                        timestamp: _timestamp,
                                                        rater: address(this),
                                                        rated: address(_item) });
        ratingCount++;
    }

    function getAllRatings() public view returns(uint[] memory _scores, 
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

    /// @notice creates an Item with a name
    /// @param _name the name of the Item to create
    function createItem(bytes32 _name, RatingComputer _computer) public isOwner {

        Item item = new Item(_name, owner, _computer);
        items.insert(address(item));
    }


    function deleteItem(address _item) public isOwner {

        items.remove(_item);
    }

    function getItems() public view returns(address[] memory) {

        return items.getAssets();
    }


    function isIn(address _item) public view returns(bool) {

        return items.isIn(_item);
    }

    // Da qui sotto probabilmente inutili
    function itemCount() public view returns(uint) {

        return items.getCount();
    }

    function getItemByIndex(uint _index) public view returns(address) {

        return items.getKeyAt(_index);
    }

}
