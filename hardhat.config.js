require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
//require("hardhat-tracer");



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  defaultNetwork: "localhost",
  //defaultNetwork: "bscTestnet",

  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  },

  
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gasPrice: 20000000000,
      hardfork: "merge",
    },
    hardhat: {
      allowUnlimitedContractSize: true,
          //hardfork: "london",
          //hardfork: "merge",
          chainId: 1,
          forking: {
              url: "https://bsc.node.orionprotocol.io/rpc",
              // blockNumber: 15659907,
              enabled: false
          }

    },


    /*
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [`0x${process.env.TESTNET_DEPLOYER}`,`0x${process.env.TESTNET_USER1}`],
      chainId: 97,
      gasPrice: 20000000000,
    },
    mainnetb: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [`0x${process.env.BSCNET_DEPLOYER}`,`0x${process.env.BSCNET_USER1}`],
    }
    //*/
  },
 
  mocha: {
    timeout: 20000,
    reporter: 'eth-gas-reporter',
  },

  etherscan: {
    apiKey: {
      bsc: process.env.BSCSCANAPIKEY,
      bscTestnet: process.env.BSCSCANAPIKEY,
    }, 
  },

  gasReporter: {
    enabled: true,
  }  ,

  tracer: {
    enabled: true
  }  

};
