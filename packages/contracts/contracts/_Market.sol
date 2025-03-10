// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@nilfoundation/smart-contracts/contracts/NilTokenBase.sol";
// import "@nilfoundation/smart-contracts/contracts/Nil.sol";
// import {IXWallet} from "./interfaces/IXWallet.sol";
// import {NFT} from "./NFT.sol";
// import "./types/Order.sol";

// contract Market is NilBase {
//     mapping(TokenId nftId => Order) private s_orders;
//     mapping(address => mapping(TokenId currencyId => uint256 balance)) private s_virtualBalance;

//     event Put(address indexed owner, uint256 price);
//     event Withdraw(address indexed owner, TokenId indexed tokenId, uint256 amount);
//     event Deposit(address indexed owner, TokenId indexed tokenId, uint256 amount);

//     constructor() {}

//     receive() external payable {}

//     function put(TokenId _nftId, TokenId _currencyId, uint256 _price) public onlyInternal {
//         // TODO: if wallet does not support approve/transferFrom it should be able to transfer token directly
//         require(_checkAllowanceToMarket(msg.sender, _nftId, 1), "NFT is not approved");
//         s_orders[_nftId] = Order(msg.sender, address(0), _currencyId, _price, OrderState.PLACED);
//         emit Put(msg.sender, _price);
//     }

//     function buy(TokenId _nftId) external payable {
//         Order storage order = s_orders[_nftId];
//         require(order.price > 0, "Order not found");
//         require(order.buyer == address(0), "Order has pending buyer");

//         // Check order currency and price are eq to received tokens
//         if (order.currencyId == TokenId.wrap(address(0))) {
//             // Order currency = native token
//             require(msg.value == order.price, "Received amount is not equal to order's price");
//         } else {
//             // Order currency = custom token
//             Nil.Token memory attachedToken = _getAttachedCurrency();
//             require(attachedToken.amount == order.price, "Received amount is not equal to order's price");
//         }

//         // Increase virtual balance
//         s_virtualBalance[msg.sender][order.currencyId] += order.price;

//         order.buyer = msg.sender;

//         // init NFT transferFrom
//         Nil.Token[] memory tokens = new Nil.Token[](1);
//         tokens[0] = Nil.Token(_nftId, 1);

//         bytes memory transferFromCallData = abi.encodeCall(IXWallet.transfer, (tokens, address(this)));

//         // Set handleDepositNFT as a handler with the buyer address and nft id context
//         bytes memory context = abi.encodeWithSelector(this.handleDepositNFT.selector, _nftId, msg.sender);

//         // async call:
//         return Nil.sendRequest(order.seller, 0, Nil.ASYNC_REQUEST_MIN_GAS, context, transferFromCallData);
//     }

//     function deposit() public payable {
//         Nil.Token memory token = _getAttachedCurrency();
//         _deposit(msg.sender, token.id, token.amount);
//     }

//     function withdraw(Nil.Token memory _token) external {
//         require(s_virtualBalance[msg.sender][_token.id] >= _token.amount, "Virtual balance low");
//         _withdrawAsync(msg.sender, _token);
//     }

//     function handleDepositNFT(bool _success, bytes memory, bytes memory _context) public onlyResponse {
//         if (!_success) {
//             // TODO clear status
//         } else {
//             (TokenId nft, address buyer) = abi.decode(_context, (TokenId, address));

//             Order memory order = s_orders[nft];
//             require(s_virtualBalance[buyer][order.currencyId] >= order.price, "Buyer's virtual balance low");

//             // decrease buyers currency
//             s_virtualBalance[buyer][order.currencyId] -= order.price;
//             // increase sellers currency
//             s_virtualBalance[order.seller][order.currencyId] += order.price;
//             // increase buyers nft
//             s_virtualBalance[buyer][nft] += 1;

//             _withdrawAsync(buyer, Nil.Token(nft, 1));
//             _withdrawAsync(order.seller, Nil.Token(order.currencyId, order.price));
//         }
//     }

//     function handleWithdrawResult(bool _success, bytes memory, bytes memory _context) public payable onlyResponse {
//         (Nil.Token memory token, address owner) = abi.decode(_context, (Nil.Token, address));

//         if (!_success) _deposit(owner, token.id, token.amount);
//     }

//     function getBalance(address _owner, TokenId _token) external view returns (uint256) {
//         return s_virtualBalance[_owner][_token];
//     }

//     function getOrder(TokenId _nftId) external view returns (Order memory) {
//         return s_orders[_nftId];
//     }

//     function getPendingBuyer(TokenId _nftId) external view returns (address) {
//         return s_orders[_nftId].buyer;
//     }

//     function _withdrawAsync(address _to, Nil.Token memory _token) private {
//         require(s_virtualBalance[_to][_token.id] >= _token.amount);
//         s_virtualBalance[_to][_token.id] -= _token.amount;

//         Nil.Token[] memory tokens = new Nil.Token[](1);
//         tokens[0] = _token;

//         bytes memory context = abi.encodeWithSelector(this.handleWithdrawResult.selector, _token, _to);
//         bytes memory callData = "";

//         emit Withdraw(_to, _token.id, _token.amount);

//         // async call:
//         Nil.sendRequestWithTokens(_to, 0, tokens, Nil.ASYNC_REQUEST_MIN_GAS, context, callData);
//     }

//     function _deposit(address _owner, TokenId _tokenId, uint256 _amount) private {
//         s_virtualBalance[_owner][_tokenId] += _amount;

//         emit Deposit(_owner, _tokenId, _amount);
//     }

//     function _getAttachedCurrency() private returns (Nil.Token memory) {
//         Nil.Token[] memory tokens = Nil.txnTokens();
//         // TODO remove require and make this funciton view
//         require(tokens.length == 1, "Multiple currencies are not supported");
//         return tokens[0];
//     }

//     function _checkAllowanceToMarket(
//         address _from,
//         TokenId _currencyId,
//         uint256 _amount
//     ) private view returns (bool) {
//         uint256 allowance = IXWallet(_from).allowance(address(this), _currencyId);
//         return allowance >= _amount;
//     }
// }