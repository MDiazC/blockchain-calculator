const Calculator = artifacts.require("./Calculator.sol");

const assert = require("chai").assert;
const TruffleAssert = require('truffle-assertions');
//const Math = require('mathjs');


contract("Calculator", accounts => {

	var calc;

	before("Deploy", async function() {
		if(!calc)
		{
			calc = await Calculator.deployed();
			console.log("Calculator Desplegada");
		}
	});

	afterEach("Exit", async function() {
		var tx = await calc.deleteMemory();

		TruffleAssert.eventEmitted(tx, 'MemoryUpdated', (ev) => {
			var result = parseInt(ev.number);
    	return result === 0;
  	});
	});


it("Store Memory", async () => {
	var result = 0;
	var tx = await calc.storeMemory(23, {from: accounts[0]});

	TruffleAssert.eventEmitted(tx, 'MemoryUpdated', (ev) => {
		var result = parseInt(ev.number);
		return result === 23;
	});

	result = await calc.getMemory({from: accounts[0]});
	assert.equal(result, 23, "Value in memory is not equal");
});

it("Add", async () => {
	var result = 0;
	result = await calc.add(2, 5);
	assert.equal(result, 7, "Add result incorrect");
});

it("Substract", async () => {
	result = await calc.substract(4, 2);
	assert.equal(result, 2, "Substract result incorrect");
});

it("Multiply", async () => {
	var result = 0;
	result = await calc.multiply(5, 5);
	assert.equal(result, 25, "Multiply result incorrect");
});

it("Divide", async () => {
	var result = 0;
	result = await calc.divide(32, 4);
	assert.equal(result, 8, "Divide result incorrect");
});

it("Add Memory", async () => {
	var result = 0;
	await calc.storeMemory(22, {from: accounts[0]});
	result = await calc.addMemory(5, {from: accounts[0]});
	assert.equal(result, 27, "Add memory result incorrect");
});


	it("Substract Memory", async () => {
		await calc.storeMemory(5, {from: accounts[0]});
		var result = await calc.substractMemory(7, {from: accounts[0]});
		assert.equal(result, 2, "Substract memory result incorrect");
	});

	it("Multiply Memory", async () => {
		var result = 0;
		await calc.storeMemory(7, {from: accounts[0]});
		result = await calc.multiplyMemory(5, {from: accounts[0]});
		assert.equal(result, 35, "Multiply memory result incorrect");
	});

	it("Divide Memory", async () => {
		var tx = await calc.storeMemory(5, {from: accounts[0]});
		TruffleAssert.eventEmitted(tx, 'MemoryUpdated', (ev) => {
			var result = parseInt(ev.number);
			return result === 5;
		});

		tx = await calc.divideMemory(25, {from: accounts[0]});

		TruffleAssert.eventEmitted(tx, 'Result', (ev) => {
			var result = parseInt(ev.number);
			return result === 5;
		});
	});

	it("Divide Memory By Zero", async () => {
		tx = await calc.divideMemory(5, {from: accounts[0]});

			TruffleAssert.eventEmitted(tx, 'DivisionByZero', (ev) => {
				var result = parseInt(ev.number);
				return result === 5;
			});
	});

	it("Memory Updated Event", async () => {

		var tx = await calc.storeMemory(parseInt(18), {from: accounts[0]});
		TruffleAssert.eventEmitted(tx, 'MemoryUpdated', (ev) => {
			var result = parseInt(ev.number);
			return result === 18;
		});
	});

	it("Empty Memory", async () => {

		var tx = await calc.storeMemory(parseInt(18), {from: accounts[0]});
		TruffleAssert.eventEmitted(tx, 'MemoryUpdated', (ev) => {
			var result = parseInt(ev.number);
    	return result === 18;
  	});

		var tx = await calc.deleteMemory({from: accounts[0]});
		TruffleAssert.eventEmitted(tx, 'MemoryUpdated', (ev) => {
			var result = parseInt(ev.number);
    	return result === 0;
  	});
  });

	it("Factorial", async () => {
		var result = 0;
		result = await calc.factorial(0);
		assert.equal(result, 1, "Factorial result incorrect");

		result = await calc.factorial(4);
		assert.equal(result, 24, "Factorial result incorrect");
	});

});
