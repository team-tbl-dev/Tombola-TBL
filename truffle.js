require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("truffle-hdwallet-provider");

// Infura Key
var infura_apikey = "kRMWBPwUBGx6rArjwUa1";
// Ropsten Mnemoic
var mnemonic = "giant guard brass thunder number tuna sentence pave melody laugh weather agree uncover stereo vault into swing easy cloth cloth impulse turn pepper chronic";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    // Uncomment to the following section to use truffle for deployment
    // ropsten: {
    //   provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
    //   network_id: 3,
    //   gas: 4612388,
    //   gasPrice: 20000000000
    // },
    // live: {
    //   provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/"+infura_apikey),
    //   network_id: 1,
    //   gas: 4612388,
    //   gasPrice: 1000000000
    // }
  }



};
