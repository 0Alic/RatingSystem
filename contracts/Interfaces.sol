pragma solidity ^0.5.0;

import "./Entities.sol";

// Lista linkata + mapping?

// Create a CRUD structure
// 
contract AssetStorage {

    struct AssetStruct {

//        address asset;
        uint pointer;
    }
/*
    // address => pointer
    mapping(address => AssetStruct) assetMap;
    address[] assetArray = new address[](1); // posizion 0 "special"

    function insert(address _newAssetAddress) public {

        require(assetMap[_newAssetAddress].pointer == 0, "ASDa");

        uint id = assetArray.push(_newAssetAddress);
        assetMap[_newAssetAddress] = AssetStorage({pointer: id-1});

        uint id = assetArray.length;
        require(assetMap[id] == address(0x0), "Asset already present");

        assetArray.push(id);
        assetMap[id] = _newAssetAddress;

    }

    function delete(address _assetToDelete) public {

        uint positionToDelete = assetMap[_assetToDelete].pointer;
        require(positionToDelete != 0, "ndsajk");

        uint idToMove = 
        assetArray[idPosition] = assetArray[assetArray.length-1];

    }
    */
}


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

contract Factory {

    uint public assetCount;
    uint public maxId;
    // Map id => asset_contract_address
    mapping(uint => address) public assetMap; // First should have key = 1
//    address[] assetMap;

    function updateAssets(address _newAssetAddress) internal {

        assetCount++;
        maxId++;
//        assetMap.push(_newAssetAddress);
        assetMap[assetCount] = _newAssetAddress;
    }

/*
    function deleteAsset(uint _id) internal {
        
        require(_id >= 0 && _id < assetMap.length, "Invalid key");
//        require(assetMap[_id] != address(0x0), "Asset not present");

        delete assetMap[_id];   // Essere sicuro che la chiami solo il proprietario
        assetCount--;
    }
*/
    function getAssets() public view returns(address[] memory) {

        address[] memory assets = new address[](assetCount);
        uint c = 0;

        // Garantire che in ogni caso ho assetCount entrate validi
        for(uint i=0; i<maxId; i++) {

            if(assetMap[i+1] != address(0x0)){

                assets[c] = assetMap[i+1];
                c++;
            }
        }
        
        return assets;
        
//        return assetMap;
    }
}


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


    function revokePermission(address _to) internal {

        require(msg.sender == _to, "You cannot revoke permission to other users");

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

