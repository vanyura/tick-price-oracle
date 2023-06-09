// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import './BitMath.sol';


import "hardhat/console.sol";

contract BitmapLib
{
    uint8 constant  ROOT_LEVEL = 2;
    uint24 constant MAX_BITS   = type(uint24).max;

    struct Bits
    {
        uint256 data;
    }

   
    mapping(uint256 => Bits) Bitmap0;
    mapping(uint256 => Bits) Bitmap1;
    mapping(uint256 => Bits) Bitmap2;

    
    function getBitmap(uint8 level, uint256 index) internal view returns(Bits storage)
    {
        if(level==0)
            return Bitmap0[index];
        else
        if(level==1)
            return Bitmap1[index];
        else
            return Bitmap2[index];
    }


    function clearRangeArr(uint24 from,uint24 to, uint8 level, uint256 index) internal returns(uint256)
    {
        Bits storage Bitmap=getBitmap(level,index);
        uint8 BitFrom = uint8((from>>(level*8)) & 0xFF);
        uint8 BitTo   = uint8((to>>(level*8)) & 0xFF);

        uint256 data = Bitmap.data;

        if(level==0)
        {
            uint256 FF=type(uint256).max;
            uint256 Maska=(FF>>(256-BitFrom)) | (FF<<(uint256(1)+BitTo));

            data &= Maska;
        }
        else
        {
            for(uint16 i=BitFrom; i<=BitTo; i++)
            {
                uint256 Maska = 1 << i;
                if(data & Maska == 0)
                    continue;

                if(i==BitFrom)
                {
                    uint24 _to;
                    if(i==BitTo)
                    {
                        _to=to;
                    }
                    else
                    {
                        //мы в начале отрезка, но разряды разные
                        _to=MAX_BITS;
                    }

                    if(clearRangeArr(from,_to, level-1,(index<<8)+i) == 0)
                    {
                        data = (data | Maska) ^ Maska;
                    }
                }
                else
                if(i==BitTo)
                {
                    //мы в конце отрезка, но разряды разные
                    if(clearRangeArr(0,to, level-1,(index<<8)+i) == 0)
                    {
                        data = (data | Maska) ^ Maska;
                    }
                }
                else
                {
                    data = (data | Maska) ^ Maska;
                }
            }
        }

        Bitmap.data = data;//save
        return data;
    }


    function setBitArr(uint24 num, uint8 level, uint256 index, uint256 upperBit) internal
    {
        Bits storage Bitmap=getBitmap(level,index);
        uint8 BitNum = uint8((num>>(level*8)) & 0xFF);
        uint256 Maska = 1 << BitNum;

        if(upperBit == 0)
        {
            Bitmap.data=0;
        }
        
        
        if(level==0)
        {
            Bitmap.data |= Maska;
        }
        else
        {
            setBitArr(num, level-1,(index<<8)+BitNum, Bitmap.data & Maska);
            Bitmap.data |= Maska;
        }
    }

    
    function getBitArr(uint24 num, uint8 level, uint256 index) internal view returns (uint256)
    {
        Bits memory Bitmap=getBitmap(level,index);
        uint8 BitNum = uint8((num>>(level*8)) & 0xFF);
        uint256 Maska = 1 << BitNum;
        
        if(level==0)
        {
            return Bitmap.data & Maska;
        }
        else
        {
            if(Bitmap.data & Maska == 0)
                return 0;

            return getBitArr(num, level-1,(index<<8)+BitNum);
        }
    }

    function findLowerArr(uint24 num, uint8 level, uint256 index) internal view returns (int32)
    {
        Bits memory Bitmap=getBitmap(level,index);
        int16 BitNum = int16(uint16((num>>(level*8)) & 0xFF));

        if(level==0)
        {
            uint256 FF=type(uint256).max;
            uint256 Maska=FF>>(255 - uint16(BitNum));
            uint256 Value=Bitmap.data & Maska;
            if(Value==0)
                return -1;
            
            return int32(uint32(BitMath.mostSignificantBit(Value)));
        }
        else
        {
            for(int256 i=BitNum; i>=0; i--)
            {
                uint256 Maska = 1 << uint256(i);
                if(Bitmap.data & Maska != 0)
                {
                    int32 find=findLowerArr(num, level-1, (index<<8)+uint256(i));
                    if(find != -1)
                        return int32(uint32((uint256(i)<<(level*8))) + uint32(find));
                }

                num=MAX_BITS;
            }
        }

        return -1;//not found
    }

    function findBiggerArr(uint24 num, uint8 level, uint256 index) internal view returns (int32)
    {
        Bits memory Bitmap=getBitmap(level,index);
        int16 BitNum = int16(uint16((num>>(level*8)) & 0xFF));
       

        if(level==0)
        {
            uint256 FF=type(uint256).max;
            uint256 Maska=FF<<(uint16(BitNum));
            uint256 Value=Bitmap.data & Maska;
            if(Value==0)
                return -1;
            
            return int32(uint32(BitMath.leastSignificantBit(Value)));
        }
        else
        {
            for(int256 i=BitNum; i<=255; i++)
            {
                uint256 Maska = 1 << uint256(i);
                if(Bitmap.data & Maska != 0)
                {
                    int32 find=findBiggerArr(num, level-1, (index<<8)+uint256(i));
                    if(find != -1)
                        return int32(uint32((uint256(i)<<(level*8))) + uint32(find));
                }

                num=0;
            }
        }

        return -1;//not found
    }




    function clearRange(uint24 from,uint24 to) internal
    {
        clearRangeArr(from,to,ROOT_LEVEL,0);
    }

    function setBit(uint24 num) internal
    {
        setBitArr(num,ROOT_LEVEL,0, 1);
    }

    function getBit(uint24 num) internal view returns(uint256)
    {
        return getBitArr(num,ROOT_LEVEL,0);
    }

    function findLower(uint24 num) internal view returns(int32)
    {
        return findLowerArr(num,ROOT_LEVEL,0);
    }

    function findBigger(uint24 num) internal view returns(int32)
    {
        return findBiggerArr(num,ROOT_LEVEL,0);
    }
    

}
