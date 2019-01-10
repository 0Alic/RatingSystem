pragma solidity ^0.5.0;

//import "./Interfaces.sol"; //causa problemi con User is Ownable

contract AssetStorage {

    function insert(address a) public;

    function remove(address a) public;

    function isIn(address a) public view returns(bool);    

    function getCount() public view returns(uint);

    function getAssets() public view returns(address[] memory);
}

//
// Create a CRUD pointer-based structure
// source: https://medium.com/@robhitchens/solidity-crud-part-1-824ffa69509a
// 
// Benefits:
//     - possbility to iterate
//     - remove operation scales array of addresses
//
// Flaws:
//     - destroy ordering of addresses after remove operation

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

        require(index > 0 && index < assetIndex.length);
        return assetIndex[index];
    }
}

