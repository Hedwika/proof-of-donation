// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProofOfDonationNFT is ERC721URIStorage {
    uint256 private _tokenIdCounter;

    // Mapping for collections
    mapping(uint256 => string) private _collectionNames; // Collection ID to Name
    mapping(uint256 => uint256[]) private _collectionTokens; // Collection ID to Token IDs

    constructor() ERC721("ProofOfDonationNFT", "POD") {
        _tokenIdCounter = 1; // Start token IDs from 1
    }

    // Mint a new NFT
    function mintNFT(address recipient, string memory tokenURI, uint256 collectionId) public {
        uint256 tokenId = _tokenIdCounter;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Associate token with the collection
        if (bytes(_collectionNames[collectionId]).length > 0) {
            _collectionTokens[collectionId].push(tokenId);
        }

        _tokenIdCounter++;
    }

    // Create a new collection (only the owner can create collections)
    function createCollection(uint256 collectionId, string memory collectionName) public {
        require(bytes(_collectionNames[collectionId]).length == 0, "Collection ID already exists");
        _collectionNames[collectionId] = collectionName;
    }

    // Get collection details
    function getCollection(uint256 collectionId) public view returns (string memory collectionName, uint256[] memory tokenIds) {
        return (_collectionNames[collectionId], _collectionTokens[collectionId]);
    }

    // Retrieve the next token ID (useful for the frontend to fetch tokenId)
    function nextTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
