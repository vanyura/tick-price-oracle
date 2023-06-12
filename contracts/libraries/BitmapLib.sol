// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import './BitMath.sol';


import "hardhat/console.sol";

contract BitmapLib
{
    uint8 constant  ROOT_LEVEL = 2;
    uint24 constant MAX_BITS   = type(uint24).max;

    mapping(uint256 => uint256) ArrBitmap;

    function getBitmap(uint256 level, uint256 index) internal view returns(uint256 Value)
    {
        unchecked
        {
            Value=ArrBitmap[level*0x1000000 + index];

            if(level==ROOT_LEVEL)
                Value = Value>>24;
        }
    }

    function setBitmap(uint256 level, uint256 index, uint256 value) internal
    {
        unchecked
        {
            if(level==ROOT_LEVEL)
            {
                uint256 WasCurrentTick = ArrBitmap[level*0x1000000] & 0xFFFFFF;
                value = (value << 24) | WasCurrentTick;
            }
            
            ArrBitmap[level*0x1000000 + index] = value;
        }
    }

    function writeTick(uint24 tick) internal
    {
        unchecked
        {
            uint256 WasSlotValue = ArrBitmap[ROOT_LEVEL*0x1000000];
            WasSlotValue = (WasSlotValue>>24)<<24;
            
            ArrBitmap[ROOT_LEVEL*0x1000000] = WasSlotValue | tick;
        }
    }
    function readTick() internal view returns(uint24 Value)
    {
        unchecked
        {
            return uint24(ArrBitmap[ROOT_LEVEL*0x1000000]);
        }
    }


    function clearRangeArr(uint256 from, uint256 to, uint256 level, uint256 index) internal returns(uint256)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(level,index);
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

                        if(clearRangeArr(from,_to, level-1, index*0x100+i) == 0)
                        {
                            Value = (Value | Maska) ^ Maska;
                        }
                    }
                    else
                    if(i==BitTo)
                    {
                        //мы в конце отрезка, но разряды разные
                        if(clearRangeArr(0,to, level-1, index*0x100+i) == 0)
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
                setBitmap(level, index, Value);
            }

            return Value;
        }
    }


    function setBitArr(uint256 num, uint256 level, uint256 index, uint256 upperBit) internal
    {
        unchecked
        {
            uint256 BitNum = uint8((num>>(level*8)) & 0xFF);
            uint256 Maska = 1 << BitNum;

            uint256 Bitmap;
            if(upperBit != 0)
            {
                Bitmap=getBitmap(level,index);
            }
            
            
            if(level>0)
            {
                setBitArr(num, level-1, index*0x100+BitNum, Bitmap & Maska);
            }

            uint256 Value=Bitmap | Maska;
            if(Value != Bitmap)
            {
                setBitmap(level, index, Value);
            }
        }
    }
    
    function getBitArr(uint256 num, uint56 level, uint256 index) internal view returns (uint256)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(level,index);
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

                return getBitArr(num, level-1, index*0x100+BitNum);
            }
        }
    }

    function findLowerArr(uint256 num, uint256 level, uint256 index) internal view returns (int32)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(level,index);
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
                        int32 find=findLowerArr(num, level-1, index*0x100+uint256(i));
                        if(find != -1)
                            return int32(uint32((uint256(i)<<(level*8))) + uint32(find));
                    }

                    num=MAX_BITS;
                }
            }

            return -1;//not found
        }
    }

    function findBiggerArr(uint256 num, uint256 level, uint256 index) internal view returns (int32)
    {
        unchecked
        {
            uint256 Bitmap=getBitmap(level,index);
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
                        int32 find=findBiggerArr(num, level-1, index*0x100+uint256(i));
                        if(find != -1)
                            return int32(uint32((uint256(i)<<(level*8))) + uint32(find));
                    }

                    num=0;
                }
            }

            return -1;//not found
        }
    }




    function clearRange(uint24 from,uint24 to) internal
    {
        clearRangeArr(from,to,ROOT_LEVEL,0);
    }

    function setBit(uint256 num) internal
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
