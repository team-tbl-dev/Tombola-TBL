# TBL Token Sale Smart Contract

# Table of contents

* [Requirements](#requirements)
* [Operations On The Token Sale Contract](#operations-on-the-token sale-contract)
    * [Anytime](#anytime)
    * [Before Start Date (All stages)](#before-start-date)
    * [After Start Date And Before End Date Or Finalised (All stages)](#after-start-date-and-before-end-date-or-finalised)
    * [After Finalised (All stages)](#after-finalised)
    * [After 1 Year And 2 Years](#after-1-year-and-2-years)
* [Testing](#testing)
* [Deployment Checklist](#deployment-checklist)
* [Prerequisite](#prerequisite)
* [How to build](#how-to-build)
* [How to code](#how-to-code)
* [How to test](#how-to-test)
* [How to test on testnet and mainnet](#how-to-test-on-testnet-and-mainnet)

# Requirements

* Token Identifier
    * symbol `TBL`
    * name `Tombola`
    * decimals `18`
    * supply `90,000,000 TBL`
* Total of `90,000,000 TBL` tokens
  * Tranche 1 TBL Pre Token Sale
    * Hard cap of `7,000,000 TBL`
    * START_DATE = `TBC`
    * END_DATE = `TBC`
    * No minimum funding threshold (No soft cap)
  * Tranche 2 TBL Main Token Sale
    * START_DATE = `TBC`
    * END_DATE = `TBC`
    * No Soft Cap (We will use 3rd party escrow to enforce a minimum raise of 3,500,000 TBL)
    * Hard cap of `65,000,000 TBL`
    * Number of unsold token from pre-sale will not be transferred to this stage
  * Bounty Program Reward
    * `3,000,000 TBL` will be manually created via the addprecommitment function. It should not count towards the individual Tranche 1 or Tranche 2 caps
  * Locked Token (20%) - After ICO is completed, the smart contract will generate an additional `20%` of all tokens sold and time-lock it for the company at 1 and 2 years
    * `10%` locked for 1 year
    * `10%` locked for 2 years
* Other Requirements
  * Contract Documentation and owner user guide
  * Self-Audit and Testing Report
  * Deployment Guideline and Checklist
  * A Complete Smart Contract Code:
    * Standard ERC20 Token Contract
    * Standard Contract Function, eg transferOwnership etc
    * Standard KYC function
    * Able to set wallet address any time
    * Able to set price per token any time
    * Able to stop/start the token sale anytime
    * Start/stop token sale can also be control by Timestamp
    * Able to start token sale multiple times
    * A mintable token, TBL token only produce when someone contribute

# Operations On The Token Sale Contract

* Anytime
    * Owner can call `transferOwnership(...)` to allow the current owner to transfer control of the contract to a newOwner.
* After Start Date And Before End Date
    * Participants can send ETH to the `default () function` and receive tokens
    * Owner can call `finalise()` if soft cap reached or we are past the end date
* Before Finalised
    * Owner can call `setRate(...)` to set the exchange rate
    * Owner can call `setVipRate(...)` to set the vip exchange rate
    * Owner can call `setHardCap(...)` to set the maximum of the next token sale
    * Owner can call `setSalePeriod(...)` to set the maximum of the next token sale
    * Owner can call `addPrecommitment(...)` to add precommitment balances
    * Owner can call `setWalletAddress(...)` to update address where funds are collected
    * Owner can call `pause()` and `unpause()` to start or stop the crowdsale
* After Finalised
    * Participant can call the normal `transfer(...)`, `increaseApproval(...)`,`decreaseApproval(...)` ,`approve(...)` and `transferFrom(...)` to transfer tokens

# Prerequisite
* Node ≥ 7.6 confirm by entering node -v in command line
* npm ≥ 4 confirm by entering npm -v in command line
* Truffle ≥ 3.3 confirm by entering truffle -v in command line
* ganache-cli ≥ 4.0.0 confirm by entering ganache-cli -v in command line

# How to build:
* install `truffle`, `ganache-cli` (testrpc)
* `npm install`
* `truffle compile`

# How to test:
* `ganache-cli -m "abc"` (abc is the key generating seed)
* `npm run test`

# How to test on testnet and mainnet:
* `npm install truffle-flattener -g`
* `npm run build-gist`
* Copy the generated file, use remix.ethereum compile the code
