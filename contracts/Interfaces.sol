pragma solidity 0.5.0;

/// @title Ownable
/// @notice This contract keeps the information of its owner, passed as parameter to the constructor. It provides a modifier to let only the owner to pass its guard
contract Ownable {

    address public owner;  // Array di owners

    constructor (address _owner) public {

        owner = _owner;
    }

    modifier isOwner() {

        require(msg.sender == owner, "Not the owner");
        _;
    }

    function changeOwner(address _to) public isOwner {

        owner = _to;
    }
}


/// @title Permissioned
/// @notice This contract defines a permission policy and provides the functions to grant/revoke permissions to certain users/contracts
contract Permissioned is Ownable {

    struct PermissionPolicy {
        
        bool granted;
        uint periodStart;
    }

    constructor (address _owner) Ownable(_owner) public {}

    mapping(address => PermissionPolicy) public permissionMap;
    uint public interval = 4 weeks; 


    function grantPermission(address _to) public isOwner {

        require(_to != owner, "The owner cannot grant permission to himself");

        // Magari trovare soluzione alternativa a "now"
        permissionMap[_to] = PermissionPolicy({granted: true, periodStart: now});
    }


    function revokePermission(address _to) public {

        require(msg.sender == _to || msg.sender == owner, "You cannot revoke permission to other users");

        permissionMap[_to] = PermissionPolicy({granted: false, periodStart: 0});
    }


    function checkForPermission(address _of) public view returns (uint) {

        PermissionPolicy memory policy = permissionMap[_of];

        if (policy.granted == false) 
            return 1; // No permission to rate
        if (policy.periodStart + interval < now) 
            return 2; // Out of date

        return 0;
    }

    function getMyPolicy() public view returns(uint _interval, bool _granted) {

        _interval = permissionMap[msg.sender].periodStart + interval;
        _granted = permissionMap[msg.sender].granted;
    }

}

