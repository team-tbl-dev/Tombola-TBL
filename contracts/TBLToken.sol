pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "zeppelin-solidity/contracts/token/PausableToken.sol";


contract TBLToken is MintableToken, PausableToken {
    string public name = "Tombola";
    string public symbol = "TBL";
    uint256 public decimals = 18;
}
