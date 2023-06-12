// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import './BitMath.sol';


//import "hardhat/console.sol";

library BitmapLib
{
    uint8 constant  ROOT_LEVEL = 2;
    uint24 constant MAX_BITS   = type(uint24).max;

    

    function getBitmap(mapping(uint256 => uint256) storage arrBitmap, uint256 level, uint256 index) internal view returns(uint256 Value)
    {
        unchecked
        {
            Value=arrBitmap[level*0x1000000 + index];

            if(level==ROOT_LEVEL)
                Value = Value>>24;
        }
    }

    function setBitmap(mapping(uint256 => uint256) storage arrBitmap, uint256 level, uint256 index, uint256 value) internal
    {
        unchecked
        {
            if(level==ROOT_LEVEL)
            {
                uint256 WasCurrentTick = arrBitmap[level*0x1000000] & 0xFFFFFF;
                value = (value << 24) | WasCurrentTick;
            }
            
            arrBitmap[level*0x1000000 + index] = value;
        }
    }

    function writeTick(mapping(uint256 => uint256) storage arrBitmap, uint24 tick) internal
    {
        unchecked
        {
            uint256 WasSlotValue = arrBitmap[ROOT_LEVEL*0x1000000];
            WasSlotValue = (WasSlotValue>>24)<<24;
            
            arrBitmap[ROOT_LEVEL*0x1000000] = WasSlotValue | tick;
        }
    }
    function readTick(mapping(uint256 => uint256) storage arrBitmap) internal view returns(uint24 Value)
    {
        unchecked
        {
            return uint24(arrBitmap[ROOT_LEVEL*0x1000000]);
        }
    }


    function clearRangeArr(mapping(uint256 => uint256) storage arrBitmap, uint256 from, uint256 to, uint256 level, uint256 index) internal returns(uint256)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(arrBitmap,level,index);
            uint256 BitFrom = (from>>(level*8)) & 0xFF;
            uint256 BitTo   = (to>>(level*8)) & 0xFF;

            uint256 Value = Bitmap;

            if(level==0)
            {
                uint256 FFFF=type(uint256).max;
                uint256 Maska=(FFFF>>(256-BitFrom)) | (FFFF<<(BitTo + 1));

                Value &= Maska;
            }
            else
            {
                for(uint256 i=BitFrom; i<=BitTo; i++)
                {
                    uint256 Maska = 1 << i;
                    if(Value & Maska == 0)
                        continue;

                    if(i==BitFrom)
                    {
                        uint256 _to;
                        if(i==BitTo)
                        {
                            _to=to;
                        }
                        else
                        {
                            //мы в начале отрезка, но разряды разные
                            _to=MAX_BITS;
                        }

                        if(clearRangeArr(arrBitmap, from,_to, level-1, index*0x100+i) == 0)
                        {
                            Value = (Value | Maska) ^ Maska;
                        }
                    }
                    else
                    if(i==BitTo)
                    {
                        //мы в конце отрезка, но разряды разные
                        if(clearRangeArr(arrBitmap, 0,to, level-1, index*0x100+i) == 0)
                        {
                            Value = (Value | Maska) ^ Maska;
                        }
                    }
                    else
                    {
                        Value = (Value | Maska) ^ Maska;
                    }
                }
            }

            //save
            if(Value != Bitmap)
            {
                setBitmap(arrBitmap, level, index, Value);
            }

            return Value;
        }
    }


    function setBitArr(mapping(uint256 => uint256) storage arrBitmap, uint256 num, uint256 level, uint256 index, uint256 upperBit) internal
    {
        unchecked
        {
            uint256 BitNum = uint8((num>>(level*8)) & 0xFF);
            uint256 Maska = 1 << BitNum;

            uint256 Bitmap;
            if(upperBit != 0)
            {
                Bitmap=getBitmap(arrBitmap,level,index);
            }
            
            
            if(level>0)
            {
                setBitArr(arrBitmap, num, level-1, index*0x100+BitNum, Bitmap & Maska);
            }

            uint256 Value=Bitmap | Maska;
            if(Value != Bitmap)
            {
                setBitmap(arrBitmap, level, index, Value);
            }
        }
    }
    
    function getBitArr(mapping(uint256 => uint256) storage arrBitmap, uint256 num, uint56 level, uint256 index) internal view returns (uint256)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(arrBitmap,level,index);
            uint56 BitNum = uint8((num>>(level*8)) & 0xFF);
            uint256 Flags = Bitmap & (1 << BitNum);
            
            if(level==0)
            {
                return Flags;
            }
            else
            {
                if(Flags == 0)
                    return 0;

                return getBitArr(arrBitmap, num, level-1, index*0x100+BitNum);
            }
        }
    }

    function findLowerArr(mapping(uint256 => uint256) storage arrBitmap, uint256 num, uint256 level, uint256 index) internal view returns (int32)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(arrBitmap,level,index);
            int16 BitNum = int16(uint16((num>>(level*8)) & 0xFF));

            if(level==0)
            {
                uint256 FFFF=type(uint256).max;
                uint256 Maska=FFFF>>(255 - uint16(BitNum));
                uint256 Value=Bitmap & Maska;
                if(Value==0)
                    return -1;

                return int32(uint32(BitMath.mostSignificantBit(Value)));
            }
            else
            {
                for(int256 i=BitNum; i>=0; i--)
                {
                    uint256 Maska = 1 << uint256(i);
                    if(Bitmap & Maska != 0)
                    {
                        int32 find=findLowerArr(arrBitmap, num, level-1, index*0x100+uint256(i));
                        if(find != -1)
                            return int32(uint32((uint256(i)<<(level*8))) + uint32(find));
                    }

                    num=MAX_BITS;
                }
            }

            return -1;//not found
        }
    }

    function findBiggerArr(mapping(uint256 => uint256) storage arrBitmap, uint256 num, uint256 level, uint256 index) internal view returns (int32)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(arrBitmap,level,index);
            int16 BitNum = int16(uint16((num>>(level*8)) & 0xFF));

            if(level==0)
            {
                uint256 FFFF=type(uint256).max;
                uint256 Maska=FFFF<<(uint16(BitNum));
                uint256 Value=Bitmap & Maska;
                if(Value==0)
                    return -1;
                
                return int32(uint32(BitMath.leastSignificantBit(Value)));
            }
            else
            {
                for(int256 i=BitNum; i<=255; i++)
                {
                    uint256 Maska = 1 << uint256(i);
                    if(Bitmap & Maska != 0)
                    {
                        int32 find=findBiggerArr(arrBitmap, num, level-1, index*0x100+uint256(i));
                        if(find != -1)
                            return int32(uint32((uint256(i)<<(level*8))) + uint32(find));
                    }

                    num=0;
                }
            }

            return -1;//not found
        }
    }




    function clearRange(mapping(uint256 => uint256) storage arrBitmap, uint24 from,uint24 to) internal
    {
        clearRangeArr(arrBitmap, from,to,ROOT_LEVEL,0);
    }

    function setBit(mapping(uint256 => uint256) storage arrBitmap, uint256 num) internal
    {
        setBitArr(arrBitmap, num,ROOT_LEVEL,0, 1);
    }

    function getBit(mapping(uint256 => uint256) storage arrBitmap, uint24 num) internal view returns(uint256)
    {
        return getBitArr(arrBitmap, num,ROOT_LEVEL,0);
    }

    function findLower(mapping(uint256 => uint256) storage arrBitmap, uint24 num) internal view returns(int32)
    {
        return findLowerArr(arrBitmap, num,ROOT_LEVEL,0);
    }

    function findBigger(mapping(uint256 => uint256) storage arrBitmap, uint24 num) internal view returns(int32)
    {
        return findBiggerArr(arrBitmap, num,ROOT_LEVEL,0);
    }
    

}
