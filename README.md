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
    * supply `500,000,000 TBL`
* Functions
  * Contract Documentation and owner user guide
  * Self-Audit and Testing Report
  * Deployment Guideline and Checklist
  * A Complete Smart Contract Code:
    * Standard ERC20 Token Contract
    * Standard Contract Function, eg transferOwnership etc
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
    * Owner can call `setHardCap(...)` to set the maximum of the next token sale
    * Owner can call `setSalePeriod(...)` to set the maximum of the next token sale
    * Owner can call `addPrecommitment(...)` to add precommitment balances
    * Owner can call `setWalletAddress(...)` to update address where funds are collected
    * Owner can call `pause()` and `unpause()` to start or stop the crowdsale
* After Finalised
    * Participant can call the normal `transfer(...)`, `increaseApproval(...)`,`decreaseApproval(...)` ,`approve(...)` and `transferFrom(...)` to transfer tokens

