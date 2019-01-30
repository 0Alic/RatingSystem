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
    RatingLibrary.Rating[] public ratingMap;

    // Contract in charge to compute the final score of this Item
    RatingComputer public computer;


    constructor (bytes32 _name, address _owner, RatingComputer _computer) Permissioned(_owner) public {

        name = _name;
        computer = _computer;
    }


    /// @notice Rate this Item
    /// @param _score The score to assign to this item
    /// @dev Check whether caller has the permission on this contract (since it's an extension of Permissioned)
    function rate(uint8 _score) external {

        require(checkForPermission(msg.sender) == 0, "No permission to rate this Item");
        require(_score >= 1 && _score <= 10, "Score out of scale");

        revokePermission(msg.sender);

        ratingMap.push(RatingLibrary.Rating({isValid: true,
                                            score: _score,
                                            inBlock: block.number,
                                            rater: msg.sender,
                                            rated: address(this) }));
    }
    

    /// @notice Change the contract in charge to compute the final score
    /// @param _newComputer The new computer
    /// @dev Only contracts of RatingComputer interface are allowed
    function changeComputer(RatingComputer _newComputer) external isOwner {

        computer = _newComputer;
    }


    /// @notice Compute the final score
    /// @param _computer The RatingComputer to use to compute the final score
    /// @return The final score of this Item
    function computeRate(RatingComputer _computer) external view returns (uint) {

        uint ratingCount = ratingMap.length;

        // Facendo così faccio 2 for: uno per crearmi l'array ed uno per calcolarci il rate finale
        // Dai test avere un secondo array con solo gli scores ed evitare questo loop l'ordine di grandezza non cambia
        uint[] memory _scores = new uint[](ratingCount);
        for(uint i=0; i<ratingCount; i++) {
            _scores[i] = ratingMap[i].score;
        }
        return _computer.compute(_scores);
    }


    /// @notice Get all the ratings information of this Item
    /// @return _scores: the array of scores
    /// @return _blocks: the array of blocks
    /// @return _raters: the array of addresses which rated this Item
    function getAllRatings() external view returns (uint[] memory _scores, 
                                                    uint[] memory _blocks, 
                                                    address[] memory _raters) {

        uint ratingCount = ratingMap.length;

        _scores = new uint[](ratingCount);
        _blocks = new uint[](ratingCount);
        _raters = new address[](ratingCount);

        for(uint i=0; i<ratingCount; i++) {

            _scores[i] = ratingMap[i].score;
            _blocks[i] = ratingMap[i].inBlock;
            _raters[i] = ratingMap[i].rater;
        }   
    }

    /// @notice Get the number of ratings performed on this Item
    /// @return The number of ratings
    function ratingCount() external view returns(uint) {

        return ratingMap.length;
    }

}
