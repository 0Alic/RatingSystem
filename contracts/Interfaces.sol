pragma solidity ^0.5.0;

/// @title Ownable
/// @notice This contract keeps the information of its owner, passed as parameter to the constructor. It provides a modifier to let only the owner to pass its guard
contract Ownable {

    address public owner;

    constructor (address _owner) public {

        owner = _owner;
    }

    modifier isOwner() {

        require(msg.sender == owner, "Not the owner");
        _;
    }

    /// @notice This function provides the possibility to change the owner
    /// @param _to The new owner of this contract 
    function changeOwner(address _to) external isOwner {

        owner = _to;
    }
}


/// @title Permissioned
/// @notice This contract defines a permission policy and provides the functions to grant/revoke permissions to certain users/contracts. A Permissioned contract should be a contract with the purpouse to be accessed only by authorized entities
contract Permissioned is Ownable {

    // The policy defined for this contract
    struct PermissionPolicy {
        
        bool granted;
        uint periodStart;
    }

    // For each address we have a PermissionPolicy defined
    mapping(address => PermissionPolicy) public permissionMap;
    uint constant interval = 4 weeks; 


    constructor (address _owner) Ownable(_owner) public {}


    /// @notice Grant the permission to access to this contract to a certain address (contract or OWA)
    /// @param _to The address meant to have permission
    /// @dev The owner of this contract cannot grant permission to itself 
    function grantPermission(address _to) external isOwner {

        require(_to != owner, "The owner cannot grant permission to himself");

        // Magari trovare soluzione alternativa a "now"
        permissionMap[_to] = PermissionPolicy({granted: true, periodStart: now});
    }


    /// @notice Revoke the permission to access to this contract to a certain address (contract or OWA)
    /// @param _to The address to revoke permission
    /// @dev Only the owner of this contract or the receiver itself can revoke the permission to the receiver
    function revokePermission(address _to) public {

        require(msg.sender == _to || msg.sender == owner, "You cannot revoke permission to other users");

        permissionMap[_to] = PermissionPolicy({granted: false, periodStart: 0});
    }


    /// @notice Check the permission status of a certain address
    /// @param _of The address to check
    /// @dev 0: Permission granted; 1: No permission granted; 2: Permission granted but out of date
    function checkForPermission(address _of) public view returns (uint) {

        PermissionPolicy memory policy = permissionMap[_of];

        if (policy.granted == false) 
            return 1; // No permission to rate
        if (policy.periodStart + interval < now) 
            return 2; // Out of date

        return 0;
    }

    /// @notice Get current permission policy of the caller
    /// @return _deadline: the deadline period (timestamp)
    /// @return _granted: the flag "permission granted"
    function getMyPolicy() external view returns(uint _deadline, bool _granted) {

        _deadline = permissionMap[msg.sender].periodStart + interval;
        _granted = permissionMap[msg.sender].granted;
    }

}

