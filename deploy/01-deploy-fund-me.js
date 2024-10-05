//require("../hardhat.config")
const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
require("dotenv").config();
// function deployFunc(){
//     console.log("hi")
// }
// module.exports.default = deployFunc
const chainId = 31337;
//const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,

        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("---------------------------------");
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
};
module.exports.tags = ["all", "fundme"];
