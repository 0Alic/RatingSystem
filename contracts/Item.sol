pragma solidity ^0.5.0;

import "./User.sol";
import "./Interfaces.sol";
import "./RatingComputer.sol";
import "./AssetStorage.sol";


/// @title Item
/// @notice This contract represents an item of the RatingSystemFramework. Items can be rated by external accounts or contract only if they have the permissions to do that
/// @dev The Item contract inherits from Permissioned. It defines the structure of a Rating and it keeps a RatingComputer instance to let the users know how its final score will be computed
contract Item is Permissioned {

    // Data
    bytes32        public name;         // Item nickname
    address        public RSF;          // The RatingSystemFramework the Item belongs to
    RatingComputer public computer;     // Contract in charge to compute the final score of this Item 
    uint[]         public scoreArray;   // Array of scores
    uint[]         public blockArray;   // Array of blocks the scores belong to
    User[]         public raterArray;   // Array of raters

    // Events
    event ItemRated(Item _item, uint8 _score, uint _block, User _rater);


    /// @param _name the nickname of the Item
    /// @param _owner the owner's address of the Item
    /// @param _computer The RatingComputer connected to the Item
    /// @param _rsf The RatingSystemFramework the Item belongs to
    /// @dev The constructor calls the Permisioned constructor
    constructor (bytes32 _name,             
                 address _owner,            
                 RatingComputer _computer,  
                 address _rsf )               
                 
                 Permissioned(_owner)
                 
                 public {

        RSF = _rsf;
        name = _name;
        computer = _computer;
    }


    /// @notice De-activate this contract
    function destroy() external isOwner {
        // We don't assume User contracts to store ether
        selfdestruct(address(uint160(0x0))); // cast 0x0 to address payable
    }


    /// @notice Grant the permission to access to this contract to only User contract belonging to the same RatingSystemFramework
    /// @param _to The address meant to have permission
    /// @dev After checking _to is a correct User contract call the parent function
    function grantPermission(address _to) public isOwner {

        // Check if the User and this Item belong to the same RSF
        User u = User(_to);
            // Require sender is User of RSF
        require(u.iAmRegisteredUser(), "Rating can be done only by registered User contracts");
            // Require User's RSF == my RSF
        require(u.RSF() == RSF, "User should rate only Items beloning to its RSF");

        // Call parent
        super.grantPermission(_to);
    }


    /// @notice Rate this Item
    /// @param _score The score to assign to this item
    /// @dev Check whether caller has the permission on this contract (since it's an extension of Permissioned)
    function rate(uint8 _score) external {

        address _sender = msg.sender;   // Store the sender as "address"
        User _rater = User(_sender);    // Store the sender as "User"
        uint _block = block.number;

        // Check for permissions to rate and the score interval
        require(checkForPermission(_sender) == 0, "No permission to rate this Item");
        require(_score >= 1 && _score <= 10, "Score out of scale");


        revokePermission(_sender);

        scoreArray.push(_score);
        blockArray.push(_block);
        raterArray.push(_rater);

        assert(scoreArray.length == blockArray.length);        
        assert(blockArray.length == raterArray.length);

        emit ItemRated(this, _score, _block, _rater);
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
    /// @return _raters: the array of User addresses which rated this Item
    function getAllRatings() public view returns (uint[] memory _scores, 
                                                    uint[] memory _blocks, 
                                                    User[] memory _raters) {

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
