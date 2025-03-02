// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Collection} from "./Collection.sol";

/// @title Collection Registry
/// @notice This contract is  a factory for Collection.sol contracts
/// It aims to give a quick overview of a Collections available for address
contract CollectionRegistry {
    mapping(address owner => Collection[] collection) private s_collectionsOf;
    mapping(address owner => uint256) private s_collectionsAmount;

    function createCollection(
        string memory _collectionName,
        string memory _symbol,
        string memory _contractURI
    ) external returns (Collection) {
        Collection newCollection = new Collection(_collectionName, _symbol, _contractURI);
        s_collectionsOf[msg.sender].push(newCollection);
        s_collectionsAmount[msg.sender]++;
        return newCollection;
    }

    function getCollectionsOf(
        address _owner
    ) external view returns (Collection[] memory) {
        return s_collectionsOf[_owner];
    }

    function getCollectionsAmountOf(address _owner) external view returns (uint256) {
        return s_collectionsAmount[_owner];
    }
}
