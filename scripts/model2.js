function TickPriceOracle()
{
    const MAX_TICKS=2**24;
    var ArrTicks=new Uint32Array(MAX_TICKS);
    var TimeStamp=0;
    var CurTick=0;
    var WasInit;


    var Bitmap0;//1;
    var Bitmap1=[];//256
    var Bitmap2=[];//256*256

    this.StatSet=0;
    this.StatFind=0;
    this.StatFindRead=0;
    
    
    
    //var Bitmap=new Uint8Array(256);

    Init();
    function setZeroBitmap(Arr,Count)
    {
        for(var i=0;i<Count;i++)
            Arr[i]=new Uint8Array(256);
    }

    function Init()
    {
        Bitmap0=new Uint8Array(256);
        setZeroBitmap(Bitmap1,256);
        setZeroBitmap(Bitmap2,256*256);
    }

   

    function setZeroBits(Bitmap, from, to)
    {
        //var from=from0<to0?from0:to0;
        //var to=from0<to0?to0:from0;

        //обнуляем биты в диапазоне,но не включая концы отрезка
        for(var i=from+1;i<to;i++)
        {
            Bitmap[i]=0;
        }
    }

    this.setNewTick=function(Tick)
    {
        TimeStamp++;

        

        var Numerator0 = Tick>>16;
        var Numerator1 = (Tick>>8)&0xFF;
        var Numerator2 = Tick&0xFF;
        var NumBitmap2 = (Numerator0<<8)+Numerator1;

        var CurNumerator0 = CurTick>>16;
        var CurNumerator1 = (CurTick>>8)&0xFF;
        var CurNumerator2 = CurTick&0xFF;
        var CurNumBitmap2 = (CurNumerator0<<8)+CurNumerator1;
        

        //console.log("Set:  ",Numerator0,Numerator1,Numerator2)

        if(!WasInit)
        {
            WasInit=1;
        }
        else
        {
            ArrTicks[CurTick]=TimeStamp;//начало диапазона

            //todo сделать очистку диапазона tick1 - tick2
            
            if(Tick < CurTick)
            {
                //устанавливаем признаки изменения цены в тиках - бит 0
                setZeroBits(Bitmap2[NumBitmap2], Numerator2, CurNumerator2);
                setZeroBits(Bitmap1[Numerator0], Numerator1, CurNumerator1);
                setZeroBits(Bitmap0,             Numerator0, CurNumerator0);
            }
            else
            if(Tick > CurTick)
            {
                //устанавливаем признаки изменения цены в тиках - бит 0
                setZeroBits(Bitmap2[NumBitmap2], CurNumerator2, Numerator2);
                setZeroBits(Bitmap1[Numerator0], CurNumerator1, Numerator1);
                setZeroBits(Bitmap0,             CurNumerator0, Numerator0);
            }
        }
        
        Bitmap2[NumBitmap2][Numerator2]=1;
        Bitmap1[Numerator0][Numerator1]=1;
        Bitmap0[Numerator0]=1;


        ArrTicks[Tick]=TimeStamp;//конец диапазона
        CurTick=Tick;
    }

    this.getTickInfo=function(Tick)
    {
        if(Tick == CurTick)
            return ArrTicks[Tick];

        var Numerator0 = Tick>>16;
        var Numerator1 = (Tick>>8)&0xFF;
        var Numerator2 = Tick&0xFF;
        //console.log("Find: ",Numerator0,Numerator1,Numerator2)

        this.StatFind++;
        
        if(Tick<CurTick)
        {
            //идем влево, ищем актуальный тик 
            this.StatFindRead++;//Bitmap0
            for(var i0=Numerator0; i0>=0; i0--)
            {
                if(Bitmap0[i0])
                {
                    this.StatFindRead++;//Bitmap1
                    for(var i1=Numerator1; i1>=0; i1--)
                    {
                        if(Bitmap1[i0][i1])
                        {
                            this.StatFindRead++;//Bitmap2
                            for(var i2=Numerator2; i2>=0; i2--)
                            {
                                if(Bitmap2[(i0<<8)+i1][i2])
                                {
                                    this.StatFindRead++;//ArrTicks

                                    var TickNum=(i0<<16) + (i1<<8) + i2;
                                    return ArrTicks[TickNum];
                                }
                            }
                        }

                        Numerator2=255;
                    }
                }

                Numerator1=255;
            }

            this.StatFindRead++;//ArrTicks
            return ArrTicks[0];
        }
        else
        {
            //return "?"
            //идем вправо, ищем актуальный тик 
            this.StatFindRead++;//Bitmap0
            for(var i0=Numerator0; i0<=255; i0++)
            {
                if(Bitmap0[i0])
                {
                    this.StatFindRead++;//Bitmap1
                    for(var i1=Numerator1; i1<=255; i1++)
                    {
                        if(Bitmap1[i0][i1])
                        {
                            this.StatFindRead++;//Bitmap2
                            for(var i2=Numerator2; i2<=255; i2++)
                            {
                                if(Bitmap2[(i0<<8)+i1][i2])
                                {
                                    this.StatFindRead++;//ArrTicks

                                    var TickNum=(i0<<16) + (i1<<8) + i2;
                                    return ArrTicks[TickNum];
                                }
                            }
                        }

                        Numerator2=0;
                    }
                }

                Numerator1=0;
            }

            this.StatFindRead++;//ArrTicks
            return ArrTicks[MAX_TICKS-1];

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
    }
    this.logBitmap=function(from,count)
    {
        console.log("Bits2: ",this.getStr(Bitmap2[0],250,6),this.getStr(Bitmap2[1],0,6),this.getStr(Bitmap2[2],0,10));
        console.log("Bits1: ",this.getStr(Bitmap1[0],0,6));
        console.log("Bits0: ",this.getStr(Bitmap0,0,6));
    }
}

module.exports.Model=TickPriceOracle;

