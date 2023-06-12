// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;

struct Arr8x32
{
    uint32[8] arr;
}


library TickLib
{
 
    /// @notice Retrieves value (uint32) by index
    /// @param self The mapping containing data value
    /// @param index The current index
    /// @return The value

    function getAt8(
        mapping(uint256 => Arr8x32) storage self,
        uint256 index
    ) internal view returns (uint32) 
    {
        unchecked
        {
            uint256 posNum=index/8;
            uint256 posBit=index%8;
            return self[posNum].arr[posBit];
        }
    }

    /// @notice Write value (uint32) by index
    /// @param self The mapping containing data value
    /// @param index The current index
    /// @param value The value
    function setAt8(
        mapping(uint256 => Arr8x32) storage self,
        uint256 index,
        uint32 value
    ) internal
    {
        unchecked
        {
            uint256 posNum=index/8;
            uint256 posBit=index%8;
            self[posNum].arr[posBit]=value;
        }
    }


    function setPairAt8(
        mapping(uint256 => Arr8x32) storage self,
        uint256 index1,
        uint256 index2,
        uint32 value
    ) internal
    {
        unchecked
        {
            uint256 posNum1=index1>>3;
            uint256 posNum2=index2>>3;
            uint256 posBit1=index1%8;
            uint256 posBit2=index2%8;
            
            if(posNum1==posNum2)
            {
                Arr8x32 storage Slot=self[posNum1];
                Slot.arr[posBit1]=value;
                Slot.arr[posBit2]=value;
            }
            else
            {
                self[posNum1].arr[posBit1]=value;
                self[posNum2].arr[posBit2]=value;
            }
        }
    }
}


