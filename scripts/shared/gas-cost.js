
//usage:
//const {GasCost,ListGasCost} = require("./shared/gas-cost.js");
//GasCost("claimReward",await Contract.claimReward(Id));
//await ListGasCost();

var MapTx={};
function GasCost(name,tx)
{
  var Arr=MapTx[name];
  if(!Arr)
  {
    Arr=[];
    MapTx[name]=Arr;
  }
  Arr.push(tx);
  return tx;
}

function ClearGasCost()
{
  MapTx={};
}


module.exports.GasCost=GasCost;
module.exports.ClearGasCost=ClearGasCost;
module.exports.ListGasCost=async function()
{
  for(var name in MapTx)
  {
    var ArrGas=[];
    var Arr=MapTx[name];
    for(var i=0;i<Arr.length;i++)
    {
      var tx=await Arr[i].wait();
      ArrGas.push(tx.gasUsed.toNumber());
    }
    if(Arr.length)
      console.log(name,ArrGas);
    //Arr.length=0;
  }
  ClearGasCost();
}