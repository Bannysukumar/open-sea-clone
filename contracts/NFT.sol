// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    mapping(uint256 => address) public tokenCreators;
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => bool) public tokenListed;
    
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTDelisted(uint256 indexed tokenId);
    
    constructor() ERC721("OpenSea Clone NFT", "OSCNFT") Ownable(msg.sender) {}
    
    function mintNFT(string memory tokenURI, uint256 price) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        tokenCreators[newTokenId] = msg.sender;
        tokenPrices[newTokenId] = price;
        tokenListed[newTokenId] = true;
        
        emit NFTMinted(newTokenId, msg.sender, tokenURI);
        emit NFTListed(newTokenId, price);
        
        return newTokenId;
    }
    
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        
        tokenPrices[tokenId] = price;
        tokenListed[tokenId] = true;
        
        emit NFTListed(tokenId, price);
    }
    
    function delistNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        
        tokenListed[tokenId] = false;
        
        emit NFTDelisted(tokenId);
    }
    
    function getTokenInfo(uint256 tokenId) public view returns (
        address owner,
        address creator,
        uint256 price,
        bool listed,
        string memory tokenURI
    ) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        return (
            ownerOf(tokenId),
            tokenCreators[tokenId],
            tokenPrices[tokenId],
            tokenListed[tokenId],
            super.tokenURI(tokenId)
        );
    }
    
    function getTotalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
} 