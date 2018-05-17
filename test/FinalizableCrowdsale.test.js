import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const FinalizableCrowdsale = artifacts.require('TBLTokenCrowdsale');
const MintableToken = artifacts.require('MintableToken');

contract('FinalizableCrowdsale', function ([_, owner, wallet, thirdparty, investor, purchaser]) {
  const rate = new BigNumber(1);
  const value = ether(1);

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.startTime = latestTime() + duration.weeks(1);
    this.endTime = this.startTime + duration.weeks(1);
    this.afterEndTime = this.endTime + duration.seconds(1);

    this.crowdsale = await FinalizableCrowdsale.new(this.startTime, this.endTime, rate, wallet, { from: owner });

    this.token = MintableToken.at(await this.crowdsale.token());
  });

  it('cannot be finalized before ending', async function () {
    await this.crowdsale.finalize({ from: owner }).should.be.rejectedWith(EVMRevert);
  });

  it('cannot be finalized by third party after ending', async function () {
    await increaseTimeTo(this.afterEndTime);
    await this.crowdsale.finalize({ from: thirdparty }).should.be.rejectedWith(EVMRevert);
  });

  it('can be finalized by owner after ending', async function () {
    await increaseTimeTo(this.afterEndTime);
    await this.crowdsale.finalize({ from: owner }).should.be.fulfilled;
  });

  it('owner wallet can take all the remaining tokens', async function () {
    // buy some token
    await increaseTimeTo(this.startTime);
    //await this.crowdsale.send(value).should.be.fulfilled;
    await this.crowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.fulfilled;
    let balance = await this.token.balanceOf(investor);
    balance.should.be.bignumber.equal(value*rate);

    // finaize it
    await increaseTimeTo(this.afterEndTime);
    await this.crowdsale.finalize({ from: owner }).should.be.fulfilled;
    let ownerBalance = await this.token.balanceOf(owner)
    const totalTokenSupply = await this.crowdsale.totalTokenSupply.call();
    ownerBalance.should.be.bignumber.equal(totalTokenSupply-balance);
  });

  it('cannot be finalized twice', async function () {
    await increaseTimeTo(this.afterEndTime);
    await this.crowdsale.finalize({ from: owner });
    await this.crowdsale.finalize({ from: owner }).should.be.rejectedWith(EVMRevert);
  });

  it('logs finalized', async function () {
    await increaseTimeTo(this.afterEndTime);
    const { logs } = await this.crowdsale.finalize({ from: owner });
    const event = logs.find(e => e.event === 'Finalized');
    should.exist(event);
  });
});
