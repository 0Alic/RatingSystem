pragma solidity 0.5.0;

import "./User.sol";
import "./Item.sol";
import "./Interfaces.sol";
import "./AssetStorage.sol";

/// @title RatingSystemFramework
/// @notice This contract is the top stack actor, it interfaces with the users providing methods to insert/remove users
contract RatingSystemFramework is Ownable {

    OwnableCRUDStorage private users;               // This manage that removal of User won't leave gaps in the array
    mapping(address => User) private userAddresses; // This to ensure that a single account can instantiate only a single User contract
    //
    // CHECK
    // Probabilmente entrambe le strutture non sono necessarie, potrei dentro CRUDStorage usare come chiave msg.sender e come valore User_address-pointer
    // A quel punto non servirebbe per Item perché non ho bisogno di controllare l'unicità come per gli utenti, che CRUDStorage dovrebbe già andare bene
    // Pensarci
    //

    /// @dev The constructor simply calls the Ownable constructor to store the owner which is the creator of this contract
    constructor () Ownable(msg.sender) public {

        users = new OwnableCRUDStorage(address(this)); // non va bene msg.sender....
    }

    /// @notice creates a User with an username
    /// @param _name the username of the user willing to subscribe
    /// @dev This function checks that the sender has not already stored a User contract, stores inside users a new User smart contract, and then updates the map of addresses witha User contract attached
    function createUser(bytes32 _name) public {

        require(address(userAddresses[msg.sender]) == address(0x0), "This address has already a User registered");

        User user = new User(_name, msg.sender);
        users.insert(address(user));
        userAddresses[msg.sender] = user;
    }

    /// @notice Removes a User
    /// @param _user The address of the User contract to remove
    /// @dev This function removes from the CRUDStorage the User contract and then removes from the map of addresses the attached User contract
    function deleteUser(User _user) public  {

        require(userAddresses[msg.sender] == _user, "You cannot remove other's user's contracts");

        users.remove(address(_user));
        delete userAddresses[msg.sender];
    }

    /// @notice Get the User contract attached to the sender
    /// @return A User contract
    /// @dev By the front-end the returned value will be an address. I use User for type safety check
    function getMyUserContract() public view returns(User) {

        return userAddresses[msg.sender];
    }

    /// @notice Get the list of the addresses of stored User contracts 
    /// @return The list of stored Users contracts
    /// @dev Returning here a User[] would involve a loop cycle to cast address=>User
    function getUsers() public view returns(address[] memory) {

        return users.getAssets();
    }

    /// @notice Check if a User contract is present
    /// @param _user Contract User to check the presence
    /// @return true if _user is present
    function isIn(User _user) public view returns(bool) {

        return users.isIn(address(_user));
    }



    /// @notice Get the number of stored User contracts in this System
    /// @return The number of stored User contracts
    function userCount() public view returns(uint) {

        return users.getCount();
    }

    /// @notice Get the address of the User contract at a given index
    /// @param _index The index to check
    /// @return The User contract address
    /// @dev Debug function    
    function getUserByIndex(uint _index) public view returns(User) {

        return User(users.getKeyAt(_index));
    }

}