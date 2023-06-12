const {DeploySmart}=require("./deploy_smarts.js");
require("./shared/rand.js");
const {GasCost,ListGasCost} = require("./shared/gas-cost.js");



//const Model=require("./model/swap-0.js").New();

async function main()
{
  await RunGasBitmap();
  //await RunTestBitmap();
}


async function RunGasBitmap() 
{
  console.log("------------------------------RunGasBitmap");
  var Oracle=await DeploySmart("PriceOracleTest");

  /*
  await Oracle.setBit2(10);
  //await Oracle.setBit2(15);
  //await Oracle.setBit2(12);
  await Oracle.setBit2(35);
  await Oracle.setBit2(15e6);
  await Oracle.setBit2(16777215);
  
  //console.log(+await Oracle.findLower2(15e6+2000));
  console.log(await Oracle.findBigger2(15e6+1));
  console.log(await Oracle.findBigger2(10));
  return;
  //*/

  //return await Oracle.clearRange2(2,254);
  

  var Mult=1;
  for(var i=0;i<10;i++)
  {
    var Num=i*Mult;
    GasCost("setBit",await Oracle.setBit2(Num));

    var Val=await Oracle.findLower2(Num);
    console.log(Num,Val)

  }
  //setBit (10) [90172, 32872, 32872, 32872, 32872, 32872, 32872, 32872, 32872, 32872]

  await ListGasCost();

  return;

  for(var i=0;i<5;i++)
  {
    var Num=i*2*Mult;
    GasCost("clearRange",await Oracle.clearRange2(Num,Num+Mult-1));
  }

  //setBit (10) [90276, 32976, 32976, 32976, 32976, 32976, 32976, 32976, 32976, 32976]
  //clearRange (10) [37823, 37823, 37823, 37823, 37823, 37823, 37823, 37823, 37823, 35023]

  //2000
  //setBit (10) [90299, 32999, 32999, 32999, 32999, 32999, 32999, 32999, 32999, 32999]
  //clearRange (10) [34084, 34084, 34084, 34084, 34084, 34084, 34084, 34084, 34084, 31284]
  //200
  //setBit (10) [90276, 32976, 32976, 32976, 32976, 32976, 32976, 32976, 32976, 32976]
  //clearRange (10) [34131, 34131, 34131, 34131, 34131, 34131, 34131, 34131, 34131, 31331]

  //setBit (10) [90276, 32976, 32976, 32976, 32976, 32976, 32976, 32976, 32976, 32976]
  //clearRange (5) [34114, 34126, 34126, 34126, 34126]

  await ListGasCost();

}


async function RunTestBitmap() 
{
  console.log("------------------------------RunTestBitmap");

  var Oracle=await DeploySmart("PriceOracleTest");

  const BitmapLib=require("./model/bitmap.js").BitmapLib;
  const Bitmap=new BitmapLib();


  InitRandom();

  var Count=50;
  var MaxNum=10000;


  console.log("Test setBit");
  for(var i=0;i<Count;i++)
  {
      var Num=Random(MaxNum);

      Bitmap.setBit(Num);
      GasCost("setBit2",await Oracle.setBit2(Num));
      
      
  }
  Bitmap.logBitmap(2);


  await ListGasCost();

  console.log("Test checkfindLower");
  for(var i=0;i<Count;i++)
  {
      var Num=Random(MaxNum);
      var Val1=Bitmap.findLower(Num);
      var Val2=await Oracle.findLower2(Num)

      if(Val1 !== Val2)
      {
          console.error("Error findLower on "+i+" got="+Val2+", need="+Val1);
      }
  }
  
  console.log("Test checkfindBigger");
  for(var i=0;i<Count;i++)
  {
      var Num=Random(MaxNum);
      var Val1=Bitmap.findBigger(Num);
      var Val2=await Oracle.findBigger2(Num)

      if(Val1 !== Val2)
      {
          console.error("Error findBigger on "+i+" got="+Val2+", need="+Val1);
      }
  }

  Count=10;
  console.log("Test clearRange+setBit");
  for(var i=0;i<Count;i++)
  {
      var Num1=Random(MaxNum);
      var Num2=Random(MaxNum);

      var from=Num1<Num2?Num1:Num2;
      var to=Num1<Num2?Num2:Num1;

      //console.log("clearRange:",from,to)
      Bitmap.clearRange(from,to);
      GasCost("clearRange2",await Oracle.clearRange2(from,to));

      var Num=Random(MaxNum);
      Bitmap.setBit(Num);
      GasCost("setBit2",await Oracle.setBit2(Num));

  }
  Bitmap.logBitmap(2);

  await ListGasCost();
  //clearRange2 (10) [36452, 35328, 36450, 31560, 32939, 33245, 31861, 37369, 28798, 36422]
  //setBit2 (10) [53117, 36017, 53117, 33011, 36017, 36017, 53117, 36017, 53117, 36017]  

  console.log("Get array for cheks");
  var Arr=await Oracle.listBitmap(0,MaxNum);
  console.log("Check values");
  for(var i=0;i<MaxNum;i++)
  {
      var Val1=Bitmap.getBit(i);
      var Val2=Arr[i];//+await Oracle.getBit2(i)

      if(Val1 !== Val2)
      {
          console.error("Error setBit on "+i+" got="+Val2+", need="+Val1);
      }
  }


  

  

  console.log("------------------------------end");
}




main();
