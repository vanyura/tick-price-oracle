// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import "./libraries/TickLib.sol";
import "./libraries/BitmapLib.sol";

//import "hardhat/console.sol";

contract PriceOracle is BitmapLib
{
    mapping(uint256 => Arr8x32) ArrTicks;
    uint24 CurTick;

    function setNewTick(uint24 Tick)external
    {
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);

        
        //we set the signs of price changes in ticks, i.e. bit 0
        if(Tick < CurTick)
        {
            clearRange(Tick+1,CurTick-1);
        }
        else
        if(Tick > CurTick)
        {
            clearRange(CurTick+1,Tick-1);
        }

        setBit(Tick);
        TickLib.setAt8(ArrTicks, CurTick,blockTimestamp);//beginning of the range
        TickLib.setAt8(ArrTicks, Tick,blockTimestamp);//end of range
        CurTick=Tick;
    }

    function getTickInfo(uint24 Tick)external view returns(uint32)
    {
        return TickLib.getAt8(ArrTicks, Tick);
    }

    function getCurrentTick() external view returns(uint24)
    {
        return CurTick;
    }




}