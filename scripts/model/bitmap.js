function BitmapLib(DebugMode)
{
    const ROOT_LEVEL  = 2;
    const COUNT_TICKS = 256**(1+ROOT_LEVEL);
    const MAX_TICK    = COUNT_TICKS-1;
    const MAX_BITS    = COUNT_TICKS-1;

    var testBitmap=[];
    var ArrBitmaps=[];
    init();

    //------------------------------------------------------------------------------------------- inner

    function getZeroBitmap(Count)
    {
        var Arr=[];
        for(var i=0;i<Count;i++)
            Arr[i]=new Uint8Array(256);
        return Arr;
    }

    function init()
    {
        ArrBitmaps[0]=getZeroBitmap(256**2);
        ArrBitmaps[1]=getZeroBitmap(256);
        ArrBitmaps[2]=getZeroBitmap(1);//ROOT_LEVEL

        if(DebugMode)
            testBitmap=new Uint8Array(256**3);
    }

    function isZero(Bitmap)
    {
        for(var i=0; i<=255; i++)
        {
            if(Bitmap[i])
                return 0;
        }
        return 1;
    }
    function setZero(Bitmap)
    {
        for(var i=0; i<=255; i++)
        {
            Bitmap[i]=0;
        }
    }

    //Clear

    function clearRangeArr(from,to, level,index)
    {
        var Bitmap=ArrBitmaps[level][index];

        var BitFrom = (from>>(level*8)) & 0xFF;
        var BitTo   = (to>>(level*8)) & 0xFF;
        
        if(level==0)
        {
            for(var i=BitFrom; i<=BitTo; i++)
            {
                Bitmap[i]=0;
            }
        }
        else
        {
            for(var i=BitFrom; i<=BitTo; i++)
            {
                if(Bitmap[i]==0)
                    continue;
                if(i==BitFrom)
                {
                    var _to;
                    if(i==BitTo)
                    {
                        _to=to;
                    }
                    else
                    {
                        //мы в начале отрезка, но разряды разные
                        _to=MAX_BITS;
                    }

                    if(clearRangeArr(from,_to, level-1,(index<<8)+i))
                    {
                        Bitmap[i]=0;
                    }
                }
                else
                if(i==BitTo)
                {
                    //мы в конце отрезка, но разряды разные
                    if(clearRangeArr(0,to, level-1,(index<<8)+i))
                    {
                        Bitmap[i]=0;
                    }
                }
                else
                {
                    Bitmap[i]=0;
                }
            }
        }

        return isZero(Bitmap);
    }

    //Set

    function setBitArr(num, level,index, bZero)
    {
        var Bitmap=ArrBitmaps[level][index];
        var BitNum = (num>>(level*8)) & 0xFF;
        if(bZero)
        {
            setZero(Bitmap);
        }

        
        if(level==0)
        {
            Bitmap[BitNum] = 1;
        }
        else
        {
            setBitArr(num, level-1,(index<<8)+BitNum, !Bitmap[BitNum])
            Bitmap[BitNum]=1;
        }
    }

    //Get

    function getBitArr(num, level,index)
    {
        var Bitmap=ArrBitmaps[level][index];
        var BitNum = (num>>(level*8)) & 0xFF;
        
        if(level==0)
        {
            return Bitmap[BitNum];
        }
        else
        {
            if(!Bitmap[BitNum])
                return 0;

            return getBitArr(num, level-1,(index<<8)+BitNum)
        }
    }

    //Find

    function findLowerArr(num, level,index)
    {
        var Bitmap=ArrBitmaps[level][index];

        var BitNum = (num>>(level*8)) & 0xFF;
        
        if(level==0)
        {
            for(var i=BitNum; i>=0; i--)
            {
                if(Bitmap[i])
                    return i;
            }
        }
        else
        {
            for(var i=BitNum; i>=0; i--)
            {
                if(Bitmap[i])
                {
                    var find=findLowerArr(num, level-1,(index<<8)+i);
                    if(find != -1)
                        return (i<<(level*8)) + find;
                }

                num=MAX_BITS;
            }
        }

        return -1;//not found
    }

    
    function findBiggerArr(num, level,index)
    {
        var Bitmap=ArrBitmaps[level][index];

        var BitNum = (num>>(level*8)) & 0xFF;
        
        if(level==0)
        {
            for(var i=BitNum; i<=255; i++)
            {
                if(Bitmap[i])
                    return i;
            }
        }
        else
        {
            for(var i=BitNum; i<=255; i++)
            {
                if(Bitmap[i])
                {
                    var find=findBiggerArr(num, level-1,(index<<8)+i);
                    if(find != -1)
                        return (i<<(level*8)) + find;
                }

                num=0;
            }
        }

        return -1;//not found
    }


    //------------------------------------------------------------------------------------------- public

    //обнуляем биты в диапазоне, включая концы отрезка
    this.clearRange = function(from,to)
    {
        clearRangeArr(from,to,ROOT_LEVEL,0);

        if(DebugMode)
        for(var i=from; i<=to; i++)
            testBitmap[i]=0;
    }

    this.setBit = function(num)
    {
        setBitArr(num,ROOT_LEVEL,0, 0);

        if(DebugMode)
            testBitmap[num]=1;
    }

    this.getBit = function(num)
    {
        return getBitArr(num,ROOT_LEVEL,0);
    }

    this.findLower = function(num)
    {
        
        return findLowerArr(num,ROOT_LEVEL,0);
    }

    this.findBigger = function(num)
    {
        return findBiggerArr(num,ROOT_LEVEL,0);
    }

    //------------------------------------------------------------------------------------------- test mode
    this.findLowerTest = function(num)
    {
        for(var i=num; i>=0; i--)
            if(testBitmap[i])
                return i;

        return -1;
    }
    this.findBiggerTest = function(num)
    {
        for(var i=num; i<=MAX_TICK; i++)
            if(testBitmap[i])
                return i;

        return -1;
    }

    this.checkfindLower = function(num)
    {
        if(!DebugMode)
            throw "Not in DebugMode";
        var Val1=this.findLowerTest(num);
        var Val2=this.findLower(num);
        if(Val1!==Val2)
        {
            throw ("Error checkfindLower on "+num+" got="+Val2+", need="+Val1);
        }
        if(Val2!=-1 && Val2>num)
            throw ("Error checkfindLower on "+num+" got="+Val2+", need<"+num);
    }
    this.checkfindBigger= function(num)
    {
        if(!DebugMode)
            throw "Not in DebugMode";
        var Val1=this.findBiggerTest(num);
        var Val2=this.findBigger(num);
        if(Val1!==Val2)
        {
            throw ("Error checkfindBigger on "+num+" got="+Val2+", need="+Val1);
        }
        if(Val2!=-1 && Val2<num)
            throw ("Error checkfindBigger on "+num+" got="+Val2+", need>"+num+"  Val1="+Val1);
    }

    this.checkBitmap=function(count)
    {
        if(!DebugMode)
            throw "Not in DebugMode";

        for(var i=0; i<count; i++)
        {
            var Val1=testBitmap[i];
            var Val2=this.getBit(i);
            if(Val1!==Val2)
            {
                console.error("Error on ",i," got="+Val2+", need="+Val1);
                break;
            }
        }
        console.log("Check OK, count=",count);
    }


    function getStr(Arr,from,count)
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

    function GetBitmapStr(Bitmap,Count)
    {
        Str="";
        for(var i=0;i<Count;i++)
        {
            if(Str)
                Str+=" - ";
            Str+=getStr(Bitmap[i],0,10);
        }
        return Str;
    }
    this.logBitmap=function(Count1)
    {
        var Bitmap0=ArrBitmaps[0];
        var Bitmap1=ArrBitmaps[1];
        var Bitmap2=ArrBitmaps[2];//root

        console.log("Bits0: ",getStr(Bitmap0[0],0,10),"-",getStr(Bitmap0[1],0,10),"-",getStr(Bitmap0[2],0,10),"-",getStr(Bitmap0[3],0,10));
        console.log("Bits1: ",GetBitmapStr(Bitmap1,Count1?Count1:2));// getStr(Bitmap1[0],0,10),"-",getStr(Bitmap1[1],0,10));
        console.log("Bits2: ",getStr(Bitmap2[0],0,5));
    }

}

module.exports.BitmapLib=BitmapLib;
