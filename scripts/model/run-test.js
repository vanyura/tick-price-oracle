const Model0=require("./model0.js").Model;
//const Model1=require("./model1.js").Model;
const Model3=require("./model3.js").Model;

var nRand=0;
global.InitRandom=function(set)
{
    if(set===undefined)
        set=123;
    nRand=+set;
}

global.Random=function(max)
{
    nRand=(nRand*1664525+1013904223) >>> 0;
    return nRand % max;
}
InitRandom();


function TestOne(Oracle)
{
    var MaxNum=1000;

    Oracle.setNewTick(2);
    Oracle.setNewTick(15);
    Oracle.setNewTick(4);
    Oracle.setNewTick(8);
    Oracle.setNewTick(16);
    Oracle.setNewTick(16);
    Oracle.setNewTick(10);

    //console.log("Info:",Oracle.getTickInfo(10));
    Oracle.logArr(0,MaxNum, true);
    return Oracle.getLogTickArr(0,MaxNum);
}

function TestOne2(Oracle)
{
    var MaxNum=256**3;

    var Mult=50;
    
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
   
    Oracle.setNewTick(11*Mult);
    Oracle.setNewTick(123000);
    Oracle.setNewTick(11*Mult);
    Oracle.setNewTick(2*Mult);
    


    Oracle.logArr(0,MaxNum);

    return Oracle.getLogTickArr(0,MaxNum);

}

function TestOneRnd(Oracle)
{
    InitRandom();
    var MaxNum=256**3;
    var MaxRND=MaxNum;

    var Count=1000;
    console.log("Test Rnd");
    for(var i=0;i<Count;i++)
    {
        var Num=Random(MaxRND);
        Oracle.setNewTick(Num);
    }

    Oracle.logArr(0,MaxNum);
    return Oracle.getLogTickArr(0,MaxNum);
}

function TestOracle()
{
    var Oracle0=new Model0();
    var Oracle=new Model3();

    var StrArr=TestOne(Oracle);
    var StrArr0=TestOne(Oracle0);

    if(Oracle.StatFind)
        console.log("StatFind:",Oracle.StatFind, Oracle.StatFindRead, "Avg:",Oracle.StatFindRead/Oracle.StatFind);

    if(StrArr0!==StrArr)
    {
        console.error("Error:")
        console.log("Model0:",StrArr0);
        console.log("Model :",StrArr);
        //throw "Error model!";
    }
    console.log("End");
    
}

function TestBitmap()
{
    const BitmapLib=require("./bitmap.js").BitmapLib;
    const Bitmap=new BitmapLib(1);
    Bitmap.setBit(3);


    Bitmap.setBit(1);
    Bitmap.setBit(7);


    Bitmap.setBit(256);
    Bitmap.setBit(256+1);
    Bitmap.setBit(256*3);
    Bitmap.setBit(256*3+1);

    Bitmap.setBit(256*256);

    Bitmap.clearRange(7+0,256*256);

    Bitmap.setBit(256+4);

    Bitmap.logBitmap();
    Bitmap.checkBitmap(256**3);

    Bitmap.checkfindLower(3); 
    console.log(Bitmap.findLower(256));
    console.log(Bitmap.findBigger(256));
    Bitmap.checkfindBigger(256); 


}

function TestBitmapRandom()
{
    const BitmapLib=require("./bitmap.js").BitmapLib;
    const Bitmap=new BitmapLib(1);

    var Count=1e7;
    var MaxNum=256**3;
    

    console.log("Test setBit 1");
    for(var i=0;i<Count;i++)
    {
        var Num=Random(MaxNum);
        Bitmap.setBit(Num);
    }
    Bitmap.logBitmap(2);
    Bitmap.checkBitmap(MaxNum);

    Count=10000;
    console.log("Test checkfindLower 1");
    for(var i=0;i<Count;i++)
    {
        var Num=Random(MaxNum);
        Bitmap.checkfindLower(Num);
    }
    console.log("Test checkfindBigger 1");
    for(var i=0;i<Count;i++)
    {
        var Num=Random(MaxNum);
        Bitmap.checkfindBigger(Num);
    }

    Count=1000;
    console.log("Test clearRange");
    for(var i=0;i<Count;i++)
    {
        var Num1=Random(MaxNum);
        var Num2=Random(MaxNum);
        Bitmap.clearRange(Num1<Num2?Num1:Num2,Num1<Num2?Num2:Num1);
    }

    //Bitmap.setBit(256*256);

    Bitmap.logBitmap(2);
    Bitmap.checkBitmap(MaxNum);


    
    console.log("Test setBit 2");
    for(var i=0;i<Count;i++)
    {
        var Num=Random(MaxNum);
        Bitmap.setBit(Num);
    }
    Bitmap.logBitmap(2);
    Bitmap.checkBitmap(MaxNum);

    console.log("Test checkfindLower 2");
    for(var i=0;i<Count;i++)
    {
        var Num=Random(MaxNum);
        Bitmap.checkfindLower(Num);
    }
    console.log("Test checkfindBigger 2");
    for(var i=0;i<Count;i++)
    {
        var Num=Random(MaxNum);
        Bitmap.checkfindBigger(Num);
    }
    
    console.log("End");

}

//TestBitmap();
TestBitmapRandom();
//TestOracle();
