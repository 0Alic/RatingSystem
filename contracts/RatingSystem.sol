pragma solidity ^0.5.0;

import "./Entities.sol";
import "./Interfaces.sol";

/**

    APPUNTI
    
    COME GARANTIRE L'UNICITÀ DEGLI ITEM LEGATI AGLI USER? 
        OGNI USER PUÒ REGISTRARE SOLO UN ITEM PER INDIRIZZO
        MA COME EVITARE CHE UN USER 2 REGISTRI L'INDIRIZZO DI UN ITEM GIÀ PRESENTE IN USER 1?


 */



/// @title RatingSystemFramework
/// @notice This contract interfaces with the users
contract RatingSystemFramework is Ownable, Factory {

    /// @dev The constructor simply calls the Ownable constructor to store the owner which is the creator of this contract
    constructor () Ownable(msg.sender) public {}

    /// @notice creates a User with an username
    /// @param _name the username of the user willing to subscribe
    /// @dev this function extends the function of Factory, and after creating the user it updates the Factory state
    function createUser(bytes32 _name) public {

        User user = new User(_name, msg.sender);
        updateAssets(address(user));
    }

/*
    function deleteUser(uint _id) public isOwner {

        deleteAsset(_id);
    }
*/
}


/**
    Purpose of this smart contract

    Store a ledger of ratings (User - Item)
 */
contract RatingSystem {

    // Rating data bundle
    struct Rating {
        bool isValid;
        uint score;
        uint timestamp;
//        address rater;
        // Other data to define
    }

    // Item data bundle
    struct Item {
        bool isValid;
        bytes32 name;
        // Other data to define

        // Array of keys for looping and mapping for random access, because new Rating[] isn't supported
        uint ratingCount;  
        mapping(uint => Rating) ratingMap;
    }

    // Entity data bundle
    struct User {
        bool isValid;
        bytes32 name;
        // Other data to define
        address[] items;
        mapping(address => Item) itemMap;
        // Array di rating fatti ??? 
    }


    // map User address => User struct
    mapping(address => User) public userMap;



    modifier checkValidity(bool _data, bool _validity, string memory text) {
        require(_data == _validity, text);
        _;
    }



    /****************************/
    /*     MODIFY THE STATE     */
    /****************************/


    /// @notice Store the User msg.sender only if not present already
    /// @param _name the User name data
    /// ...Add the other parameters
    function insertUser(bytes32 _name) public 
                                        checkValidity(userMap[msg.sender].isValid, 
                                                        false, 
                                                        "User's address already present") {

        // Create new user
        userMap[msg.sender] = User({isValid: true,
                                    name: _name,
                                    items: new address[](0) });
    }


    /// @notice Store an Item connected to the User msg.sender. User needs to be present first
    /// @param _itemAddress the Item to insert
    /// @param _itemName the Item name data
    /// ...Add the other parameters
    function insertItem(address _itemAddress, bytes32 _itemName) public
                                                                 checkValidity(userMap[msg.sender].isValid, 
                                                                                true, 
                                                                                "User not registered") 
                                                                 checkValidity(userMap[msg.sender].itemMap[_itemAddress].isValid, 
                                                                                false, 
                                                                                "Item's address already present") {

        // Create new item
        userMap[msg.sender].items.push(_itemAddress);
        userMap[msg.sender].itemMap[_itemAddress] = Item({isValid: true,
                                                          name: _itemName,
                                                          ratingCount: 0 });
    }

    /// @notice Store the rating of an User's Item
    /// @param _userAddress the user address
    /// @param _itemAddress the item to rate
    /// @param _timestamp the timestamp
    /// @param _score the score
    /// ...Add the other parameters
    /// @dev isn't possibile to pass a rating from the front-end: need to specify each struct element as parameter
    function insertRate(address _userAddress, 
                        address _itemAddress, 
                        uint _timestamp, 
                        uint _score) public checkValidity(userMap[_userAddress].itemMap[_itemAddress].isValid, 
                                                            true, 
                                                            "Item not present") {

        // Retrieve the item and add a new rating
        Item storage item = userMap[_userAddress].itemMap[_itemAddress];
        item.ratingCount += 1; 
        item.ratingMap[item.ratingCount] = Rating({isValid: true,
                                                    score: _score,
                                                    timestamp: _timestamp });
    }


    /****************************/
    /*          VIEWS           */
    /****************************/

    /// @notice return information of a User
    /// @param _userAddress The interested User
    /// @return (name of the User, array of Item's addresses)
    function viewUser(address _userAddress) public view returns(bytes32 _name, address[] memory _items) {

        _name = userMap[_userAddress].name;
        _items = userMap[_userAddress].items;
    }

    /// @notice return information of an Item
    /// @param _userAddress The interested User's Item
    /// @param _itemAddress The interested Item
    /// @return (name of the Item, array of scores timestamps, array of Item's scores)
    function viewItem(address _userAddress, address _itemAddress) public view returns(bytes32 _name, uint[] memory _timestamp, uint[] memory _score) {

        Item storage item = userMap[_userAddress].itemMap[_itemAddress];
        uint count = item.ratingCount;

        _timestamp = new uint[](count);
        _score = new uint[](count);

        for (uint i = 1; i <= count; i++) {
            // Check if Item i-1 isValid?
            _timestamp[i-1] = item.ratingMap[i].timestamp;
            _score[i-1] = item.ratingMap[i].score;
        }

        _name = item.name;
    }
}



