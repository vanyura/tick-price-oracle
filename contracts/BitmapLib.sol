// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.7;

import './BitMath.sol';


//import "hardhat/console.sol";

library BitmapLib
{
    //error BitmapIndex(uint256);
    uint8 constant ROOT_LEVEL=3;


    function clearRange(uint24 from,uint24 to) external
    {
        //clearRangeArr(from,to,ROOT_LEVEL,0);
    }

    function setBit(uint24 num) external
    {
        //setBitArr(num,ROOT_LEVEL,0, 0);
    }

    function getBit(uint24 num) external returns(uint256)
    {
        //return getBitArr(num,ROOT_LEVEL,0);
    }
    

}
