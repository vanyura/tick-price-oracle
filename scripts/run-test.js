const Model0=require("./model0.js").Model;
const Model1=require("./model1.js").Model;
const Model2=require("./model2.js").Model;

function TestOne(Oracle)
{
    Oracle.setNewTick(5);
    //Oracle.setNewTick(20);
    Oracle.setNewTick(15);
    Oracle.setNewTick(0);
    Oracle.setNewTick(4);
    Oracle.setNewTick(8);
    Oracle.setNewTick(16);
    Oracle.setNewTick(10);

    //console.log("Info:",Oracle.getTickInfo(10));
    Oracle.logArr(0,21, true);
    return Oracle.getLogTickArr(0,21, true);
}

function TestOne2(Oracle)
{
    /*
    Oracle.setNewTick(0);
    Oracle.setNewTick(512+257);
    Oracle.setNewTick(512+259);
    Oracle.setNewTick(512+254-256);
    Oracle.setNewTick(512+259);
    return Oracle.getLogTickArr(0,1000);
    /*/    

    //var Mult=50;
    var Mult=1;
    Oracle.setNewTick(1);
    Oracle.setNewTick(235);
    Oracle.setNewTick(512);
    Oracle.setNewTick(517);

    Oracle.setNewTick(5*Mult);
    Oracle.setNewTick(11*Mult);
    Oracle.setNewTick(15*Mult);
    
    
    Oracle.setNewTick(10*Mult);
    Oracle.setNewTick(14*Mult);
    Oracle.setNewTick(17*Mult);
    //Oracle.setNewTick(17*Mult);
    Oracle.setNewTick(11*Mult);
    //Oracle.setNewTick(123000);
    //Oracle.setNewTick(11*Mult);
    //Oracle.setNewTick(2*Mult);
    //*/

    //Oracle.logArr(0,300);
    Oracle.logArr(0,21);
    //if(Oracle.logBitmap)        Oracle.logBitmap();

    
    //return console.log("Info:",Oracle.getTickInfo(514));
    //return console.log("Info:",Oracle.getTickInfo(258));


    //return Oracle.getLogTickArr(0,20*Mult);
    return Oracle.getLogTickArr(0,21);
}

function TestAll()
{
    var Oracle0=new Model0();
    //var Oracle=new Model2();
    var Oracle=new Model1();

    var StrArr0=TestOne(Oracle0);
    var StrArr=TestOne(Oracle);

    if(Oracle.StatFind)
        console.log("StatFind:",Oracle.StatFind, Oracle.StatFindRead, "Avg:",Oracle.StatFindRead/Oracle.StatFind);

    if(StrArr0!==StrArr)
    {
        console.error("Error:")
        console.log("Model0:",StrArr0);
        console.log("Model :",StrArr);
        //throw "Error model!";
    }
    
}


TestAll();
