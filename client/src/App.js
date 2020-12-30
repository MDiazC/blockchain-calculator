import React, { Component } from "react";
import calculator from "./contracts/Calculator.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { operand1: null, operand2:null, operation:null, web3: null, accounts: null, calculator: null, screen:0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = calculator.networks[networkId];
      const instance = new web3.eth.Contract(calculator.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, calculator: instance }, this.runExample);

      this.state.calculator.events.MemoryUpdated({
          filter: {user_id: this.state.accounts[0]}
      }, function(error, event){
        if (error) {
          alert("It was an error");
        }else{
          alert("Memory updated");
        }
      })

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  operationBtn = (event) => {
    var value = event.target.value;

    this.setState({ operation: value });
  }

  operandBtn = (event) => {
    var value = event.target.value;

    if(this.state.operation != null){
        this.setState({ operand2: parseInt(value) });
    }else{
        this.setState({ operand1: parseInt(value) });
    }
    this.setState({ screen: parseInt(value) });
  }


  delete = (event) => {
    if(this.state.operation != null){
        this.setState({ operand1: 0 });
    }else{
        this.setState({ operand2: 0 });
    }
    this.setState({ screen: 0 });
  }


  calculate = async() => {
    if(this.state.operation!= null){
        var that = this;
        switch(this.state.operation)
            {
                case "+":
                var fgas = await this.state.calculator.methods.add(this.state.operand1, this.state.operand2).estimateGas({from: this.state.accounts[0]});
                  this.state.calculator.methods.add(this.state.operand1, this.state.operand2).call({from: this.state.accounts[0], gas: fgas})
                  .then(function(result){
                    that.setState({ screen: parseInt(result) });
                    that.setState({ operand1: 0 });
                    that.setState({ operand2: 0 });
                    that.setState({ operation: null });
                  });
                break;
                case "-":
                  var fgas = await this.state.calculator.methods.substract(this.state.operand1, this.state.operand2).estimateGas({from: this.state.accounts[0]});
                  this.state.calculator.methods.substract(this.state.operand1, this.state.operand2).call({from: this.state.accounts[0], gas: fgas})
                  .then(function(result){
                    that.setState({ screen: parseInt(result) });
                    that.setState({ operand1: 0 });
                    that.setState({ operand2: 0 });
                    that.setState({ operation: null });
                  });
                break;
                case "*":
                  var fgas = await this.state.calculator.methods.multiply(this.state.operand1, this.state.operand2).estimateGas({from: this.state.accounts[0]});
                  this.state.calculator.methods.multiply(this.state.operand1, this.state.operand2).call({from: this.state.accounts[0], gas: fgas})
                  .then(function(result){
                    that.setState({ screen: parseInt(result) });
                    that.setState({ operand1: 0 });
                    that.setState({ operand2: 0 });
                    that.setState({ operation: null });
                  });
                break;
                case "/":
                  var fgas = await this.state.calculator.methods.divide(this.state.operand1,  this.state.operand2).estimateGas({from: this.state.accounts[0]});
                  this.state.calculator.methods.divide(this.state.operand1, this.state.operand2).call({from: this.state.accounts[0], gas: fgas})
                  .then(function(result){
                    that.setState({ screen: parseInt(result) });
                    that.setState({ operand1: 0 });
                    that.setState({ operand2: 0 });
                    that.setState({ operation: null });
                  });
                break;
            }
    }
  }

  factorial = async() => {
    var that = this;
      var fgas = await this.state.calculator.methods.factorial(this.state.operand1).estimateGas({from: this.state.accounts[0]});
      this.state.calculator.methods.factorial(this.state.operand1).call({from: this.state.accounts[0], gas: fgas})
      .then(function(result){
        that.setState({ screen: parseInt(result) });
        that.setState({ operand1: 0 });
        that.setState({ operand2: 0 });
        that.setState({ operation: null });
      });
  }

  memory = async(event) => {

    var value = event.target.value;
    var result = null;
        switch(value)
            {
                case "MS":
                    result = this.state.calculator.methods.storeMemory(this.state.operand1).send({from: this.state.accounts[0], gas: 50000});
                break;
                case "MR":
                    var fgas = await this.state.calculator.methods.getMemory().estimateGas({from: this.state.accounts[0]});
                    result = await this.state.calculator.methods.getMemory().call({from: this.state.accounts[0], gas: fgas});
                    this.setState({ screen: parseInt(result) });
                break;
                case "M+":
                    var fgas = await this.state.calculator.methods.addMemory(this.state.operand1).estimateGas({from: this.state.accounts[0]});
                    result = await this.state.calculator.methods.addMemory(this.state.operand1).call({from: this.state.accounts[0], gas: fgas});
                    this.setState({ screen: parseInt(result) });
                break;
                case "M-":
                    var fgas = await this.state.calculator.methods.substractMemory(this.state.operand1).estimateGas({from: this.state.accounts[0]});
                    result = await this.state.calculator.methods.substractMemory(this.state.operand1).call({from: this.state.accounts[0], gas: fgas});
                    this.setState({ screen: parseInt(result) });
                break;
                case "M*":
                    var fgas = await this.state.calculator.methods.multiplyMemory(this.state.operand1).estimateGas({from: this.state.accounts[0]});
                    result = await this.state.calculator.methods.multiplyMemory(this.state.operand1).call({from: this.state.accounts[0], gas: fgas});
                    this.setState({ screen: parseInt(result) });
                break;
                case "M/":
                    var that = this;
                    result = await this.state.calculator.methods.divideMemory(this.state.operand1).send({from: this.state.accounts[0], gas: 50000},function (err, result)
                    					{
                    						if (err) {
                    							console.error(err);
                    							return;
                    						}

                    						that.state.calculator.once('Result',{user_id: that.state.accounts[0]},
                                function(error, event){
                                  if (err) {
                      							alert("It was an error");
                      						}else{
                                    that.setState({ screen: parseInt(event.returnValues.number) });
                                  }
                                });

                                that.state.calculator.once('DivisionByZero',{user_id: that.state.accounts[0]},
                                function(error, event){
                                  alert("Number in memory has to be bigger than zero");
                                });
                    					});
                break;
                case "MC":
                var that = this;
                    result = this.state.calculator.methods.deleteMemory().send({from: this.state.accounts[0], gas: 50000});
                break;
            }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <form name="calculator">
            <table>
                <tbody>
                <tr>
                    <th colSpan="6">
                        <input type="text" name="screen" id="screen" value={this.state.screen} />
                    </th>
                </tr>
                <tr>
                    <td>
                        <input type="button" name="one" value="1" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="two" value="2" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="three" value="3" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="add" value="+" onClick={this.operationBtn} />
                    </td>
                    <td>
                        <input type="button" name="M+" value="M+" onClick={this.memory} />
                    </td>
                    <td>
                        <input type="button" name="MS" value="MS" onClick={this.memory} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="button" name="four" value="4" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="five" value="5" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="six" value="6" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="minus" value="-" onClick={this.operationBtn} />
                    </td>
                    <td>
                        <input type="button" name="M-" value="M-" onClick={this.memory} />
                    </td>
                    <td>
                        <input type="button" name="MR" value="MR" onClick={this.memory} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="button" name="seven" value="7" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="eight" value="8" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="nine" value="9" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="multiply" value="*" onClick={this.operationBtn} />
                    </td>
                    <td>
                        <input type="button" name="MM" value="M*" onClick={this.memory} />
                    </td>
                    <td>
                        <input type="button" name="MC" value="MC" onClick={this.memory} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="button" id="delete" name="delete" value="c" onClick={this.delete} />
                    </td>
                    <td>
                        <input type="button" name="zero" value="0" onClick={this.operandBtn} />
                    </td>
                    <td>
                        <input type="button" name="equal" value="=" onClick={this.calculate} />
                    </td>
                    <td>
                      <input type="button" name="divide" value="/" onClick={this.operationBtn} />
                    </td>
                    <td>
                        <input type="button" name="MD" value="M/" onClick={this.memory} />
                    </td>
                    <td>
                        <input type="button" name="factorial" value="!" onClick={this.factorial} />
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
      </div>
    );
  }
}

export default App;
