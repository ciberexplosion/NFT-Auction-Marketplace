# Ethereum NFT Digitial Art Auction Marketplace

Prerequisites:
>npm install i

IPFS
>ipfs-http-client@^49.0.2

Solidity compiler version
>Solidity compiler: 0.6.3

To run: 
1) Connect wallet to rinkeby
2) Type
>npm run start 

This DAPP lets anyone add their digital art to IPFS and then put it on auction. Once sold, it is tokenized in ERC721 token ``$ART`` making this platform a censorship resistant auction marketplace for art. 
The auction takes place where the seller can start it with 
1) ``price``: The minimum price or starting price of the auction 
2) ``_bidincrement``: The incremental value is the fixed constant increment that happens to the value. It prevents bots from bidding with a small amount as well as incentivizes the bidder with the best deal.
3) ``tokenURI``: It is the IPFS hash(CID) generated after uploading files to IPFS

There are two kinds of token IDS:
1) ``_tokenIds`` Unique Image ID that are tokenized
2) ``_artItemIds`` Unique ID of images for sale, but not tokenized

Each address is mapped to _tokenId and their bids are stored for that _tokenIDs. 
```
mapping(uint256=>mapping(address => uint256)) public fundsByBidder; //map tokenid to fundsByBidder
```
Two Structs store the Art Item Information and the highest bid information:
``` 
struct ArtItem {
        address payable seller; //address of seller
        uint256 minbid;     //minimum price by artist/seller
        string tokenURI;    //IPFS URL
        bool exists;        //tracks item's existence
        uint bidIncrement; //incrementation of bid
        uint time;          //creation timestamp
        uint timePeriod;    //auction duration
        bool cancelled;     //tracks auction's close
        bool auctionstarted;    //tracks auction's commencement
    }
    
    struct bidding{
     uint highestBindingBid; //highest Bidding Bid of the tokenid
     address payable highestBidder;
    }
```

There are two kinds of bids:
1) ``highestBid``: It is the maximum bid price. 
2) ``highestBindingBid``: The highest bidding bid is the maximum bid amount put in by the user.

**For example:**
The seller sets the minimum price of art X at 10Eth and the increment value is 1Eth. If Bidder named Sachin bids 15Eth, The highest Bid is 11Eth(highestBid) and the amount stored internally as the highest bidding amount is 15Eth(highestBindingBid). 
If a person called Sanchita bids 12Eth, Sachin's highest bid of 13Eth will automatically be staked. In case no one bids after 11Eth bid of Sachin, then Sachin is the highest bidder and when the owner of the art stops the auction, the Token will be minted for 11Eth and rest of the 4Eth will be returned to Sachin. 
Scenarios of Bidder over-bidding his own bid, other bidders under-bidding the Highestbid or the highestBindingBid are covered.

``Widthraw()``:
There is a seperate widhraw function that follows the withdrawal design pattern to prevent re-entrenacy attacks. Each user withdraws his or her own funds. 

There is no owner of the contract, and anyone can put his/her art for sale and tokenize it or buy it. If at any point the frontend application is censored down, the contract is untouched as it is stored on-chain along with IPFS hash.

**TESTS**

Run a local enviornment, preferrably on Ganache.
>truffle migrate

>truffle tests
