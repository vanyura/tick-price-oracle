function TickPriceOracle()
{
    const MAX_TICKS=2**24;
    var ArrTicks=new Uint32Array(MAX_TICKS);
    var TimeStamp=0;
    var CurTick=0;
    var WasInit;

    this.setNewTick=function(Tick)
    {
        TimeStamp++;

        if(!WasInit)
        {
            WasInit=1;
        }
        else
        {
            if(Tick != CurTick)
            {
                var delta=Math.sign(Tick-CurTick);
                //CurTick+=delta;
                while(CurTick!=Tick)
                {
                    ArrTicks[CurTick]=TimeStamp;
                    CurTick+=delta;
                }
            }
        }
        ArrTicks[Tick]=TimeStamp;
        CurTick=Tick;
    }

    this.getTickInfo=function(Tick)
    {
        return ArrTicks[Tick];
    }
    this.getCurrentTick=function()
    {
        return CurTick;
    }

     //test mode
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

     this.getLogTickArr0=function(from,count)
     {
         var Str="";
         for(var i=0;i<count;i++)
         {
             if(Str)
                 Str+=",";
             Str+=this.getTickInfo(from+i);
         }
         
         return Str;
     }

     this.logArr=function(from,count)
     {
         console.log("Arr0:  ",this.getLogTickArr(from,count));
     }
 }

module.exports.Model=TickPriceOracle;

