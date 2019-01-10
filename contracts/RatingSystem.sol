pragma solidity ^0.5.0;

import "./Entities.sol";
import "./Interfaces.sol";
import "./AssetStorage.sol";

/// @title RatingSystemFramework
/// @notice This contract interfaces with the users
contract RatingSystemFramework is Ownable {

    OwnableCRUDStorage private users;

    /// @dev The constructor simply calls the Ownable constructor to store the owner which is the creator of this contract
    constructor () Ownable(msg.sender) public {

        users = new OwnableCRUDStorage(address(this)); // non va bene msg.sender....
    }

    /// @notice creates a User with an username
    /// @param _name the username of the user willing to subscribe
    /// @dev this function extends the function of Factory, and after creating the user it updates the Factory state
    function createUser(bytes32 _name) public {

        User user = new User(_name, msg.sender);
        users.insert(address(user));
    }

    function deleteUser(address _user) public  {

        users.remove(_user);
    }

    function getUsers() public view returns(address[] memory) {

        return users.getAssets();
    }

    function userCount() public view returns(uint) {

        return users.getCount();
    }

    function isIn(address _user) public view returns(bool) {

        return users.isIn(_user);
    }

    // Da qui sotto probabilmente inutili
    function getUserByIndex(uint _index) public view returns(address) {

        return users.getKeyAt(_index);
    }

}