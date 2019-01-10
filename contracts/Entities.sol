pragma solidity ^0.5.0;

import "./Interfaces.sol";
import "./RatingComputer.sol";

/// @title User
/// @notice This contract represents a user of the RatingSystemFramework, which now can rate Items
contract User is Ownable, Factory  {

    bytes32 public name;

    /// @param _name the username of the User
    /// @param _owner the address of the User
    /// @dev The constructor calls the Ownable constructor to store the owner which should be passed by the RatingSystemFramework
    constructor (bytes32 _name, address _owner) Ownable(_owner)  public {

        name = _name;
    }

    /// @notice creates an Item with a name
    /// @param _name the name of the Item to create
    function createItem(bytes32 _name) public isOwner {

        Item item = new Item(_name, owner);
        updateAssets(address(item));
    }

/*
    function deleteItem(uint _id) public isOwner {

        deleteAsset(_id);
    }
*/
}

contract Item is Permissioned {


    // Rating data bundle
    struct Rating {
        bool isValid;
        uint score;
        uint timestamp;
        address rater;
        // Other data to define
    }

    bytes32 public name;

    uint public ratingCount = 0;
    mapping(uint => Rating) public ratingMap;

    RatingComputer public computer;


    constructor (bytes32 _name, address _owner) Permissioned(_owner) public {

        name = _name;
        computer = new SimpleAvarageComputer();
    }


    function rate(uint _score, uint _timestamp) public {

        require(checkForPermission(msg.sender) == 0, "No permission to rate this Item");

        require(_score >= 1 && _score <= 10, "Score out of scale");

        ratingCount++;
        ratingMap[ratingCount] = Rating({isValid: true,
                                        score: _score,
                                        timestamp: _timestamp,
                                        rater: msg.sender });
        
        revokePermission(msg.sender);
    }
    
    function changeComputer(RatingComputer _newComputer) public isOwner {

        computer = _newComputer;
    }

    function computeRate() public view returns (uint) {

        // Facendo così faccio 2 for: uno per crearmi l'array ed uno per calcolarci il rate finale
        uint[] memory _scores = new uint[](ratingCount);
        for(uint i=0; i<ratingCount; i++) {
            _scores[i] = ratingMap[i+1].score;
        }
        return computer.compute(_scores);
    }

    function getAllRatings() public view returns (uint[] memory _scores, uint[] memory _timestamps, address[] memory _raters) {

        _scores = new uint[](ratingCount);
        _timestamps = new uint[](ratingCount);
        _raters = new address[](ratingCount);

        for(uint i=0; i<ratingCount; i++) {

            _scores[i] = ratingMap[i+1].score;
            _timestamps[i] = ratingMap[i+1].timestamp;
            _raters[i] = ratingMap[i+1].rater;
        }   
    }
    
}

