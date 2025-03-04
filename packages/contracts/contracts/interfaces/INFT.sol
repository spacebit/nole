// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TokenId, NilBase} from "@nilfoundation/smart-contracts/contracts/Nil.sol";
import {IERC165} from "./IERC165.sol";

// 0x4164019d
interface INFT is IERC165 {
    function tokenURI() external view returns (string memory);

    function collectionAddress() external view returns (address);

    function tokenId() external view returns (uint256);
}
