const Model0=require("./model0.js").Model;
const Model=require("./model.js").Model;

function TestOne(Oracle)
{
    var Mult=27;
    Oracle.setNewTick(0);
    //Oracle.setNewTick(257);
    //Oracle.setNewTick(259);
    //Oracle.setNewTick(254);
    //Oracle.setNewTick(259);

    Oracle.setNewTick(235);
    Oracle.setNewTick(512);
    Oracle.setNewTick(517);

    Oracle.setNewTick(5*Mult);
    Oracle.setNewTick(11*Mult);
    Oracle.setNewTick(15*Mult);
    
    
    Oracle.setNewTick(10*Mult);
    Oracle.setNewTick(14*Mult);
    Oracle.setNewTick(17*Mult);
    Oracle.setNewTick(17*Mult);
    Oracle.setNewTick(11*Mult);
    //Oracle.setNewTick(123000);
    Oracle.setNewTick(11*Mult);
    //Oracle.setNewTick(2*Mult);
    //*/

    Oracle.logArr(0,300);
    //if(Oracle.logBitmap)        Oracle.logBitmap();

    
    //return console.log("Info:",Oracle.getTickInfo(514));
    //return console.log("Info:",Oracle.getTickInfo(258));


    return Oracle.getLogTickArr(0,20*Mult);
    //return Oracle.getLogTickArr(0,520);
}

function TestAll()
{
    var Oracle0=new Model0();
    var Oracle=new Model();
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
