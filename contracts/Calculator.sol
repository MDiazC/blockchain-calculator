pragma solidity ^0.4.0;
//compiler 0.5 works

contract Calculator {
    //Attributes
    mapping(address => int256) _memory;

    event DivisionByZero(address user_id, int256 number);
    event MemoryUpdated(address user_id, int256 number);
    event Result(address user_id, int256 number);

    //Constructor
    function Constructor() public
    {
        _memory[msg.sender] = 0;
    }
    //Functions
    function add(int256 a, int256 b) public pure returns (int256)
    {
        return a + b;
    }
    function addMemory(int256 a) public view returns (int256)
    {
        return a + _memory[msg.sender];
    }
    function substract(int256 a, int256 b) public pure returns (int256)
    {
        return a - b;
    }
    function substractMemory(int256 a) public view returns (int256)
    {
        return a - _memory[msg.sender];
    }
    function storeMemory(int256 result) public returns (int256)
    {
        _memory[msg.sender] = result;
        emit MemoryUpdated(msg.sender, _memory[msg.sender]);
    }
    function getMemory() public view returns (int256)
    {
        return _memory[msg.sender];
    }
    function deleteMemory() public
    {
      _memory[msg.sender] = 0;
      emit MemoryUpdated(msg.sender, _memory[msg.sender]);
    }
    function multiply(int256 a, int256 b) public pure returns (int256)
    {
        return a * b;
    }
    function divide(int256 a, int256 b) public pure returns (int256)
    {
        require(b > 0, "Divisor has to be bigger than zero");
        return a / b;
    }
    function multiplyMemory(int256 a) public view returns (int256)
    {
        return a * _memory[msg.sender];
    }
    function divideMemory(int256 a) public returns (int256)
    {
        if(_memory[msg.sender] == 0){
            emit DivisionByZero(msg.sender, a);
        }else{
            emit Result(msg.sender, a / _memory[msg.sender]);
        }
    }
    function factorial(int256 a) public pure returns (int256)
    {
        require(a > -1, "Number has to be bigger than zero");
        int256 result = 1;
        while(a > 0){
            result = result * a;
            a--;
        }
        return result;
    }
}
