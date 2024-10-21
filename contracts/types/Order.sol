// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CurrencyId} from "@nilfoundation/smart-contracts/contracts/NilCurrencyBase.sol";

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
    CurrencyId currencyId;
    uint256 price;
    OrderState state;
}
