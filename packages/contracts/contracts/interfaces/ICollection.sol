// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICollection {
    event CollectionCreated(address);

    error Collection__AlreadyMinted(uint256 nft);
    error Collection__NonexistentToken(uint256 nft);
    error Collection__OnlyToken();

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function getNFTAddress(uint256 tokenId) external view returns (address);

    function mint(
        address _to,
        uint256 _tokenId,
        string memory _tokenURI
    ) external;

    function contractURI() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    // function balanceOf(address owner) external view returns (uint256 balance);
    // function ownerOf(uint256 tokenId) external view returns (address owner);
    // function changeOwner(uint256 _tokenId, address _prevOwner, address _newOwner) external;
}
