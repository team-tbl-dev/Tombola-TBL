# TBL Token - Testing

# Table of contents

* [Requirements](#requirements)
* [Executing The Tests](#executing-the-tests)
* [The Tests](#the-tests)

# Requirements

* The tests works on OS/X. Should work in Linux. May work in Windows with Cygwin
* truffle4.0.0
* Solc 0.4.18

# Executing The Tests

* Run `truffle test` in dev mode

# The Tests

* Test 1 Before The Crowdsale
    * Test 1.1 Deploy Token Contract
    * Test 1.2 Add Precommitments, Change The token Rate From 343,734 To 1,000,000 And Change Wallet
* Test 2 During The Crowdsale
    * Test 2.1 Buy tokens
* Test 3 Cannot Move Tokens Without Finalising
    * `transfer(...)`, `approve(...)` and `transferFrom(...)`
* Test 4 Finalising
* Test 5 KYC Verify
* Test 6 Move Tokens After Finalising
* Test 7 Unlock Tokens 1
    * Test 7.1 Unlock 1Y Locked Token
    * Test 7.2 Unsuccessfully Unlock 2Y Locked Token
* Test 8 Unlock Tokens 2
    * Test 8.1 Successfully Unlock 2Y Locked Token
    * Test 8.2 Successfully Unlock All Tokens including Tranche 1 remaining + Tranche 2
