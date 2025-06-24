const LandRecord = artifacts.require("LandRecord");

module.exports = function(deployer) {
  deployer.deploy(LandRecord);
};