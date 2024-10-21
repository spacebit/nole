// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@nilfoundation/smart-contracts/contracts/NilCurrencyBase.sol";
import "@nilfoundation/smart-contracts/contracts/Wallet.sol";
import "../interfaces/IXWallet.sol";

contract XWalletRevert is IXWallet, NilCurrencyBase {
    address s_market;
    bytes pubkey;

    mapping(address spender => mapping(CurrencyId tokenId => uint256 amount)) private s_allowances;

    constructor(bytes memory _pubkey, address _market) {
        pubkey = _pubkey;
        s_market = _market;
    }

    receive() external payable {
        require(msg.sender != s_market, "Test: revert market");
    }

    function allowance(address _spender, CurrencyId _token) public view returns (uint256) {
        return s_allowances[_spender][_token];
    }

    function approve(address _spender, Nil.Token[] memory _tokens) public onlyExternal {
        uint256 length = _tokens.length;
        for (uint256 i = 0; i < length; i++) {
            Nil.Token memory tkn = _tokens[i];
            s_allowances[_spender][tkn.id] = tkn.amount;
            emit Approval(_spender, tkn.id, tkn.amount);
        }
    }

    // rename to approvedTransfer? transferFrom?
    function transfer(Nil.Token[] memory _tokens, address _recepient) public onlyInternal {
        uint256 length = _tokens.length;
        for (uint i = 0; i < length; i++) {
            Nil.Token memory tkn = _tokens[i];
            require(s_allowances[msg.sender][tkn.id] >= tkn.amount, "Transfer more than allowed");
            s_allowances[msg.sender][tkn.id] -= tkn.amount;
        }

        Nil.asyncCallWithTokens(
            _recepient,
            address(this),
            address(this),
            gasleft(),
            Nil.FORWARD_NONE,
            false,
            0,
            _tokens,
            ""
        );
    }

    /**
     * @dev Function to handle bounce messages.
     * @param err The error message.
     */
    function bounce(string calldata err) external payable {}

    /**
     * @dev Sends raw message.
     * @param message The raw message to send.
     */
    function send(bytes calldata message) public onlyExternal {
        Nil.sendMessage(message);
    }

    /**
     * @dev Makes an asynchronous call.
     * @param dst The destination address.
     * @param refundTo The address where to send refund message.
     * @param bounceTo The address where to send bounce message.
     * @param feeCredit The amount of tokens available to pay all fees during message processing.
     * @param deploy Whether to deploy the contract.
     * @param tokens The multi-currency tokens to send.
     * @param value The value to send.
     * @param callData The call data of the called method.
     */
    function asyncCall(
        address dst,
        address refundTo,
        address bounceTo,
        uint feeCredit,
        bool deploy,
        Nil.Token[] memory tokens,
        uint value,
        bytes calldata callData
    ) public onlyExternal {
        Nil.asyncCallWithTokens(dst, refundTo, bounceTo, feeCredit, Nil.FORWARD_NONE, deploy, value, tokens, callData);
    }

    /**
     * @dev Makes a synchronous call, which is just a regular EVM call, without using messages.
     * @param dst The destination address.
     * @param feeCredit The amount of tokens available to pay all fees during message processing.
     * @param value The value to send.
     * @param call_data The call data of the called method.
     */
    function syncCall(address dst, uint feeCredit, uint value, bytes memory call_data) public onlyExternal {
        (bool success, ) = dst.call{value: value, gas: feeCredit}(call_data);
        require(success, "Call failed");
    }

    /**
     * @dev Verifies an external message.
     * @param hash The hash of the data.
     * @param signature The signature to verify.
     * @return True if the signature is valid, false otherwise.
     */
    function verifyExternal(uint256 hash, bytes calldata signature) external view returns (bool) {
        return Nil.validateSignature(pubkey, hash, signature);
    }
}
