pragma solidity ^0.4.19;

import "./TBLToken.sol";
import "./FinalizableCrowdsale.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";


contract TBLTokenCrowdsale is FinalizableCrowdsale, Pausable {

    address public restricted;
    uint256 public soldTokens;
    uint256 public hardCap;

    uint256 public totalTokenSupply;

    // constructor
    function TBLTokenCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet) public 
        Crowdsale(_startTime, _endTime, _rate, _wallet) {
        
        // total token supply for sales
        totalTokenSupply = 500000000 * 10 ** 18;

        // hardCap for pre-sale
        hardCap = 250000000 * 10 ** 18;

        soldTokens = 0;

        restricted = msg.sender;
    }

    // update hardCap for sale
    function setHardCap(uint256 _hardCap) public onlyOwner {
        require(!isFinalized);
        require(_hardCap >= 0 && _hardCap <= totalTokenSupply);

        hardCap = _hardCap;
    }

    // update address where funds are collected
    function setWalletAddress(address _wallet) public onlyOwner {
        require(!isFinalized);

        wallet = _wallet;
    }

    // update token units a buyer gets per wei
    function setRate(uint256 _rate) public onlyOwner {
        require(!isFinalized);
        require(_rate > 0);

        rate = _rate;
    }

    // update startTime, endTime for post-sales
    function setSalePeriod(uint256 _startTime, uint256 _endTime) public onlyOwner {
        require(!isFinalized);
        require(_startTime > 0);
        require(_endTime > _startTime);

        startTime = _startTime;
        endTime = _endTime;
    }

    // fallback function can be used to buy tokens
    function () external payable {
        buyTokens(msg.sender);
    }

    // overriding Crowdsale#buyTokens to add pausable sales and vip logic
    function buyTokens(address beneficiary) public whenNotPaused payable {
        require(beneficiary != address(0));
        require(!isFinalized);

        uint256 weiAmount = msg.value;
        uint tokens;

        tokens = weiAmount.mul(rate);
        
        require(validPurchase(tokens));
        soldTokens = soldTokens.add(tokens);

        // update state
        weiRaised = weiRaised.add(weiAmount);

        token.mint(beneficiary, tokens);
        TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

        forwardFunds();
    }

    // overriding Crowdsale#validPurchase to add capped sale logic
    // @return true if the transaction can buy tokens
    function validPurchase(uint256 tokens) internal view returns (bool) {
        bool withinPeriod = now >= startTime && now <= endTime;
        bool withinCap = soldTokens.add(tokens) <= hardCap;
        bool withinTotalSupply = soldTokens.add(tokens) <= totalTokenSupply;
        bool nonZeroPurchase = msg.value != 0;
        return withinPeriod && nonZeroPurchase && withinCap && withinTotalSupply;
    }

    // overriding FinalizableCrowdsale#finalization to add 20% of sold token for owner
    function finalization() internal {
        // mint locked token to Crowdsale contract
        uint256 restrictedTokens = totalTokenSupply.sub(soldTokens);
        token.mint(this, restrictedTokens);

        // transfer the locked token to restricted
        token.transfer(restricted, restrictedTokens);

        // stop minting new tokens
        token.finishMinting();

        // transfer the contract ownership to TBLTokenCrowdsale.owner
        token.transferOwnership(owner);

    }

    function addPrecommitment(address participant, uint balance) onlyOwner public {
        require(!isFinalized);
        require(balance > 0);
        // Check if the total token supply will be exceeded
        require(soldTokens.add(balance) <= totalTokenSupply);

        soldTokens = soldTokens.add(balance);
        token.mint(participant, balance);
    }

}
