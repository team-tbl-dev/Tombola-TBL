var Migrations = artifacts.require("./Migrations.sol");

module.exports = async function(deployer) {

  deployer.deploy(Migrations);
};
