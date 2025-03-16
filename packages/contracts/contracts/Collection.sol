// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ICollection.sol";
import "./lib/Ownable.sol";
import "./NFT.sol";
import "./interfaces/INFT.sol";

contract Collection is ICollection, Ownable {
    string private s_collectionName;
    string private s_collectionSymbol;
    string private s_contractURI;

    mapping(uint256 tokenId => address tokenAddress) private s_tokens;
    mapping(uint256 tokenId => address) private s_owners;
    mapping(address owner => uint256 amount) private s_balances;

    constructor(string memory _collectionName, string memory _symbol, string memory _contractURI, address _owner) Ownable(_owner)  {
        s_collectionName = _collectionName;
        s_collectionSymbol = _symbol;
        s_contractURI = _contractURI;
    }

    function name() external view returns (string memory) {
        return s_collectionName;
    }

    function symbol() external view returns (string memory) {
        return s_collectionSymbol;
    }

    function contractURI() public view returns (string memory) {
        return s_contractURI;
    }

    function getNFTAddress(uint256 tokenId) public view returns (address) {
        return s_tokens[tokenId];
    }

    function balanceOf(address owner) external view returns (uint256) {
        return s_balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = s_owners[tokenId];
        if (owner == address(0)) {
            revert Collection__NonexistentToken(tokenId);
        }
        return owner;
    }

    function mint(address _to, uint256 _tokenId, string memory _tokenURI) public onlyOwner {
        if (s_tokens[_tokenId] != address(0))
            revert Collection__AlreadyMinted(_tokenId);

        NFT newToken = new NFT(_to, _tokenId, _tokenURI, address(this));
        s_tokens[_tokenId] = address(newToken);
        s_owners[_tokenId] = _to;
        emit TokenMinted(address(newToken));
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return INFT(s_tokens[_tokenId]).tokenURI();
    }
}
