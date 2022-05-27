pragma solidity ^0.8.4;

contract ReleaseV2{
    bool initialized;
    uint256 value;

    function initialize() public {
        require(!initialized, "already initialized");

        value = 0x42;
        initialized = true;
    }

    function setvalue(uint256 newvalue) public {
        value = newvalue;
    }

    function getvalue() public view returns (uint256) {
        return value;
    }

    function doMagic() public {
        value = value / 2;
    }
}
