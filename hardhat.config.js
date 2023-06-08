const fs = require('fs');
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
//require('hardhat-storage-layout');
require("dotenv").config();
require("hardhat-tracer");



task("web3", "Deploy smarts for web3", async (taskArgs, hre) => {
  const {CreateWeb3Smarts}=require("./scripts/deploy_smarts.js");
  await CreateWeb3Smarts();
});

var PivateKeyArr=[];
var extKeys="../../keys/test1.js";
if(fs.existsSync(extKeys))//Shard init values
  PivateKeyArr = require(extKeys).PivateKeyArr;



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  defaultNetwork: "localhost",
  //defaultNetwork: "bscTestnet",
  //defaultNetwork: "polygon",
  //defaultNetwork: "mumbai",


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
      /*
      ,{
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
      //*/
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
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      gasPrice: 120*1e9,
      accounts: PivateKeyArr
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      gasPrice: 2600000000,
      accounts: PivateKeyArr//{ mnemonic: "write invite clog length trash hip vault eagle bundle glare immense amount" }
    },

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
      accounts: PivateKeyArr,
    }
  },

  mocha: {
    timeout: 20000,
    reporter: 'eth-gas-reporter',
  },

  etherscan: {
    apiKey: {
      /*mainnet: process.env.ETHERSCANAPIKEY,
      ropsten: process.env.ETHERSCANAPIKEY,
      ftmTestnet: process.env.FTMSCANAPIKEY,
      opera: process.env.FTMSCANAPIKEY,
      okcTestnet: process.env.OKCTESTNETAPIKEY,
      okc: process.env.OKCAPIKEY,*/
      polygon: process.env.POLYGONSCANAPIKEY,
      bsc: process.env.BSCSCANAPIKEY,
      bscTestnet: process.env.BSCSCANAPIKEY,
    }, 
  },

  gasReporter: {
    enabled: true,
    //currency: 'CHF',
    //gasPrice: 21
  }  ,

  tracer: {
    enabled: true
  }  

};

/*
    localhost: {
      url: "http://127.0.0.1:8545",
      gasPrice: 20000000000,
      accountsBalance: "30000000000000000000000",
      hardfork: "merge",
      coinbase: "0x6103b3AF382A728c8107f3C2dB2D78672ed8978e",
    },
    hardhat: {
      gasPrice: 20000000000,
      mnemonic: "test test test test test test test test test test test junk",
      accountsBalance: "20000000000000000000000",
      hardfork: "merge",
      forking2:
      {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.KEY_ALCHEMY}`,
        blockNumber:35923200,
      },
      coinbase: "0x9e5c9e00212799f620093316Abd37Df7B4b03376",
      loggingEnabled: true,
      allowUnlimitedContractSize: true,
    },
*/