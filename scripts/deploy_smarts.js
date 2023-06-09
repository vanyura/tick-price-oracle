const hre = require("hardhat");
require("./shared/rand.js");

async function DeploySmart(Name, Param1) 
{
  console.log("Start deploy", Name, Param1 ? "with params length=" + (arguments.length - 1) : "");

  var ArrArgs = [];
  for (var i = 1; i < arguments.length; i++) {
    ArrArgs.push(arguments[i]);
  }

  var ContractTx = await hre.ethers.deployContract(Name, ArrArgs);//signerOrOptions


  //await ContractTx.deployed();
  console.log(`Deployed ${Name} to ${ContractTx.address}`);

  ContractTx._name_=Name;

  return ContractTx;
}


module.exports.DeploySmart=DeploySmart;
