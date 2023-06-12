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
    
    var TimeStamp=0;

    await Oracle.setNewTick(3, ++TimeStamp);
    //await Oracle.setNewTick(10);
    //await Oracle.setNewTick(15);

    var Mult=1;
    var Delta=await Oracle.getCurrentTick();
    //Delta=-MAX_TICK;
    //Delta=MAX_TICK-7;
    for(var i=0;i<8;i++)
    {
        var Num=i*Mult+Delta;
        ++TimeStamp;
        //console.log(Num,":",TimeStamp);
        GasCost("setNewTick",await Oracle.setNewTick(Num, TimeStamp));
    }

    var Num=Delta;
    //GasCost("setRangeTick",await Oracle.setRangeTick(Num-5,Num+5,Num, ++TimeStamp));
    //GasCost("setRangeTick",await Oracle.setRangeTick(Num-4,Num+4,Num, ++TimeStamp));
    //GasCost("setRangeTick",await Oracle.setRangeTick(Num-3,Num+3,Num, ++TimeStamp));

    console.log("Current:",await Oracle.getCurrentTick());
    GasCost("setRangeTick",await Oracle.setRangeTick(8,12,10, ++TimeStamp));
    GasCost("setRangeTick",await Oracle.setRangeTick(9,11,10, ++TimeStamp));
    GasCost("setRangeTick",await Oracle.setRangeTick(10,12,11, ++TimeStamp));

    await ListGasCost();

    console.log("Current:",await Oracle.getCurrentTick());

    for(var i=0;i<=9;i++)
    {
        var Num=i*Mult+Delta;
        if(Num<=MAX_TICK)
            console.log(Num,":",await Oracle.getTickInfo(Num));
    }
    
    
    //setNewTick (10)[42700, 49556, 49606, 49606, 49606, 49606, 49606, 49606, 71456, 49556]
    //setNewTick (10)[41795, 48471, 48521, 48521, 48521, 48521, 48521, 48521, 70371, 48471]
    //setNewTick (10)[40375, 46432, 46482, 46482, 46482, 46482, 46482, 46482, 68332, 46432]
    //setNewTick (10)[40375, 46322, 46372, 46372, 46372, 46372, 46372, 46372, 68222, 46322]
    //setNewTick (10)[40375, 46216, 46266, 46266, 46266, 46266, 46266, 46266, 68116, 46216]
    //setNewTick (10)[40353, 46194, 46244, 46244, 46244, 46244, 46244, 46244, 68094, 46194] - не тестовый смарт
    //setNewTick (10)[40353, 45126, 45176, 45176, 45176, 45176, 45176, 45176, 67026, 45126] - unchecked
    //setNewTick (10)[40348, 45119, 45169, 45169, 45169, 45169, 45169, 45169, 67019, 45119]
    //setNewTick (8) [40283, 44942, 44992, 44992, 44992, 44992, 44992, 44992] - 2 setAt
    //setNewTick (8) [40014, 44684, 44734, 44734, 44734, 44734, 44734, 44734] - Pair
    

    //CurTick в RootBitmap
    //setNewTick (8) [40226, 45185, 45235, 45235, 45235, 45235, 45235, 45235]
    //setNewTick (8) [35414, 43170, 43220, 43220, 43220, 43220, 43220, 43220]
    //setRangeTick (3) [67077, 50174, 49745]

    //Lib
    //setNewTick (8) [35507, 43310, 43360, 43360, 43360, 43360, 43360, 43360]
    //setRangeTick (3) [67305, 50411, 49964]


}


main();
