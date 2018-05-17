import expectThrow from './helpers/expectThrow';
const BigNumber = web3.BigNumber;
const should = require('chai')
.use(require('chai-as-promised'))
.use(require('chai-bignumber')(BigNumber))
.should();
const assertRevert = require('./helpers/assertRevert');

const TBLToken = artifacts.require("TBLToken");

contract('TBLToken', (accounts) => {
  let token;
  beforeEach(async function () {
    token = await TBLToken.new();
  });

  it('creation: should correct with basic token information', async () => {
     const instance = await TBLToken.deployed();
     const name = await instance.name.call();
     const symbol = await instance.symbol.call();
     const decimals = await instance.decimals.call();

     assert.equal(name.valueOf(), "Tombola");
     assert.equal(symbol.valueOf(), "TBL");
     assert.equal(decimals.valueOf(), 18);
   });

  //mintable test start
  it('creation: should start with a totalSupply of 0', async function () {
    let totalSupply = await token.totalSupply();

    assert.equal(totalSupply, 0);
  });

  it('should return mintingFinished false after construction', async function () {
    let mintingFinished = await token.mintingFinished();

    assert.equal(mintingFinished, false);
  });

  it('should mint a given amount of tokens to a given address', async function () {
    const result = await token.mint(accounts[0], 100);
    assert.equal(result.logs[0].event, 'Mint');
    assert.equal(result.logs[0].args.to.valueOf(), accounts[0]);
    assert.equal(result.logs[0].args.amount.valueOf(), 100);
    assert.equal(result.logs[1].event, 'Transfer');
    assert.equal(result.logs[1].args.from.valueOf(), 0x0);

    let balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0, 100);

    let totalSupply = await token.totalSupply();
    assert.equal(totalSupply, 100);
  });

  it('should fail to mint after call to finishMinting', async function () {
    await token.finishMinting();
    assert.equal(await token.mintingFinished(), true);
    await expectThrow(token.mint(accounts[0], 100));
  });

  it('should return correct balances after transfer', async function () {
    await token.mint(accounts[0], 100);
    await token.transfer(accounts[1], 100);

    let balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0, 0);

    let balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1, 100);
  });


  it('should return correct balances after transfering from another account', async function () {
    await token.mint(accounts[0], 100);
    await token.approve(accounts[1], 100);
    await token.transferFrom(accounts[0], accounts[2], 100, { from: accounts[1] });

    let balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0, 0);

    let balance1 = await token.balanceOf(accounts[2]);
    assert.equal(balance1, 100);

    let balance2 = await token.balanceOf(accounts[1]);
    assert.equal(balance2, 0);
  });

  it('should throw an error when trying to transfer more than allowed', async function () {
    await token.mint(accounts[0], 100);
    await token.approve(accounts[1], 99);
    try {
      await token.transferFrom(accounts[0], accounts[2], 100, { from: accounts[1] });
      assert.fail('should have thrown before');
    } catch (error) {
      assertRevert(error);
    }
  });

  it('should throw an error when trying to transferFrom more than _from has', async function () {
    let balance0 = await token.balanceOf(accounts[0]);
    await token.approve(accounts[1], 99);
    try {
      await token.transferFrom(accounts[0], accounts[2], balance0 + 1, { from: accounts[1] });
      assert.fail('should have thrown before');
    } catch (error) {
      assertRevert(error);
    }
  });

  describe('validating pausable functionality', ()=> {
    it('should throw an error when transfer and pasued', async ()=>{
      await token.pause();
      await token.mint(accounts[0], 100);
      try {
        await token.transfer(accounts[1], 100);
        assert.fail('should have thrown before');
      }catch(error){
        assertRevert(error);
      }
    })
    
    it('should be fine when transfer', async ()=>{
      await token.mint(accounts[0], 201);
      await token.transfer(accounts[1], 201);
      let balance1 = await token.balanceOf(accounts[1]);
      assert.equal(balance1, 201);
    })
    it('should be fine when switch between pasued', async ()=>{
      await token.pause();
      await token.unpause();
      await token.mint(accounts[0], 201);
      await token.transfer(accounts[1], 201);
      let balance1 = await token.balanceOf(accounts[1]);
      assert.equal(balance1, 201);
    })
  });

  describe('validating allowance updates to spender', function () {
    let preApproved;

    it('should start with zero', async function () {
      preApproved = await token.allowance(accounts[0], accounts[1]);
      assert.equal(preApproved, 0);
    });

    it('should increase by 50 then decrease by 10', async function () {
      await token.increaseApproval(accounts[1], 50);
      let postIncrease = await token.allowance(accounts[0], accounts[1]);
      preApproved.plus(50).should.be.bignumber.equal(postIncrease);
      await token.decreaseApproval(accounts[1], 10);
      let postDecrease = await token.allowance(accounts[0], accounts[1]);
      postIncrease.minus(10).should.be.bignumber.equal(postDecrease);
    });
  });

  it('should increase by 50 then set to 0 when decreasing by more than 50', async function () {
    await token.approve(accounts[1], 50);
    await token.decreaseApproval(accounts[1], 60);
    let postDecrease = await token.allowance(accounts[0], accounts[1]);
    postDecrease.should.be.bignumber.equal(0);
  });

  it('should throw an error when trying to transfer to 0x0', async function () {
    await token.mint(accounts[0], 100);
    try {
      await token.transfer(0x0, 100);
      assert.fail('should have thrown before');
    } catch (error) {
      assertRevert(error);
    }
  });

  it('should throw an error when trying to transferFrom to 0x0', async function () {
    await token.mint(accounts[0], 100);
    await token.approve(accounts[1], 100);
    try {
      await token.transferFrom(accounts[0], 0x0, 100, { from: accounts[1] });
      assert.fail('should have thrown before');
    } catch (error) {
      assertRevert(error);
    }
  });
});
