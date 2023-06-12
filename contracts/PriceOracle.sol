// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import "./libraries/TickLib.sol";
import "./libraries/BitmapLib.sol";

//import "hardhat/console.sol";

contract PriceOracle is BitmapLib
{
    int32 constant public MAX_TICK   = int24(type(uint24).max/2)-2 - 65536*12; //MAX_TICK=7602173

    mapping(uint256 => Arr8x32) ArrTicks;

    function setNewTick(int24 Tick, uint32 blockTimestamp) public
    {
        unchecked
        {
            uint24 TickNew = getAbsoluteTick(Tick);

            uint24 CurTick=readTick();

            //uint32 blockTimestamp = uint32(block.timestamp % 2**32);

            //we set the signs of price changes in ticks, i.e. bit 0
            if(TickNew < CurTick)
            {
                clearRange(TickNew+1,CurTick-1);
            }
            else
            if(TickNew > CurTick)
            {
                clearRange(CurTick+1,TickNew-1);
            }

            setBit(TickNew);
            
            TickLib.setPairAt8(ArrTicks, CurTick, TickNew, blockTimestamp);

            writeTick(TickNew);
        }
    }

    function setRangeTick(int24 From, int24 To, int24 Tick, uint32 blockTimestamp) external
    {

        unchecked
        {
            require(From <= To,"Error tick range numbers");
            require(From <= Tick,"Error new tick number #1");
            require(To >= Tick,"Error new tick number #2");
            

            uint24 TickFrom = getAbsoluteTick(From);
            uint24 TickTo = getAbsoluteTick(To);
            uint24 TickNew = getAbsoluteTick(Tick);

            uint24 CurTick=readTick();

            if(CurTick < TickFrom)
                TickFrom = CurTick;
            else
            if(CurTick > TickTo)
                TickTo = CurTick;

            //we set the signs of price changes in ticks, i.e. bit 0
            clearRange(TickFrom+1,TickTo-1);

 

            
            setBit(TickFrom);
            setBit(TickTo);
            if(TickNew!=TickFrom && TickNew!=TickTo)
                setBit(TickNew);
            
            TickLib.setPairAt8(ArrTicks, TickFrom, TickNew, blockTimestamp);
            TickLib.setAt8(ArrTicks, TickTo, blockTimestamp);

            writeTick(TickNew);
        }
        
    }

    function getAbsoluteTick(int24 Tick) pure internal returns(uint24)
    {
        unchecked
        {
            require(Tick >= -MAX_TICK,"Error MIN tick number");
            require(Tick <=  MAX_TICK,"Error MAX tick number");
            return uint24(uint32(int32(Tick) + MAX_TICK));
        }
    }


    function getTickInfo(int24 Tick)external view returns(uint32)
    {
        unchecked
        {
            uint24 TickNew = getAbsoluteTick(Tick);
            uint24 CurTick=readTick();


            int32 find;
            if(TickNew == CurTick)
                find=int32(uint32(TickNew));
            else
            if(TickNew<CurTick)
            {
                //go left, look for the current tick
                find=findLower(TickNew);
            }
            else
            {
                //go right, look for the current tick 
                find=findBigger(TickNew);
            }

            if(find==-1)
                return 0;
            else
                return TickLib.getAt8(ArrTicks, uint32(find));
        }
    }


    function getCurrentTick() external view returns(int24)
    {
        uint24 CurTick=readTick();
        return int24(int32(uint32(CurTick)) - MAX_TICK);
    }

}