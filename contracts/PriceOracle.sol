// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import "./libraries/TickLib.sol";
import "./libraries/BitmapLib.sol";

//import "hardhat/console.sol";

contract PriceOracle is BitmapLib
{
    int32 constant public MAX_TICK   = int24(type(uint24).max/2)-2;

    mapping(uint256 => Arr8x32) ArrTicks;
    uint24 CurTick;
    uint32 blockTimestamp;

    function setNewTick(int24 Tick0)external
    {
        unchecked
        {
            require(Tick0 >= -MAX_TICK,"Error MIN tick number");
            require(Tick0 <=  MAX_TICK,"Error MAX tick number");
            uint24 Tick = uint24(uint32(int32(Tick0) + MAX_TICK));

            //uint32 blockTimestamp = uint32(block.timestamp % 2**32);
            blockTimestamp++;

            //we set the signs of price changes in ticks, i.e. bit 0
            if(Tick < CurTick)
            {
                clearRange(Tick+1,CurTick-1);
            }
            else
            if(Tick > CurTick)
            {
                //todo 4K газа
                clearRange(CurTick+1,Tick-1);
            }

            //todo 12K газа
            setBit(Tick);
            //todo - возможна экономия 600 газа
            TickLib.setAt8(ArrTicks, CurTick,blockTimestamp);//beginning of the range
            TickLib.setAt8(ArrTicks, Tick,blockTimestamp);//end of range
            CurTick=Tick;
            }
    }

    function getTickInfo(int24 Tick0)external view returns(uint32)
    {
        unchecked
        {
            require(Tick0 >= -MAX_TICK,"Error MIN tick number");
            require(Tick0 <=  MAX_TICK,"Error MAX tick number");
            uint24 Tick = uint24(uint32(int32(Tick0) + MAX_TICK));


            //return TickLib.getAt8(ArrTicks, Tick);
            int32 find;
            if(Tick == CurTick)
                find=int32(uint32(Tick));
            else
            if(Tick<CurTick)
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
        return int24(int32(uint32(CurTick)) - MAX_TICK);
    }


}