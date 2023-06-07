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
        }
        else
        {
            if(Tick < CurTick)
            {
                //идем влево, обнуляем все тики справа
                for(var i=Tick+1;i<256;i++)
                {
                    Bitmap[i]=0;
                }
            }
            else
            {
                //идем вправо
                ArrTicks[CurTick]=TimeStamp;//начало диапазона
            }
        }
        
        Bitmap[Tick]=1;

        ArrTicks[Tick]=TimeStamp;//конец диапазона
        CurTick=Tick;
    }

    this.getTickInfo=function(Tick)
    {
        //идем влево, ищем актуальный тик 
        for(var i=Tick;i>=0;i--)
        {
            if(Bitmap[i])
                return ArrTicks[i];
        }
        return ArrTicks[0];//todo
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
            if(i<=CurTick)
                Str+=this.getTickInfo(from+i);
            else
                Str+="!";

        }
        
        return Str;
    }
    this.logArr=function(from,count)
    {
        console.log("ArrNew:",this.getLogTickArr(from,count));
        //console.log("Bits: ",this.getStr(Bitmap,from,count));
    }
}

module.exports.Model=TickPriceOracle;

