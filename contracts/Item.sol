pragma solidity ^0.5.0;

import "./Interfaces.sol";
import "./RatingComputer.sol";
import "./AssetStorage.sol";
import "./RatingLibrary.sol";



/// @title Item
/// @notice This contract represents an item of the RatingSystemFramework. Items can be rated by external accounts or contract only if they have the permissions to do that
/// @dev The Item contract inherits from Permissioned. It defines the structure of a Rating and it keeps a RatingComputer instance to let the users know how its final score will be computed
contract Item is Permissioned {

    // Item name
    bytes32 public name;

    // Structure to keep track of the ratings performed on this Item
    uint public ratingCount = 0;
    mapping(uint => RatingLibrary.Rating) public ratingMap;

    // Contract in charge to compute the final score of this Item
    RatingComputer public computer;


    constructor (bytes32 _name, address _owner, RatingComputer _computer) Permissioned(_owner) public {

        name = _name;
        computer = _computer;
    }


    /// @notice Rate this Item
    /// @param _score The score to assign to this item
    /// @param _timestamp The timestamp of this rating (should be provided by higher level call)
    /// @dev Check whether caller has the permission on this contract (since it's an extension of Permissioned)
    function rate(uint8 _score, uint _timestamp) external {

        require(checkForPermission(msg.sender) == 0, "No permission to rate this Item");
        require(_score >= 1 && _score <= 10, "Score out of scale");

        revokePermission(msg.sender);

        ratingMap[ratingCount] = RatingLibrary.Rating({isValid: true,
                                                        score: _score,
                                                        timestamp: _timestamp,
                                                        rater: msg.sender,
                                                        rated: address(this) });
        
        ratingCount++;
    }
    

    /// @notice Change the contract in charge to compute the final score
    /// @param _newComputer The new computer
    /// @dev Only contracts of RatingComputer interface are allowed
    function changeComputer(RatingComputer _newComputer) external isOwner {

        computer = _newComputer;
    }


    /// @notice Compute the final score of this Item using the RatingComputer's formula
    /// @return The final score of this Item
    function computeRate() external view returns (uint) {

        // Facendo così faccio 2 for: uno per crearmi l'array ed uno per calcolarci il rate finale
        // Dai test avere un secondo array con solo gli scores ed evitare questo loop l'ordine di grandezza non cambia
        uint[] memory _scores = new uint[](ratingCount);
        for(uint i=0; i<ratingCount; i++) {
            _scores[i] = ratingMap[i].score;
        }
        return computer.compute(_scores);
    }


    /// @notice Get all the ratings information of this Item
    /// @return _scores: the array of scores
    /// @return _timestamps: the array of timestamps
    /// @return _raters: the array of addresses which rated this Item
    function getAllRatings() external view returns (uint[] memory _scores, 
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
