pragma solidity 0.5.0;

import "./Interfaces.sol";
import "./RatingComputer.sol";
import "./AssetStorage.sol";

library RatingLibrary {

    // Rating data bundle
    struct Rating {
        bool isValid;
        uint8 score;
        address rater;
        address rated;
        uint timestamp;
        // Other data to define
    }

}

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
    function createItem(bytes32 _name) public isOwner {

        Item item = new Item(_name, owner);
        items.insert(address(item));
    }


    function deleteItem(address _item) public isOwner {

        items.remove(_item);
    }

    function getItems() public view returns(address[] memory) {

        return items.getAssets();
    }

    function itemCount() public view returns(uint) {

        return items.getCount();
    }

    function isIn(address _item) public view returns(bool) {

        return items.isIn(_item);
    }

    // Da qui sotto probabilmente inutili
    function getItemByIndex(uint _index) public view returns(address) {

        return items.getKeyAt(_index);
    }

}


/// @title Item
/// @notice This contract represents an item of the RatingSystemFramework. Items can be rated by external accounts or contract only if they have the permissions to do that
/// @dev The Item contract inherits from Permissioned. It defines the structure of a Rating and it keeps a RatingComputer instance to let the users know how its final score will be computed
contract Item is Permissioned {

    // Item name
    bytes32 public name;

    // Structure to keep track of the ratings performed on this Item
    uint public ratingCount = 0;
    mapping(uint => RatingLibrary.Rating) public ratingMap; // Unwrap di questa struttura?

    // Function to compute the final score of this Item
    RatingComputer public computer;


    constructor (bytes32 _name, address _owner) Permissioned(_owner) public {

        name = _name;
        computer = new SimpleAvarageComputer();
    }


    function rate(uint8 _score, uint _timestamp) public {

        require(checkForPermission(msg.sender) == 0, "No permission to rate this Item");
        require(_score >= 1 && _score <= 10, "Score out of scale");

        ratingMap[ratingCount] = RatingLibrary.Rating({isValid: true,
                                                        score: _score,
                                                        timestamp: _timestamp,
                                                        rater: msg.sender,
                                                        rated: address(this) });
        
        ratingCount++;
        revokePermission(msg.sender);
    }
    
    function changeComputer(RatingComputer _newComputer) public isOwner {

        computer = _newComputer;// ha senso? perché così facendo si creano contratti che poi rimangono inutilizzabili
    }

    function computeRate() public view returns (uint) {

        // Facendo così faccio 2 for: uno per crearmi l'array ed uno per calcolarci il rate finale
        uint[] memory _scores = new uint[](ratingCount);
        for(uint i=0; i<ratingCount; i++) {
            _scores[i] = ratingMap[i].score;
        }
        return computer.compute(_scores);
    }

    function getAllRatings() public view returns (uint[] memory _scores, 
                                                    uint[] memory _timestamps, 
                                                    address[] memory _raters) {

        _scores = new uint[](ratingCount);
        _timestamps = new uint[](ratingCount);
        _raters = new address[](ratingCount);

        for(uint i=0; i<ratingCount; i++) {

            _scores[i] = ratingMap[i].score;
            _timestamps[i] = ratingMap[i].timestamp;
            _raters[i] = ratingMap[i].rater;
        }   
    }
    
}

/// @title OwnableCRUDStorage
/// @notice Extension of StoragePointer such that insert/remove operations are allowed only by the owner of the storage
contract OwnableCRUDStorage is StoragePointer, Ownable {

    constructor(address _owner) public Ownable(_owner) {}

    function insert(address a) public isOwner {

        super.insert(a);
    }
    
    function remove(address a) public isOwner {

        super.remove(a);
    }
}