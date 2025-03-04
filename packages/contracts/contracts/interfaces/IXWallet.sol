// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@nilfoundation/smart-contracts/contracts/Nil.sol";

/// This contract offers interface for approve/transferFrom
/// It should be removed, approve/transferFrom should exists on the protocol level
interface IXWallet {
    event Approval(address indexed spender, TokenId indexed tokenId, uint256 amount);

    function allowance(address spender, TokenId token) external view returns (uint256);

    function approve(address spender, Nil.Token[] memory tokens) external;

    function transfer(Nil.Token[] memory tokens, address recepient) external;
}