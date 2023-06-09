const BitmapLib=require("./bitmap.js").BitmapLib;

function TickPriceOracle()
{
    const MAX_TICKS=2**24;
    
    const Bitmap=new BitmapLib();
    var ArrTicks=new Uint32Array(MAX_TICKS);

    var TimeStamp=0;
    var CurTick=0;


    this.setNewTick=function(Tick)
    {
        TimeStamp++;

        //we set the signs of price changes in ticks, i.e. bit 0
        if(Tick < CurTick)
        {
            Bitmap.clearRange(Tick+1,CurTick-1);
        }
        else
        if(Tick > CurTick)
        {
            Bitmap.clearRange(CurTick+1,Tick-1);
        }

        Bitmap.setBit(Tick);
        ArrTicks[CurTick]=TimeStamp;//beginning of the range
        ArrTicks[Tick]=TimeStamp;//end of range
        CurTick=Tick;
    }

    this.getTickInfo=function(Tick)
    {
        var find;
        if(Tick == CurTick)
            find=Tick;
        else
        if(Tick<CurTick)
        {
            //идем влево, ищем актуальный тик 
            find=Bitmap.findLower(Tick);
        }
        else
        {
            //идем вправо, ищем актуальный тик 
            find=Bitmap.findBigger(Tick);
        }

        if(find==-1)
            return 0;
        else
            return ArrTicks[find];

    }

    this.getCurrentTick=function()
    {
        return CurTick;
    }

    //test mode
    this.getStr=function(Arr,from,count)
    {
        var Str="";
        for(var i=0;i<count;i++)
        {
            if(Str)
                Str+=",";
            Str+=Arr[from+i];
        }
        
        return Str;
    }

    this.getLogTickArr=function(from,count)
    {
       var Str="";
       var PrevValue=-1;
       var PrevCount=0;
       for(var i=0;i<count;i++)
       {
           var Value=this.getTickInfo(from+i);
           if(PrevValue === Value)
           {
               PrevCount++;
           }
           else
           {
               if(PrevCount>0)
                   Str+=".."+PrevValue;

                   Str = Str + (Str?","+Value:Value);
               PrevCount=0;
           }
           PrevValue=Value;
        }
        
        if(PrevCount>0)
            Str+=".."+PrevValue;
        
        return Str;
    }

    this.logArr=function(from,count)
    {
        console.log("ArrNew:",this.getLogTickArr(from,count));
    }
    this.logBitmap=function(from,count)
    {
        Bitmap.logBitmap();
    }
}

module.exports.Model=TickPriceOracle;

