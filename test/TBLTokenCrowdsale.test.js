import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';
const assertRevert = require('./helpers/assertRevert');
const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const TBLTokenCrowdsale = artifacts.require('TBLTokenCrowdsale');
const MintableToken = artifacts.require('MintableToken');

contract('TBLTokenCrowdsale', function ([_, investor, wallet, purchaser,accounts]) {
  const rate = new BigNumber(1);
  const value = ether(1);

  const expectedTokenAmount = rate.mul(value);

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.startTime = latestTime() + duration.weeks(1);
    this.endTime = this.startTime + duration.weeks(1);
    this.afterEndTime = this.endTime + duration.seconds(1);

    this.TBLTokenCrowdsale = await TBLTokenCrowdsale.new(this.startTime, this.endTime, rate, wallet);

    this.token = MintableToken.at(await this.TBLTokenCrowdsale.token());
  });

  it('should be token owner', async function () {
    const owner = await this.token.owner();
    owner.should.equal(this.TBLTokenCrowdsale.address);
  });

  it('should be return correct value after update hardCap', async function () {
    await this.TBLTokenCrowdsale.setHardCap(100);
    const hardCap = await this.TBLTokenCrowdsale.hardCap.call();
    assert.equal(hardCap.valueOf(), 100);
  });
  it('should throw an error when trying to update hardCap to -ve', async function () {
    try {
        await this.TBLTokenCrowdsale.setHardCap(-1);
        assert.fail('should have thrown before');
      } catch (error) {
        assertRevert(error);
      }
  });
  it('should throw an error when trying to update hardCap to totalTokenSupply+1', async function () {
    const totalTokenSupply = await this.TBLTokenCrowdsale.totalTokenSupply.call();
    try {
      await this.TBLTokenCrowdsale.setHardCap(totalTokenSupply.plus(1).valueOf());
        assert.fail('should have thrown before');
      } catch (error) {
        assertRevert(error);
      }
  });
  it('should be return correct value after update rate', async function () {
    await this.TBLTokenCrowdsale.setRate(7000);
    const rate = await this.TBLTokenCrowdsale.rate.call();
    assert.equal(rate.valueOf(), 7000);
  });
  it('should throw an error when trying to update rate to 0', async function () {
    try {
      await this.TBLTokenCrowdsale.setRate(0);
        assert.fail('should have thrown before');
      } catch (error) {
        assertRevert(error);
      }
  });
  it('should be return correct value after update setSalePeriod', async function () {
    const tmpStartTime = latestTime() + duration.weeks(1);
    const tmpEndTime = latestTime() + duration.weeks(2);
    await this.TBLTokenCrowdsale.setSalePeriod(tmpStartTime, tmpEndTime);
    const startTime = await this.TBLTokenCrowdsale.startTime.call();
    assert.equal(startTime.valueOf(), tmpStartTime);
    const endTime = await this.TBLTokenCrowdsale.endTime.call();
    assert.equal(endTime.valueOf(), tmpEndTime);
  });
  it('should throw an error when trying to update setSalePeriod with startTime=0', async function () {
    try {
      await this.TBLTokenCrowdsale.setSalePeriod(0, latestTime() + duration.weeks(2));
      assert.fail('should have thrown before');
    } catch (error) {
      assertRevert(error);
    }
  });
  it('should throw an error when trying to update setSalePeriod with startTime>endtime', async function () {
    try {
      await this.TBLTokenCrowdsale.setSalePeriod(latestTime() + duration.weeks(3), latestTime() + duration.weeks(2));
      assert.fail('should have thrown before');
    } catch (error) {
      assertRevert(error);
    }
  });
  it('should be return correct value after run addPrecommitment', async function () {
    let soldTokens0 = await this.TBLTokenCrowdsale.soldTokens.call();
    let balance0 = await this.token.balanceOf(accounts[0]);
    assert.equal(balance0, 0);
    assert.equal(soldTokens0, 0);
    await this.TBLTokenCrowdsale.addPrecommitment(accounts[0], 100);
    let soldTokens1 = await this.TBLTokenCrowdsale.soldTokens.call();
    let balance1 = await this.token.balanceOf(accounts[0]);
    assert.equal(balance1, 100);
    assert.equal(soldTokens1, 100);
  });

  it('should be return correct value after run setWalletAddress', async function () {
    const wallet0 = await this.TBLTokenCrowdsale.wallet.call();
    assert.equal(wallet0,wallet);
    await this.TBLTokenCrowdsale.setWalletAddress(accounts);
    const wallet1 = await this.TBLTokenCrowdsale.wallet.call();
    assert.equal(wallet1,accounts);
  });

  describe('accepting payments with investor and pause', function () {

    it('should assign tokens to beneficiar', async function () {
      await this.TBLTokenCrowdsale.setRate(7000);
      await increaseTimeTo(this.startTime);
      await this.TBLTokenCrowdsale.send(value).should.be.fulfilled;
      await this.TBLTokenCrowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.fulfilled;
      let balance = await this.token.balanceOf(investor);
      balance.should.be.bignumber.equal(value*7000);
    });

    it('should throw an error when trying to buyToken after pause', async function () {
      try {
        await increaseTimeTo(this.startTime);
        await this.TBLTokenCrowdsale.pause();
        await this.TBLTokenCrowdsale.send(value).should.be.fulfilled;
        await this.TBLTokenCrowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.fulfilled;
        assert.fail('should have thrown before');
      } catch (error) {
        assertRevert(error);
      }
    });

  });

  it('should throw an error when trying to run finalized without any token', async function () {
    try {
      await this.TBLTokenCrowdsale.finalize().should.be.fulfilled;
      assert.fail('should have thrown before');
    } catch (error) {
      assertRevert(error);
    }
  });

});
