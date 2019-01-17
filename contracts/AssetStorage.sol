pragma solidity 0.5.0;

import {Ownable} from "./Interfaces.sol"; //causa problemi con User is Ownable

/// @title AssetStorage
/// @notice This contract interface defines the methods needed by a storage data structure
contract AssetStorage {

    function insert(address a) public;

    function remove(address a) public;

//  function update(address a, <<what data???>>) public;

    function isIn(address a) public view returns(bool);    

    function getCount() public view returns(uint);

    function getAssets() public view returns(address[] memory);
}

/// @title StoragePointer
/// @notice This contract manages a storage data structure that allows insertion/deletion without iterating the stored elements, iteration and random access, but removing the elements changes the ordering of the elements
//
// Create a CRUD pointer-based structure
// source: https://medium.com/@robhitchens/solidity-crud-part-1-824ffa69509a
// 
// Benefits:
//     - possbility to iterate
//     - insert/remove don't iterate over the data
//     - remove operation scales array of addresses
//
// Flaws:
//     - destroy original ordering of addresses after remove operation
contract StoragePointer is AssetStorage {

    // Map contractAddress => array_pointer
    mapping(address => uint) assetMap;
    address[] assetIndex;

    function insert(address a) public {

        require(!isIn(a), "Address already stored");

        uint len = assetIndex.push(a);
        assetMap[a] = len-1;
    }

    function remove(address a) public {

        require(isIn(a), "Address not stored");

        uint rowToDelete = assetMap[a];
        address keyToMove = assetIndex[assetIndex.length-1];
        assetIndex[rowToDelete] = keyToMove;
        assetMap[keyToMove] = rowToDelete;
        assetIndex.length--;
    }

    function isIn(address a) public view returns (bool) {
        
        if (assetIndex.length == 0) 
            return false;

        uint idx = assetMap[a];
        return assetIndex[idx] == a;
    }

    function getCount() public view returns(uint) {

        return assetIndex.length;
    }

    function getAssets() public view returns(address[] memory) {

        return assetIndex;
    }

    function getKeyAt(uint index) public view returns(address) {

        require(index >= 0 && index < assetIndex.length);
        return assetIndex[index];
    }
}



/// @title OwnableCRUDStorage
/// @notice Extension of StoragePointer such that insert/remove operations are allowed only by the owner of the storage
contract OwnableCRUDStorage is StoragePointer, Ownable {

    constructor(address _owner) public Ownable(_owner) {}

    function insert(address a) public isOwner {

        super.insert(a);
    }
    
    function remove(address a) public isOwner {

        super.remove(a);
    }
}