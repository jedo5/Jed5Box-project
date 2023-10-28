var JedoBox = artifacts.require("JedoBox");

module.exports = function(deployer){
    deployer.deploy(JedoBox, "Jed5Box", "Jed5");
}