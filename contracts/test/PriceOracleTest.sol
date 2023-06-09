// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

import "../PriceOracle.sol";

//import "hardhat/console.sol";

contract PriceOracleTest is PriceOracle
{

    function clearRange2(uint24 from,uint24 to) external
    {
        clearRange(from,to);
    }


    function setBit2(uint24 num) external
    {
        setBit(num);
    }

    function getBit2(uint24 num) external view returns(uint8)
    {
        if(getBit(num)==0)
            return 0;
        else
            return 1;
    }


    function findLower2(uint24 num) external view returns(int32)
    {
        return findLower(num);
    }
    function findBigger2(uint24 num) external view returns(int32)
    {
        return findBigger(num);
    }


    function listBitmap(uint24 from,uint24 to) view external returns (uint8[] memory arr)
    {
        unchecked
        {

            uint256 count=uint256(uint24(1 + to - from));

            arr = new uint8[](count);
            for(uint256 i=0;i<count;i++)
            {
                uint32 index=uint32(from)+uint32(i);

                if(getBit(uint24(index)) != 0)
                    arr[i] = 1;
            }
        }
    }


}


