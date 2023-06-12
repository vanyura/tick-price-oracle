const {DeploySmart}=require("./deploy_smarts.js");
require("./shared/rand.js");
const {GasCost,ListGasCost} = require("./shared/gas-cost.js");



//const Model=require("./model/swap-0.js").New();

async function main()
{
  await RunTestOracle();
}

async function RunTestOracle()
{
    console.log("------------------------------RunTestOracle");
    var Oracle=await DeploySmart("PriceOracle");
    var MAX_TICK;
    console.log("MAX_TICK:",MAX_TICK=await Oracle.MAX_TICK());
    

    await Oracle.setNewTick(3);
    //await Oracle.setNewTick(10);
    //await Oracle.setNewTick(15);

    var Mult=1;
    var Delta=await Oracle.getCurrentTick();
    //Delta=-MAX_TICK;
    //Delta=MAX_TICK-10;
    for(var i=0;i<8;i++)
    {
        var Num=i*Mult+Delta;
        GasCost("setNewTick",await Oracle.setNewTick(Num));
        //GasCost("setNewTick",await Oracle.setNewTick(i*Mult));
    }
    await ListGasCost();

    console.log("Current:",await Oracle.getCurrentTick());

    for(var i=0;i<=10;i++)
    {
        var Num=i*Mult+Delta;
        console.log(await Oracle.getTickInfo(Num));
    }
    
    
    //setNewTick (10) [42700, 49556, 49606, 49606, 49606, 49606, 49606, 49606, 71456, 49556]
    //setNewTick (10) [41795, 48471, 48521, 48521, 48521, 48521, 48521, 48521, 70371, 48471]
    //setNewTick (10) [40375, 46432, 46482, 46482, 46482, 46482, 46482, 46482, 68332, 46432]
    //setNewTick (10) [40375, 46322, 46372, 46372, 46372, 46372, 46372, 46372, 68222, 46322]
    //setNewTick (10) [40375, 46216, 46266, 46266, 46266, 46266, 46266, 46266, 68116, 46216]
    //setNewTick (10) [40353, 46194, 46244, 46244, 46244, 46244, 46244, 46244, 68094, 46194] - не тестовый смарт
    //setNewTick (10) [40353, 45126, 45176, 45176, 45176, 45176, 45176, 45176, 67026, 45126] - unchecked
    //setNewTick (10) [40348, 45119, 45169, 45169, 45169, 45169, 45169, 45169, 67019, 45119]
}


main();