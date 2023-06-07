const Model0=require("./model0.js").Model;
const Model=require("./model.js").Model;

function TestOne(Oracle)
{
    Oracle.setNewTick(3);
    Oracle.setNewTick(5);
    Oracle.setNewTick(15);
    
    Oracle.setNewTick(10);
    Oracle.setNewTick(14);
    Oracle.setNewTick(17);
    Oracle.setNewTick(17);
    Oracle.setNewTick(2);

    Oracle.logArr(0,20);
    

    //console.log("Info:",Oracle.getTickInfo(10));


    return Oracle.getLogTickArr(0,20);
}

function TestAll()
{
    var StrArr0=TestOne(new Model0());
    var StrArr=TestOne(new Model());

    if(StrArr0!==StrArr)
    {
        console.error("Error:")
        console.log("Model0:",StrArr0);
        console.log("Model :",StrArr);
        //throw "Error model!";
    }
    
}


TestAll();
