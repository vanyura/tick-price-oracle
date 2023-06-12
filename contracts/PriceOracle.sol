// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import "./libraries/TickLib.sol";
import "./libraries/BitmapLib.sol";

//import "hardhat/console.sol";

contract PriceOracle is BitmapLib
{
    int32 constant public MAX_TICK   = int24(type(uint24).max/2)-2 - 65536*12; //MAX_TICK=7602173

    mapping(uint256 => Arr8x32) ArrTicks;
    //uint24 CurTick;
    //uint32 blockTimestamp;

    function setNewTick(int24 Tick0, uint32 blockTimestamp) external
    {
        unchecked
        {
            require(Tick0 >= -MAX_TICK,"Error MIN tick number");
            require(Tick0 <=  MAX_TICK,"Error MAX tick number");
            uint24 Tick = uint24(uint32(int32(Tick0) + MAX_TICK));

            //uint24 _CurTick=CurTick;//safe gas
            uint24 _CurTick=readTick();

            //uint32 blockTimestamp = uint32(block.timestamp % 2**32);
            //blockTimestamp++;

            //we set the signs of price changes in ticks, i.e. bit 0
            if(Tick < _CurTick)
            {
                clearRange(Tick+1,_CurTick-1);
            }
            else
            if(Tick > _CurTick)
            {
                //todo 4K газа
                clearRange(_CurTick+1,Tick-1);
            }

            //todo 9.2K газа
            setBit(Tick);
            
            TickLib.setPairAt8(ArrTicks, _CurTick, Tick, blockTimestamp);
            //TickLib.setAt8(ArrTicks, _CurTick,blockTimestamp);//beginning of the range
            //TickLib.setAt8(ArrTicks, Tick,blockTimestamp);//end of range

            //CurTick=Tick;
            writeTick(Tick);
        }
    }

    function getTickInfo(int24 Tick0)external view returns(uint32)
    {
        unchecked
        {
            require(Tick0 >= -MAX_TICK,"Error MIN tick number");
            require(Tick0 <=  MAX_TICK,"Error MAX tick number");
            uint24 Tick = uint24(uint32(int32(Tick0) + MAX_TICK));

            uint24 _CurTick=readTick();


            int32 find;
            if(Tick == _CurTick)
                find=int32(uint32(Tick));
            else
            if(Tick<_CurTick)
            {
                //go left, look for the current tick
                find=findLower(Tick);
            }
            else
            {
                //go right, look for the current tick 
                find=findBigger(Tick);
            }

            if(find==-1)
                return 0;
            else
                return TickLib.getAt8(ArrTicks, uint32(find));
        }
    }


    function getCurrentTick() external view returns(int24)
    {
        uint24 _CurTick=readTick();
        return int24(int32(uint32(_CurTick)) - MAX_TICK);
    }

}