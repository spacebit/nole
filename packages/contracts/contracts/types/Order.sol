// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TokenId} from "@nilfoundation/smart-contracts/contracts/NilTokenBase.sol";

struct Order {
    TokenId currencyId;
    uint256 price;
}