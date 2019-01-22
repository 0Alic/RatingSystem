pragma solidity ^0.5.0;

import {Ownable} from "./Interfaces.sol";
import "./RatingComputer.sol";

/// @title ComputerRegistry
/// @notice This contracts stores a list of RatingComputers. An Item can pick from this registry the computer it wants to use to compute its final score
contract ComputerRegistry is Ownable {

    RatingComputer[] private registry;
    bytes32[] private ids;

    constructor() Ownable(msg.sender) public {}

    /// @notice Add a new RatingComputer to the registry, only if the caller is the owner of this registry (avoid spam)
    /// @param _computer The computer to add
    /// @param _name A name for the computer
    function pushComputer(RatingComputer _computer, bytes32 _name) external isOwner {

        registry.push(_computer);
        ids.push(_name);
    }

    /// @notice Get the RatingComputer at a certain index
    /// @param _index The index of the computer to retrieve
    /// @return The RatingComputer address
    function getComputer(uint _index) external view returns(RatingComputer) {

        require(_index >= 0 && _index < registry.length, "Invalid computer index");

        return registry[_index];
    }

    /// @notice Get the list of the names of the stored RatingComputer s
    /// @return The list of RatingComputer
    function getIds() external view returns(bytes32[] memory) {

        return ids;
    }
}
