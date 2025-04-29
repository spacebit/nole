// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@nilfoundation/smart-contracts/contracts/NilTokenBase.sol";
import "@nilfoundation/smart-contracts/contracts/Nil.sol";
import {IXWallet} from "./interfaces/IXWallet.sol";
import {INFT} from "./interfaces/INFT.sol";
import {IERC165} from "./interfaces/IERC165.sol";

struct Order {
    TokenId nftId;
    TokenId currencyId;
    uint256 price;
}

contract Market is NilBase {
    mapping(TokenId nftId => Order) private s_orders;
    mapping(address => mapping(TokenId currencyId => uint256 balance))
        private s_virtualBalance;

    error Market__TokenIsNotNFT();
    error Market__TokensAndOrdersLengthMismatch();
    error Market__NFTAlreadyOnSale(TokenId nftId);
    error Market__OrderNotFound(TokenId nftId);
    error Market__OrderWrongCurrency(TokenId nftId);
    error Market__OrderWrongPrice(TokenId nftId);
    error Market__MoreThanOneTokenSent();

    event OrderCreated(
        address indexed seller,
        TokenId indexed nftId,
        TokenId currencyId,
        uint256 price
    );
    event Buy(address buyer, TokenId);
    event Deposited(
        address indexed owner,
        TokenId indexed tokenId,
        uint256 amount
    );

    constructor() {}

    receive() external payable {}

    function list(Order[] memory _orders) public payable onlyInternal {
        Nil.Token[] memory tokens = Nil.txnTokens();
        if (tokens.length != _orders.length) {
            revert Market__TokensAndOrdersLengthMismatch();
        }

        for (uint256 i = 0; i < _orders.length; i++) {
            Nil.Token memory attachedToken = tokens[i];
            _assertAttachedTokenIsNFT(attachedToken);

            TokenId nftId = attachedToken.id;

            if (s_orders[nftId].price != 0) {
                revert Market__NFTAlreadyOnSale(nftId);
            }

            Order memory order = _orders[i];

            // Store order
            s_orders[nftId] = Order({
                nftId: nftId,
                currencyId: order.currencyId,
                price: order.price
            });

            // Deposit NFT to virtual balance (escrow)
            _deposit(msg.sender, nftId, attachedToken.amount);

            // Emit event for each created order
            emit OrderCreated(msg.sender, nftId, order.currencyId, order.price);
        }
    }

    function buy(TokenId _nft) external payable {
        emit Buy(msg.sender, _nft);
    }

    // function buy(TokenId _nft) external payable {
    //     Order memory order = getOrder(_nft);
    //     if (order.price == 0) revert Market__OrderNotFound(_nft);

    //     // TODO: order currency is native token branch

    //     Nil.Token[] memory tokens = Nil.txnTokens();
    //     if (tokens.length > 1) revert Market__MoreThanOneTokenSent();

    //     Nil.Token memory currency = tokens[0];

    //     if (order.currencyId != currency.id) revert Market__OrderWrongCurrency(_nft);
    //     if (order.price != currency.amount) revert Market__OrderWrongPrice(_nft);
    // }

    function getOrder(TokenId _nftId) public view returns (Order memory) {
        return s_orders[_nftId];
    }

    function _deposit(
        address _owner,
        TokenId _tokenId,
        uint256 _amount
    ) private {
        s_virtualBalance[_owner][_tokenId] += _amount;

        emit Deposited(_owner, _tokenId, _amount);
    }

    function _assertAttachedTokenIsNFT(Nil.Token memory _token) private view {
        address nftContractAddress = TokenId.unwrap(_token.id);
        if (
            !IERC165(nftContractAddress).supportsInterface(
                type(INFT).interfaceId
            )
        ) {
            revert Market__TokenIsNotNFT();
        }
    }
}
