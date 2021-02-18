const { assert } = require("chai");


const ArtAuction = artifacts.require("ArtAuction");

contract("ArtAuction", function(accounts) {
  const AccountOne = accounts[0];
	const AccountTwo = accounts[1];
  
  before(async () => {
		contract = await ArtAuction.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'DART')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'ART')
    })

  })
  

	it('It should set an art item', async()=>{
    let error = null;
    try{
    const ArtAuction = await ArtAuction.deployed();
    await ArtAuction.addArtItem(100, "ipfshash", 10);
    }
    catch(error)
    {error=error;}
    assert.isNull(error);
  });


it("should not add art item with price of zero", async () => {
  // Arrange
  let err = null;

  // Act
  try {
    await contract.addArtItem(0, tTokenURI, 10, { from: AccountTwo });
  } catch (error) {
    err = error;
  }

  // Assert
  assert.isNotNull(err);
});

it("should not cancel an auction that does not exists",async() =>{
  let err=null;

  try{
    await contract.cancelAuction(100, {from: AccountOne});
  }
  catch(error)
  {
    err=error;
  }
  assert.isNotNull(err);
});
});
