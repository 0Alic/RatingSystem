pragma solidity ^0.5.0;

import "./Interfaces.sol";
import "./RatingComputer.sol";
import "./AssetStorage.sol";


/// @title Item
/// @notice This contract represents an item of the RatingSystemFramework. Items can be rated by external accounts or contract only if they have the permissions to do that
/// @dev The Item contract inherits from Permissioned. It defines the structure of a Rating and it keeps a RatingComputer instance to let the users know how its final score will be computed
contract Item is Permissioned {

    // Item name
    bytes32 public name;

    // Structures to keep track of the ratings performed on this Item
    uint[] public scoreArray;
    uint[] public blockArray;
    address[] public raterArray;

    // Contract in charge to compute the final score of this Item
    RatingComputer public computer;


    constructor (bytes32 _name, address _owner, RatingComputer _computer) Permissioned(_owner) public {

        name = _name;
        computer = _computer;
    }


    function destroy() external isOwner {
        // We don't assume User contracts to store ether
        selfdestruct(address(uint160(0x0))); // cast 0x0 to address payable
    }

    /// @notice Rate this Item
    /// @param _score The score to assign to this item
    /// @dev Check whether caller has the permission on this contract (since it's an extension of Permissioned)
    function rate(uint8 _score) external {

        require(checkForPermission(msg.sender) == 0, "No permission to rate this Item");
        require(_score >= 1 && _score <= 10, "Score out of scale");

        revokePermission(msg.sender);

        scoreArray.push(_score);
        blockArray.push(block.number);
        raterArray.push(msg.sender);

        assert(scoreArray.length == blockArray.length);        
        assert(blockArray.length == raterArray.length);
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
    function computeScore(RatingComputer _computer) external view returns (uint) {

        return _computer.compute(scoreArray, blockArray);
    }


    /// @notice Get all the ratings information of this Item
    /// @return _scores: the array of scores
    /// @return _blocks: the array of blocks
    /// @return _raters: the array of addresses which rated this Item
    function getAllRatings() public view returns (uint[] memory _scores, 
                                                    uint[] memory _blocks, 
                                                    address[] memory _raters) {

        _scores = scoreArray;
        _blocks = blockArray;
        _raters = raterArray;
    }

    /// @notice Get the number of ratings performed on this Item
    /// @return The number of ratings
    function ratingCount() external view returns(uint) {

        return scoreArray.length;
    }
}
