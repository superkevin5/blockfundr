require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
// const { ACCOUNT_PRIVATE_KEY,ALCHEMY_KEY } = process.env;
require('dotenv').config();

module.exports = {
  solidity: "0.8.4",
  // defaultNetwork: "rinkeby",
  paths: {
    artifacts: "./client/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: [
        {
          privateKey: process.env.walletPrivateKey,
          balance: "10000000000000000000000" // 10,000 ETH
        },
        {
          privateKey: "5c4dd7ff9102a8669be059b07d00f8e1da0b1f6ed7ef8d77fa64b4f0f173b03b",
          balance: "10000000000000000000000" // 10,000 ETH
        },
]
    },
    // rinkeby: {
    //   url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    //   accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
    // }
  },
};