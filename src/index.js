/* global web3 */
import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, RaisedButton, FlatButton, FloatingActionButton, Paper, Divider, Dialog, TextField, SelectField, MenuItem, DatePicker, TimePicker, Toggle } from 'material-ui';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Flexbox from 'flexbox-react';
import Spinner from 'react-spinkit';
import moment from 'moment';
import bs58 from 'bs58';

import './index.css';

const contractAbi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bets","outputs":[{"name":"state","type":"uint8"},{"name":"originator","type":"address"},{"name":"counterparty","type":"address"},{"name":"originatorBet","type":"uint256"},{"name":"counterpartyBet","type":"uint256"},{"name":"targetTimestamp","type":"uint256"},{"name":"targetPrice","type":"uint256"},{"name":"resolvedPrice","type":"uint256"},{"name":"bettingHigher","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastPriceUpdateTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"betId","type":"uint256"}],"name":"cancelBet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"queryId","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"oracleIsUpdating","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"betId","type":"uint256"}],"name":"resolveBet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"oraclizeGasLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastProof","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oraclePrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"updatePrice","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"betId","type":"uint256"}],"name":"acceptBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"ETHUSD","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gasLimit","type":"uint256"}],"name":"setOraclizeGasLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"originatorBet","type":"uint256"},{"name":"counterpartyBet","type":"uint256"},{"name":"targetTimestamp","type":"uint256"},{"name":"targetPrice","type":"uint256"},{"name":"bettingHigher","type":"bool"}],"name":"createBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"isShutdown","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gasPrice","type":"uint256"}],"name":"setOraclizeGasprice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numBets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"shutdown","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[],"name":"priceQuerySent","type":"event"},{"anonymous":false,"inputs":[],"name":"updatedPrice","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"betId","type":"uint256"}],"name":"updatedBet","type":"event"},{"anonymous":false,"inputs":[],"name":"updatedBalance","type":"event"}]');

class GenInfo extends React.Component {
    constructor(props) {
        super(props)
        var rinkebyString = "";
        if (props.networkId === 4)
            rinkebyString = "rinkeby.";
        this.state = {
            marketClosed: true,
            rinkebyString: rinkebyString
        }

        window.contract.isShutdown((err, res) => {
            this.setState({marketClosed: res});
        })
    }
    render() {
        return (
            <Paper>
                <Flexbox flexDirection="column">
                    <Flexbox className="headerBar">
                        <h3>General Information</h3>
                    </Flexbox>
                    <Flexbox justifyContent="space-between">
                        <Flexbox padding="10px" flexDirection="column">
                            <Flexbox>
                                Contract address:
                                &nbsp;
                                <a href={"https://" + this.state.rinkebyString + "etherscan.io/address/" + this.props.contractAddress}>{this.props.contractAddress}</a>
                            </Flexbox>
                            <Flexbox>
                                Your address:
                                &nbsp;
                                <a href={"https://" + this.state.rinkebyString + "etherscan.io/address/" + web3.eth.accounts[0]}>{web3.eth.accounts[0]}</a>
                            </Flexbox>
                        </Flexbox>
                        <Flexbox padding="10px" flexDirection="column">
                            <Flexbox>
                                Status: { this.state.marketClosed ? "Closed" : "Open" }
                            </Flexbox>
                            <Flexbox>
                                Network: { this.props.networkId === 4
                                    ? 'Rinkeby'
                                    : 'Mainnet' }
                            </Flexbox>
                        </Flexbox>
                        <Flexbox padding="10px" flexDirection="column">
                            <Flexbox>
                                <a href="http://app.oraclize.it/service/monitor">Oraclize live proof verifier</a>
                            </Flexbox>
                            <Flexbox>
                                <a href={"http://ipfs.io/ipfs/" + this.props.lastProof}>Download latest price update proof</a>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </Paper>
        )
    }
}

class Withdraw extends React.Component {
    constructor() {
        super();
        this.state = {
            balance: 0
        }

        setTimeout(() => {
            window.contract.updatedBalance((err, res) => {
            this.updateBalance();
            })
        }, 2000);
    }

    updateBalance() {
        window.contract.balances(web3.eth.accounts[0], (err, res) => {
            this.setState({balance: web3.fromWei(res.toNumber(), "ether")});
        })
    }

    withdraw() {
        window.contract.withdraw((err, res) => {
            if (!err) {
                console.log(res);
                this.props.addTxHash(res);
            } else {
                console.log(err);
            }
        })
    }

    render() {
        return(
            <Flexbox paddingTop="20px" flexDirection="column">
                <Paper> 
                    <Flexbox flexDirection="column">
                        <Flexbox className="headerBar">
                            <h3>Withdraw</h3>
                        </Flexbox>
                        <Flexbox justifyContent="center">
                            <h1>{this.state.balance} ETH</h1>
                        </Flexbox>
                        <Flexbox justifyContent="center" padding="0px 10px 10px 10px">
                            <RaisedButton label="Withdraw" secondary={true} onClick={() => this.withdraw()} />
                        </Flexbox>
                    </Flexbox>
                </Paper>
            </Flexbox>
        );
    }
}

class BetRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            betState: 0,
            originator: '',
            counterparty: '',
            originatorBet: 0,
            counterpartyBet: 0,
            targetTimestamp: 0,
            targetPrice: 0,
            resolvedPrice: 0,
            lastPriceUpdateTimestamp: 0,
            currentBlockTime: 0,
            bettingHigher: false,
            stateArray: [ 'Created', 'Accepted', 'Cancel Requested', 'Cancel Requested', 'Closed' ],
            closedToggle: false,
            onlyMyBetsToggle: false
        }

        this.updateState();
    }

    updateTimestamps(newCurrentBlockTime, newPriceUpdate) {
        this.setState({lastPriceUpdateTimestamp: newPriceUpdate, currentBlockTime: newCurrentBlockTime});
    }

    updateClosedToggle(toggle) {
        this.setState({closedToggle: toggle});
    }

    updateMyBetsToggle(toggle) {
        this.setState({onlyMyBetsToggle: toggle});
    }

    updateState() {
        window.contract.bets(this.state.id, (err, res) => {
            this.setState({
                betState: res[0].toNumber(),
                originator: res[1],
                counterparty: res[2],
                originatorBet: res[3].toNumber(),
                counterpartyBet: res[4].toNumber(),
                targetTimestamp: res[5].toNumber(),
                targetPrice: res[6].toNumber(),
                resolvedPrice: res[7].toNumber(),
                bettingHigher: res[8]
            })
        })
    }

    secondsToString(time1, time2)
    {
        if (time2 >= time1) {
            if (time1 > this.state.lastPriceUpdateTimestamp)
                return "Update oracle";
            return "Ready!"
        }
        var seconds = time1 - time2;
        var numdays = Math.floor(seconds / 86400);
        var numhours = Math.floor((seconds % 86400) / 3600);
        var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var numseconds = ((seconds % 86400) % 3600) % 60;
        var resultString = ""
        if (numdays > 0) resultString += numdays + "d ";
        if (numhours > 0) resultString += numhours + "h ";
        if (numminutes > 0) resultString += numminutes + "m ";
        if (numseconds > 0) resultString += numseconds + "s";
        return resultString;
    }

    cancel() {
        window.contract.cancelBet(this.state.id, {from: web3.eth.accounts[0]}, (err,res) => {
            if (!err) {
                console.log(res);
                this.props.addTxHash(res);
            } else {
                console.log(err);
            }
        })
    }

    dateString(timestamp) {
        var ts = moment.unix(timestamp/1000);
        return ts.format("MMM Do YYYY");
    }

    resolveAvailable() {
        if (this.state.betState !== 0 && this.state.betState !== 4 && this.state.currentBlockTime > this.state.targetTimestamp && this.state.lastPriceUpdateTimestamp > this.state.targetTimestamp)
            return true;
        return false;
    }

    cancelAvailable() {
        if (this.state.betState !== 4
            && (this.state.originator === web3.eth.accounts[0] || this.state.counterparty === web3.eth.accounts[0])
            && !(this.state.betState === 2 && this.state.originator === web3.eth.accounts[0])
            && !(this.state.betState === 3 && this.state.counterparty === web3.eth.accounts[0]))
            return true;
        return false;
    }

    acceptAvailable() {
        if (this.state.betState === 0 && this.state.originator !== web3.eth.accounts[0])
            return true;
        return false;
    }

    resolveBet() {
        window.contract.resolveBet(this.state.id, (err, res) => {
            if (!err) {
                console.log(res);
                this.props.addTxHash(res);
            } else {
                console.log(err);
            }
        })
    }

    acceptBet() {
        window.contract.acceptBet(this.state.id, {from: web3.eth.accounts[0], value: this.state.counterpartyBet}, (err,res) => {
            if (!err) {
                console.log(res);
                this.props.addTxHash(res);
            } else {
                console.log(err);
            }
        })
    }

    render() {
        if (
            (!this.state.closedToggle && this.state.betState === 4)
            || (this.state.onlyMyBetsToggle && this.state.originator !== web3.eth.accounts[0] && this.state.counterparty !== web3.eth.accounts[0]))
            return null;
        return (
            <TableRow>
                <TableRowColumn>{this.state.stateArray[this.state.betState]}</TableRowColumn>
                <TableRowColumn>{web3.fromWei(this.state.originatorBet, "ether")} ETH</TableRowColumn>
                <TableRowColumn>{web3.fromWei(this.state.counterpartyBet, "ether")} ETH</TableRowColumn>
                <TableRowColumn>{this.dateString(this.state.targetTimestamp*1000)}</TableRowColumn>
                <TableRowColumn>${(this.state.targetPrice / 100).toFixed(2)}</TableRowColumn>
                <TableRowColumn>{this.state.bettingHigher ? 'Higher' : 'Lower'}</TableRowColumn>
                <TableRowColumn>
                    {this.state.betState !== 4
                    ? this.secondsToString(this.state.targetTimestamp, this.state.currentBlockTime)
                    : null}
                </TableRowColumn>
                <TableRowColumn>
                    {this.state.resolvedPrice !== 0
                    ? '$' + (this.state.resolvedPrice / 100).toFixed(2)
                    : null}
                </TableRowColumn>
                <TableRowColumn>
                    {this.acceptAvailable()
                    ? <FlatButton label="Accept" primary={true} onClick={() => this.acceptBet()} />
                    : null }
                </TableRowColumn>
                <TableRowColumn>
                    {this.cancelAvailable()
                    ? <FlatButton label="Cancel" secondary={true} onClick={() => this.cancel()} />
                    : null }
                </TableRowColumn>
                <TableRowColumn>
                    {this.resolveAvailable()
                    ? <FlatButton label="Resolve" primary={true} onClick={() => this.resolveBet()} />
                    : null}
                </TableRowColumn>
            </TableRow>
        )
    }
}

class BetTable extends React.Component {
    constructor() {
        super();
        this.state = {
            numBets: 0,
            bets: [],
            betRefs: [],
            currentBlockTime: 10,
            lastPriceUpdateTimestamp: 10,
            closedToggle: false,
            onlyMyBetsToggle: false
        };

        this.handleClosedToggle = this.handleClosedToggle.bind(this);
        this.handleMyBetsToggle = this.handleMyBetsToggle.bind(this);
        
        window.contract.numBets((err, res) => {
            this.setState({numBets: res.toNumber()});
            this.initBets(res.toNumber());
        })

        window.contract.updatedBet((err, res) => {
            var betId = res.args.betId.toNumber();
            if (betId >= this.state.numBets && this.state.numBets > 0) {
                this.state.bets.push(<BetRow key={betId} id={betId} ref={(ref) => this.state.betRefs.push(ref)} 
                        lastPriceUpdateTimestamp = {this.state.lastPriceUpdateTimestamp}
                        currentBlockTime = {this.state.currentBlockTime}    
                        closedToggle = {this.state.closedToggle}
                        addTxHash = {this.props.addTxHash}
                    />);
                window.contract.numBets((err, res) => {
                    this.setState({numBets: res.toNumber()});
                })
            } else {
                var betRef = this.state.betRefs[betId];
                if (betRef !== undefined)
                    betRef.updateState();
            }    
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentBlockTime !== undefined && nextProps.lastPriceUpdateTimestamp !== undefined)
            this.setState({currentBlockTime: nextProps.currentBlockTime, lastPriceUpdateTimestamp: nextProps.lastPriceUpdateTimestamp});
            this.state.betRefs.forEach((ref) => {
                ref.updateTimestamps(nextProps.currentBlockTime, nextProps.lastPriceUpdateTimestamp);
            });
    }

    initBets(numBets) {
        for (var i = 0; i < numBets; i++) {
            this.state.bets.push(<BetRow key={i} id={i} ref={(ref) => this.state.betRefs.push(ref)} 
                currentBlockTime={this.state.currentBlockTime}
                lastPriceUpdateTimestamp={this.state.lastPriceUpdateTimestamp} 
                closedToggle={this.state.closedToggle} 
                addTxHash={this.props.addTxHash} />);
        }
    }

    handleClosedToggle(event, toggle) {
        this.setState({closedToggle: toggle});
        this.state.betRefs.forEach((ref) => {
            ref.updateClosedToggle(toggle);
        })
    }

    handleMyBetsToggle(event, toggle) {
        this.setState({onlyMyBetsToggle: toggle});
        this.state.betRefs.forEach((ref) =>{
            ref.updateMyBetsToggle(toggle);
        })
    }

    render() {
        return (
            <Paper>
                <Flexbox flexDirection="column">
                    <Flexbox className="headerBar">
                        <h3>Bets</h3>
                    </Flexbox>
                    <Flexbox width="100%" alignItems="center" justifyContent="space-around">
                        <AddNewBet addTxHash={this.props.addTxHash} />
                        <Flexbox>
                            <Toggle label="Display closed bets" labelPosition="right" onToggle={this.handleClosedToggle} />
                        </Flexbox>
                        <Flexbox>
                            <Toggle label="Only display my bets" labelPosition="right" onToggle={this.handleMyBetsToggle} />
                        </Flexbox>
                    </Flexbox>
                    <Flexbox>
                        <Table selectable={false}>
                            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn>State</TableHeaderColumn>
                                    <TableHeaderColumn>Originator Bet</TableHeaderColumn>
                                    <TableHeaderColumn>Counterparty Bet</TableHeaderColumn>
                                    <TableHeaderColumn>Target Date</TableHeaderColumn>
                                    <TableHeaderColumn>Target Price</TableHeaderColumn>
                                    <TableHeaderColumn>Bet Direction</TableHeaderColumn>
                                    <TableHeaderColumn>Countdown</TableHeaderColumn>
                                    <TableHeaderColumn>Resolved Price</TableHeaderColumn>
                                    <TableHeaderColumn>Accept</TableHeaderColumn>
                                    <TableHeaderColumn>Cancel</TableHeaderColumn>
                                    <TableHeaderColumn>Resolve</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {this.state.bets}
                            </TableBody>
                        </Table>
                    </Flexbox>  
                </Flexbox>
            </Paper>
        );
    }
}

class AddNewBet extends React.Component {
    constructor() {
        super();
        this.state = {
            myBetAmount: '',
            counterpartyBetAmount: '',
            targetPrice: '',
            betHigher: true,
            targetDate: null,
            targetTime: null,
            createOpen: false
        };

        this.handleBetDirectionChange = this.handleBetDirectionChange.bind(this);
        this.handleMyBetAmountChange = this.handleMyBetAmountChange.bind(this);
        this.handleCounterPartyBetAmountChange = this.handleCounterPartyBetAmountChange.bind(this);
        this.handleTargetPriceChange = this.handleTargetPriceChange.bind(this);
        this.handleTargetDateChange = this.handleTargetDateChange.bind(this);
        this.handleTargetTimeChange = this.handleTargetTimeChange.bind(this);
    }

    isSubmitDisabled() {
        if (
            (this.state.myBetAmount !== '' && isFinite(this.state.myBetAmount))
            && (this.state.counterpartyBetAmount !== '' && isFinite(this.state.counterpartyBetAmount))
            && (this.state.targetPrice !== '' && isFinite(this.state.targetPrice))
            && (this.state.targetDate !== null)
            && (this.state.targetTime !== null)
        ) return false;
        return true;
    }

    handleCreateOpen() {
        this.setState({createOpen: true});
    }
    handleCreateClose() {
        this.setState({createOpen: false});
    }
    handleTargetTimeChange(event, date) {
        this.setState({targetTime: date});
    }
    handleTargetDateChange(event, date) {
        this.setState({targetDate: date});
    }
    handleTargetPriceChange(event) {
        this.setState({targetPrice: event.target.value});
    }
    handleCounterPartyBetAmountChange(event) {
        this.setState({counterpartyBetAmount: event.target.value});
    }
    handleMyBetAmountChange(event) {
        this.setState({myBetAmount: event.target.value});
    }
    handleBetDirectionChange(event, index, value) {
        this.setState({betHigher: value});
    }

    submitNewBet() {
        var ts = moment(this.state.targetDate);
        ts.set({
            'hour': this.state.targetTime.getHours(),
            'minute': this.state.targetTime.getMinutes(),
            'second': this.state.targetTime.getSeconds()
        });

        window.contract.createBet(web3.toWei(this.state.myBetAmount, "ether"), web3.toWei(this.state.counterpartyBetAmount, "ether"),
            ts.unix(), parseInt(this.state.targetPrice * 100, 10), this.state.betHigher, {value: web3.toWei(this.state.myBetAmount, "ether")}, (err, res) => {
                if (!err) {
                    console.log(res);
                    this.setState({createOpen: false});
                    this.props.addTxHash(res);
                } else {
                    console.log(err);
                }
            });
    }

    render() {
        const createActions = [
            <FlatButton label="Submit" disabled={this.isSubmitDisabled()} onClick={() => this.submitNewBet()}/>,
            <FlatButton label="Cancel" onClick={() => this.handleCreateClose()} />
        ];
        return (
            <Flexbox>
                <Flexbox margin="10px" alignItems="center" paddingLeft="10px">
                    <FloatingActionButton mini={true} onClick={() => this.handleCreateOpen()}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <Flexbox paddingLeft="10px">
                        <h4>Add new bet</h4>
                    </Flexbox>
                </Flexbox>
                <Dialog
                    title="Add new bet"
                    actions={createActions}
                    modal={false}
                    open={this.state.createOpen}
                    onRequestClose={() => this.handleCreateClose()}
                >
                    <Flexbox flexDirection="column">
                        <Flexbox justifyContent="space-between">
                            <h4>I want to bet this amount of ether:</h4>
                            <TextField 
                                id="myBetAmount"
                                hintText={this.state.myBetAmount === ''
                                    ? "Your bet"
                                    : null}
                                errorText={isFinite(this.state.myBetAmount)
                                    ? null
                                    : "Must be a number"}
                                value={this.state.myBetAmount}
                                onChange={this.handleMyBetAmountChange}
                            />
                        </Flexbox>
                        <Flexbox justifyContent="space-between">
                            <h4>...against this amount of ether:</h4>
                            <TextField
                                id="counterpartyBetAmount"
                                hintText={this.state.counterpartyBetAmount === ''
                                    ? "Counterparty's required bet"
                                    : null}
                                errorText={isFinite(this.state.counterpartyBetAmount)
                                    ? null
                                    : "Must be a number"}
                                value={this.state.counterpartyBetAmount}
                                onChange={this.handleCounterPartyBetAmountChange}
                            />
                        </Flexbox>
                        <Flexbox justifyContent="space-between">
                            <h4>I am betting that the price will be:</h4>
                            <SelectField
                                value={this.state.betHigher}
                                onChange={this.handleBetDirectionChange}
                            >
                                <MenuItem value={true} primaryText="Higher" />
                                <MenuItem value={false} primaryText="Lower" />
                            </SelectField>
                        </Flexbox>
                        <Flexbox justifyContent="space-between">
                            <h4>...than this price:</h4>
                            <TextField
                                id="targetPrice"
                                hintText={this.state.targetPrice === ''
                                    ? "Target price"
                                    : null}
                                errorText={isFinite(this.state.targetPrice)
                                    ? null
                                    : "Must be a number"}
                                value={this.state.targetPrice}
                                onChange={this.handleTargetPriceChange}
                            />
                        </Flexbox>
                        <Flexbox justifyContent="space-between">
                            <h4>...on this date:</h4>
                            <DatePicker 
                                id="targetDatePicker"
                                hintText={this.state.targetDate === null
                                    ? "Select date"
                                    : null} 
                                container="inline"
                                value={this.state.targetDate}
                                onChange={this.handleTargetDateChange}
                            />
                        </Flexbox>
                        <Flexbox justifyContent="space-between">
                            <h4>...at this time (in your timezone):</h4>
                            <TimePicker 
                                id="targetTimePicker"
                                hintText={this.state.targetTime === null
                                    ? "Select time"
                                    : null}
                                value={this.state.targetTime}
                                onChange={this.handleTargetTimeChange}
                                minutesStep={5} 
                            />
                        </Flexbox>
                    </Flexbox>
                </Dialog>
            </Flexbox>
        )
    }
}

class Price extends React.Component {
    constructor() {
        super();
        this.state = {
            oracleTimeInterval: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentBlockTime !== undefined && nextProps.lastPriceUpdateTimestamp !== undefined)
            this.setState({oracleTimeInterval: this.secondsToString(nextProps.currentBlockTime, nextProps.lastPriceUpdateTimestamp)});
    }
    
    updateOracle() {
        window.contract.oraclePrice((err, res) => {
            window.contract.updatePrice({ value: res, from: web3.eth.accounts[0] }, (err, res) => {
                if (!err) {
                    console.log(res);
                    this.props.addTxHash(res);
                } else {
                    console.log(err);
                }
            });
        })
    }

    secondsToString(time1, time2)
    {
        var seconds = time1 - time2;
        var numdays = Math.floor(seconds / 86400);
        var numhours = Math.floor((seconds % 86400) / 3600);
        var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
        var numseconds = ((seconds % 86400) % 3600) % 60;
        var resultString = ""
        if (numdays > 0) resultString += numdays + "d ";
        if (numhours > 0) resultString += numhours + "h ";
        if (numminutes > 0) resultString += numminutes + "m ";
        if (numseconds > 0) resultString += numseconds + "s";
        if (resultString === "") {
            resultString = "Up to date"
        } else {
            resultString += " ago";
        }
        return resultString;
    }

    render() {
        return(
            <Paper> 
                <Flexbox flexDirection="column">
                    <Flexbox className="headerBar">
                        <h3>Oracle Price</h3>
                    </Flexbox>
                    <Flexbox justifyContent="center">
                        <h1>${(this.props.ethUSD / 100).toFixed(2)}</h1>
                    </Flexbox>
                    <Flexbox justifyContent="center" padding="0px 10px 0px 10px">
                        <RaisedButton label="Update" primary={true} onClick={() => this.updateOracle()} />
                    </Flexbox>
                    <Flexbox padding="10px">
                        <Divider width="100%" />
                    </Flexbox>
                    {this.props.oracleIsUpdating ?
                        <Flexbox justifyContent="center">
                            <Spinner name="three-bounce" /><br></br>
                        </Flexbox>
                    :   <Flexbox paddingLeft="10px">
                            Last updated:
                        </Flexbox>
                    }
                    {this.props.oracleIsUpdating ?
                        <Flexbox padding="10px">
                            Oracle is updating, please wait...
                        </Flexbox>
                    : null}
                    {!this.props.oracleIsUpdating ?
                        <Flexbox paddingLeft="10px">
                            <h3>{this.state.oracleTimeInterval}</h3>
                        </Flexbox>
                    : null}
                </Flexbox>
            </Paper>
        );
    }
}

class TransactionSpinner extends React.Component {
    render() {
        return (
            <Flexbox justifyContent="space-around">
                <Flexbox>
                    <Spinner name="chasing-dots" /> <br />
                </Flexbox>
                <Flexbox paddingLeft="10px">
                    {this.props.txs} transactions pending, please wait...
                </Flexbox>
            </Flexbox>
        )
    }
}

class PendingTransactions extends React.Component {
    render() {
        return (
            <Paper> 
                <Flexbox flexDirection="column">
                    <Flexbox className="headerBar" paddingRight="60px">
                        <h3>Pending Transactions</h3>
                    </Flexbox>
                    <Flexbox padding="10px 10px 10px 10px">
                        { this.props.txHashes.length > 0 
                        ? <TransactionSpinner txs={this.props.txHashes.length} />
                        : "No transactions pending"}
                    </Flexbox>
                </Flexbox>
            </Paper>  
        )
    }
}

class EthBetter extends React.Component {
    constructor(props) {
        super(props);

        const rinkebyAddress = "0xba9907c3803f9fb73e3681425a9b6937d364e4b4";
        const mainNetAddress = "0xdcca8fa09bec1205ea2946b5fa466d72123b70f8";
        var contractAddress = ""

        if (this.props.networkId === 4) 
            contractAddress = rinkebyAddress;
        if (this.props.networkId === 1)
            contractAddress = mainNetAddress;

        window.contract = web3.eth.contract(contractAbi).at(contractAddress);
        
        this.state = {
            ethUSD: 0,
            lastPriceUpdateTimestamp: 0,
            oraclizeGasLimit: 0,
            oracleIsUpdating: false,
            isShutdown: false,
            currentBlockTime: 0,
            helpOpen: false,
            txHashes: [],
            contractAddress: contractAddress,
            lastProof: ""
        };

        this.addTxHash = this.addTxHash.bind(this);
        
        var lastestBlockFilter = web3.eth.filter('latest');
        lastestBlockFilter.watch((err, res) => {
            var id = setInterval(() => {
                web3.eth.getBlock(res, (err, res) => {
                    if (!err && res != null) {
                        this.setState({currentBlockTime: res.timestamp});
                        var newTxHashes = this.state.txHashes;
                        res.transactions.forEach((blockHash) => {
                            for (var i = 0; i < this.state.txHashes.length; i++) {
                                if (blockHash === this.state.txHashes[i]) {
                                    newTxHashes.splice(i, 1);
                                    break;
                                }
                            }
                        })
                        clearInterval(id);
                        this.setState({txHashes: newTxHashes});
                    }
                })
            }, 2000)
        });

        window.contract.updatedPrice((err, res) => {
            this.updateContractState();
        })

        window.contract.priceQuerySent((err, res) => {
            this.updateContractState();
        })

        setInterval(() => {
            web3.version.getNetwork((err, res) => {
                if (parseInt(res,10) !== this.props.networkId)
                    window.location.reload();
            })
        }, 3000);
    }

    updateContractState() {
        window.contract.ETHUSD((err, res) => {
            this.setState({ethUSD: res.toNumber()});
        });
        window.contract.lastPriceUpdateTimestamp((err, res) => {
            this.setState({lastPriceUpdateTimestamp: res.toNumber()});
        });
        window.contract.oraclizeGasLimit((err, res) => {
            this.setState({oraclizeGasLimit: res.toNumber()});
        });
        window.contract.isShutdown((err, res) => {
            this.setState({isShutdown: res});
        });
        window.contract.oracleIsUpdating((err, res) => {
            this.setState({oracleIsUpdating: res});
        })
        window.contract.lastProof((err, res) => {
            var bytes = Buffer.from(res.substr(2), 'hex');
            var proofString = bs58.encode(bytes);
            this.setState({lastProof: proofString});
        })
        web3.eth.getBlock('latest', (err, res) => {
            this.setState({currentBlockTime: res.timestamp});
        })
    }
  
    componentDidMount() {
        this.updateContractState();
    }

    handleHelpOpen() {
        this.setState({helpOpen: true});
    }

    handleHelpClose() {
        this.setState({helpOpen: false});
    }

    addTxHash(txHash) {
        this.setState({txHashes: this.state.txHashes.concat([txHash])});
    }

    render() {
        const helpActions = [
            <FlatButton label="OK" onClick={() => this.handleHelpClose()} />
        ];
      return (
        <MuiThemeProvider>
            <Flexbox flexDirection="column">
                <Flexbox paddingLeft="10px" alignItems="flex-end">
                    <h1>EthBetter</h1>
                    <Flexbox paddingLeft="60px" paddingBottom="4px">
                    <h4>Keeping bears and moonkids accountable since 2017.</h4>
                    </Flexbox>
                </Flexbox>
                <Flexbox margin="10px">
                    <Flexbox>
                        <GenInfo lastProof={this.state.lastProof} contractAddress={this.state.contractAddress} networkId={this.props.networkId} />
                    </Flexbox>
                    <Flexbox paddingLeft="20px">
                        <PendingTransactions txHashes={this.state.txHashes} />
                    </Flexbox>
                </Flexbox>
                <Flexbox>
                    <Flexbox flexDirection="column" margin="10px" width="15%" maxWidth="140px" minWidth="140px">
                        <Price 
                            ethUSD = {this.state.ethUSD}
                            lastPriceUpdateTimestamp = {this.state.lastPriceUpdateTimestamp}
                            currentBlockTime = {this.state.currentBlockTime}
                            oracleIsUpdating = {this.state.oracleIsUpdating}
                            addTxHash = {this.addTxHash}
                        />
                        <Withdraw addTxHash = {this.addTxHash} />
                        <Flexbox flexDirection="column" paddingTop="20px">
                            <RaisedButton label="Help" onClick={()=> this.handleHelpOpen()} />
                            <Dialog
                                title="EthBetter Help"
                                actions={helpActions}
                                modal={false}
                                open={this.state.helpOpen}
                                autoScrollBodyContent={true}
                                onRequestClose={() => this.handleHelpClose()}
                            >
                                <HelpText />
                            </Dialog>
                        </Flexbox>
                    </Flexbox>
                    <Flexbox flexDirection="column" margin="10px" width="100%" minWidth="1400px">
                        <BetTable 
                            lastPriceUpdateTimestamp = {this.state.lastPriceUpdateTimestamp}
                            currentBlockTime = {this.state.currentBlockTime}
                            addTxHash = {this.addTxHash}
                        />
                    </Flexbox>
                </Flexbox>
            </Flexbox>
        </MuiThemeProvider>
      );
    }
}

class HelpText extends React.Component {
    render() {
        return (
            <Flexbox flexDirection="column">
                <p>
                Tired of making bets on the Ether price, only to have your opponent disappear when it comes time to pay?
                Want an easy way to get moon spammers and FUDsters alike to put their money where their mouth is?
                EthBetter's here, and it's got you covered.
                </p>
                <p>
                EthBetter is a zero-fee, smart contract-enabled platform that allows you to place bets on the future price of Ether.
                You can put a certain amount of ether at stake, and request that others post a certain amount of ether to accept the bet.
                As an example, maybe you want 10-to-1 odds that the price will hit $1k next month - EthBetter allows you to do this.
                </p>
                <p>
                Once the bet's time limit has elapsed, you can request a price update from the oracle - all bets require an up-to-date
                price feed before allowing you to resolve them. Once this is taken care of, you can click "Resolve" to finish the bet.
                If you bet right, congrats, you've just won a bunch of Ether! If not, well, better luck next time.
                </p>
                <p>
                Use the bet table toggles to switch between viewing completed bets or not. You can also use the "Show only my bets"
                toggle to show only bets in which you are involved (as an originator or a counterparty). Turn this switch off to see
                if there's any already existing bets that you'd like to accept!
                </p>
                <p>
                The EthBetter contracts are posted and verified on EtherScan, so you can check the source code for yourself.
                EthBetter uses Oraclize to provide a secure price feed, using Coinbase's GDAX API to get the current USD price of
                ether. You can use Oraclize's web tool to verify the validity of their TLSNotary proofs in real time,
                or download the latest price update proof from IPFS and use their <a href="https://github.com/oraclize/proof-verification-tool">proof verification tool</a> to verify the proof yourself.
                </p>
                <p>
                You can cancel a bet that you've placed. If no one has accepted your bet yet, then you will be refunded the full amount.
                If someone has accepted your bet (or if you've accepted someone else's), then cancellation will require both parties
                to cancel. In this case, each party will be refunded the amount that they've bet.
                </p>
                <p>
                All winnings and cancellation refunds will be stored in your balance, visible in the "Withdraw" window. To claim your
                ether, click the "Withdraw" button.
                </p>
                <p>
                In the event that the API endpoint used for the price feed becomes unusable, or if an exploit of the EthBetter smart contract
                is discovered, the betting smart contract will be shut down. If this happens, bets can only be canceled, not resolved. No new
                bets will be able to be placed. Withdrawals will still work as normal.
                </p>
                <p>
                Remember to set your gas price appropriately - using the default of 20 GWei can cost you significantly more than you need
                to spend! Use <a href="http://ethgasstation.info/">ETH Gas Station</a> to see what the current safe minimum gas price is.
                </p>
                <p>
                As mentioned, this is a zero-fee offering - no ICO's, no 1% to the owner, none of that. This is my gift to the community
                - have fun!
                </p>
            </Flexbox>
        )
    }
}

class CheckNetwork extends React.Component {
    constructor() {
        super();
        this.state = {
            networkId: null
        }

        web3.version.getNetwork((err, res) => {
            this.setState({networkId: parseInt(res, 10)});
        })
    }

    render() {
        if (this.state.networkId !== null) {
            if (this.state.networkId === 1 || this.state.networkId === 4) {
                return (
                    <EthBetter networkId={this.state.networkId} />
                )
            } else {
                return (
                    <MuiThemeProvider>
                        <Flexbox flexDirection="column" width="100%">
                            <Paper>
                                <Flexbox flexDirection="column">
                                    <Flexbox className="headerBar" paddingRight="60px">
                                        <h1>EthBetter - Error</h1>
                                    </Flexbox>
                                    <Flexbox padding="10px 10px 10px 10px" justifyContent="center">
                                        <h2>This application is not available on the chosen network</h2>
                                    </Flexbox>
                                    <Flexbox padding="10px 10px 10px 10px" justifyContent="center">
                                    <h3>This application is only available on the Ethereum mainnet and the Rinkeby test network.
                                        Please choose one of these networks with your web3 provider (e.g., Metamask) and refresh the page.
                                    </h3>
                                    </Flexbox>
                                </Flexbox>
                            </Paper>
                        </Flexbox>
                    </MuiThemeProvider>
                )
            }
        }

        return (
            <Flexbox>
                <h1>Loading...</h1>
            </Flexbox>
        )
    }
}

class NotUnlocked extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Flexbox flexDirection="column" width="100%" alignItems="center" display="flex" justifyContent="center">
                    <Paper width="100%">
                        <Flexbox flexDirection="column" width="100%" alignItems="stretch">
                            <Flexbox className="headerBar" paddingRight="60px">
                                <h1>EthBetter - Error</h1>
                            </Flexbox>
                            <Flexbox padding="30px 30px 30px 30px" justifyContent="center">
                                <img src={require('./metamask_locked.svg')} alt="welp" />
                            </Flexbox>
                            <Flexbox padding="10px 10px 10px 10px">
                                <Divider width="100%" />
                            </Flexbox>
                            <Flexbox padding="10px 10px 10px 10px" justifyContent="center">
                                <h2>Metamask is locked</h2>
                            </Flexbox>
                            <Flexbox padding="10px 10px 10px 10px" justifyContent="center">
                                <h3>Unlock your account in Metamask to continue</h3>
                            </Flexbox>
                        </Flexbox>
                    </Paper>
                </Flexbox>
            </MuiThemeProvider>
        )
    }
}

class NoWeb3 extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Flexbox flexDirection="column" width="100%">
                    <Paper>
                        <Flexbox flexDirection="column">
                            <Flexbox className="headerBar" paddingRight="60px">
                                <h1>EthBetter - Error</h1>
                            </Flexbox>
                            <Flexbox padding="10px 10px 10px 10px" justifyContent="center">
                                <h2>EthBetter requires a Web3 provider</h2>
                            </Flexbox>
                            <Flexbox padding="10px 10px 10px 10px" justifyContent="center">
                                <h3>Connect using Mist or Parity, or use Chrome with <a href="https://metamask.io/">Metamask</a></h3>
                            </Flexbox>
                        </Flexbox>
                    </Paper>
                </Flexbox>
            </MuiThemeProvider>
        )
    }
}

class CheckUnlock extends React.Component {
    render() {
        const isAccountDefined = (typeof web3.eth.accounts[0] !== "undefined");

        return (
            <Flexbox>
                { isAccountDefined
                ? <CheckNetwork />
                : <NotUnlocked /> }
            </Flexbox>
        )
    }
}

class Web3Check extends React.Component {
    render() {
        const isWeb3Defined = (typeof web3 !== "undefined");

        return (
            <Flexbox>
                { isWeb3Defined
                ? <CheckUnlock />
                : <NoWeb3 /> }
            </Flexbox>
        )
    }
}

setTimeout(() => {
    ReactDOM.render(
        <Web3Check />,
        document.getElementById('root')
    );
}, 1000);