﻿function TickPriceOracle()
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
     this.getLogTickArr=function(from,count,bAll)
     {
         var Str="";
         for(var i=0;i<count;i++)
         {
             if(Str)
                 Str+=",";
             if(bAll || i<=CurTick)
                 Str+=this.getTickInfo(from+i);
             else
                 Str+="!";
         }
         
         return Str;
     }
     this.logArr=function(from,count,bAll)
     {
         console.log("Arr0:  ",this.getLogTickArr(from,count,bAll));
     }
 }

module.exports.Model=TickPriceOracle;

