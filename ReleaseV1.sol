pragma solidity ^0.8.4;

contract ReleaseV1 {
    bool initialized;
    uint256 value;

    function initialize() public {
        require(!initialized, "already initialized");

        value = 0x42;
        initialized = true;
    }

    function setValue(uint256 newValue) public {
        value = newValue;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}
