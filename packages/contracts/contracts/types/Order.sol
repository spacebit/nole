// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TokenId} from "@nilfoundation/smart-contracts/contracts/NilTokenBase.sol";

// TODO remove
enum OrderState {
    PLACED,
    BUY_INIT,
    BUY_CURRENCY_RECEIVED,
    SWAPPED
}

struct Order {
    address seller;
    address buyer;
    TokenId currencyId;
    uint256 price;
    OrderState state;
}