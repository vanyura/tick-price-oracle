
//todo - првератить в двусторонний 
function TickPriceOracle()
{
    var ArrTicks=new Uint32Array(1e6);
    var TimeStamp=0;
    var CurTick=0;
    var WasInit;

    var Bitmap=new Uint8Array(256);

    this.setNewTick=function(Tick)
    {
        TimeStamp++;

        if(!WasInit)
        {
            WasInit=1;
            CurTick=Tick;
        }
        else
        {
            ArrTicks[CurTick]=TimeStamp;//начало диапазона

            if(Tick != CurTick)
            {
                var delta = Math.sign(Tick-CurTick);
                //устанавливаем признаки изменения цены в тиках - бит 0
                CurTick+=delta;
                while(CurTick!=Tick)
                {
                    Bitmap[CurTick]=0;
                    CurTick+=delta;
                }
            }
        }
        
        Bitmap[Tick]=1;
        ArrTicks[Tick]=TimeStamp;//конец диапазона
    }

    this.getTickInfo=function(Tick)
    {
        if(Tick == CurTick)
            return ArrTicks[Tick];

        var delta = Math.sign(Tick-CurTick);
        var i=Tick;
        while(true)
        {
            if(Bitmap[i])
            {
                return ArrTicks[i];
            }
    
            i+=delta;

            //todo
            if(i<0)
                return ArrTicks[0];
            if(i>255)
                return ArrTicks[255];
        }
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
        console.log("ArrNew:",this.getLogTickArr(from,count));
        //console.log("Bits:  ",this.getStr(Bitmap,from,count));
    }
}

module.exports.Model=TickPriceOracle;

