// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TokenId, NilBase} from "@nilfoundation/smart-contracts/contracts/Nil.sol"; 

interface INFT {
    function tokenURI() external view returns (string memory);
    // function sendToken(address to, TokenId tokenId, uint256 amount) external;
}
