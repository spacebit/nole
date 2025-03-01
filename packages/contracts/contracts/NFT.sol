// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@nilfoundation/smart-contracts/contracts/Nil.sol";
import "@nilfoundation/smart-contracts/contracts/NilTokenBase.sol";
import {ICollection} from "./interfaces/ICollection.sol";
import {INFT} from "./interfaces/INFT.sol";

contract NFT is INFT, NilTokenBase {
    address private s_collectionAddress;
    uint256 private s_tokenId;
    string s_tokenURI;

    constructor(address _owner, uint256 _tokenId, string memory _tokenURI, address _collectionAddress) payable {
        mintTokenInternal(1);

        s_collectionAddress = _collectionAddress;
        s_tokenId = _tokenId;
        s_tokenURI = _tokenURI;

        sendTokenInternal(_owner, getTokenId(), 1);
    }

    receive() external payable {}

    function tokenURI() external view returns (string memory) {
        return s_tokenURI;
    }

    function collectionAddress() public view returns (address) {
        return s_collectionAddress;
    }

    function tokenId() public view returns (uint256) {
        return s_tokenId;
    }

    // function sendToken(address _to, TokenId _tokenId, uint256 _amount) onlyExternal override public {
    //     ICollection(s_collectionAddress).changeOwner(s_tokenId, msg.sender, _to);
    //     super.sendTokenInternal(_to, _tokenId, _amount);
    // }
}