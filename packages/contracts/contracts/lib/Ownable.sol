// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Ownable
/// @notice This contract assigns an owner upon deployment and does not allow ownership transfer.
abstract contract Ownable {
    address private immutable _owner;

    /// @notice Initializes the contract by setting the deployer as the owner.
    constructor(address owner_) {
        _owner = owner_;
    }

    /// @notice Returns the address of the current owner.
    function owner() public view returns (address) {
        return _owner;
    }

    /// @notice Restricts function execution to only the owner.
    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }
}
