pragma solidity ^0.4.11;
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract EthBetter is usingOraclize {
    uint public ETHUSD;
    uint public lastPriceUpdateTimestamp;
    uint public numBets;
    uint public oraclizeGasLimit;
    bool public isShutdown;
    bool public oracleIsUpdating;
    bytes public lastProof;
    address owner;
    
    mapping (bytes32 => bool) validIds;
    mapping (uint => bet) public bets;
    mapping (address => uint) public balances;
    
    enum betState { Created, CounterpartyAccepted, OriginatorCanceled, CounterpartyCanceled, Closed }
    
    struct bet {
        betState state;
        address originator;
        address counterparty;
        uint originatorBet;
        uint counterpartyBet;
        uint targetTimestamp;
        uint targetPrice;
        uint resolvedPrice;
        bool bettingHigher;
    }
    
    event priceQuerySent();
    event updatedPrice();
    event updatedBet(uint betId);
    event updatedBalance();
    
    modifier betExists(uint betId) {
        if (betId >= numBets)
            revert();
        _;
    }
    
    modifier onlyOwner() {
        if (msg.sender != owner)
            revert();
        _;
    }
    
    modifier isNotShutdown() {
        if (isShutdown)
            revert();
        _;
    }

    function EthBetter() {
        owner = msg.sender;
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        oraclizeGasLimit = 200000;
        // Default gas price to 10 GWei
        oraclize_setCustomGasPrice(10000000000 wei);
    }
    
    function setOraclizeGasprice(uint gasPrice) public onlyOwner {
        // Gasprice greater than 4 GWei and less than 30 GWei
        if (gasPrice > 4000000000 wei && gasPrice < 30000000000 wei)
            oraclize_setCustomGasPrice(gasPrice);
    }
    
    function setOraclizeGasLimit(uint gasLimit) public onlyOwner {
        if (gasLimit > 100000 && gasLimit < 500000)
            oraclizeGasLimit = gasLimit;
    }
    
    function shutdown() public onlyOwner {
        isShutdown = true;
    }

    function __callback(bytes32 queryId, string result, bytes proof) public {
        if (msg.sender != oraclize_cbAddress() || !validIds[queryId]) 
            revert();
        if (proof.length > 0) {
            lastProof = proof;
            ETHUSD = parseInt(result, 2);
            lastPriceUpdateTimestamp = now;
            updatedPrice();
        }
        oracleIsUpdating = false;
        delete validIds[queryId];
    }

    function updatePrice() public payable {
        if (oraclePrice() > msg.value) {
            revert();
        } else {
            bytes32 queryId =
                oraclize_query("URL", "json(https://api.gdax.com/products/ETH-USD/ticker).price", oraclizeGasLimit);
            validIds[queryId] = true;
            oracleIsUpdating = true;
            priceQuerySent();
        }
    }
    
    function oraclePrice() public constant returns(uint) {
        return oraclize_getPrice("URL", oraclizeGasLimit);
    }
    
    function createBet(uint originatorBet, uint counterpartyBet, uint targetTimestamp, uint targetPrice, bool bettingHigher) public payable isNotShutdown {
        if (msg.value < originatorBet)
            revert();
        bets[numBets] = bet(betState.Created, msg.sender, 0, originatorBet, counterpartyBet, targetTimestamp, targetPrice, 0, bettingHigher);
        updatedBet(numBets);
        numBets += 1;
    }
    
    function acceptBet(uint betId) public payable betExists(betId) isNotShutdown {
        bet storage curBet = bets[betId];
        if (msg.value < curBet.counterpartyBet)
            revert();
        curBet.counterparty = msg.sender;
        curBet.state = betState.CounterpartyAccepted;
        updatedBet(betId);
    }
    
    function closeBetByCanceling(uint betId) internal betExists(betId) {
        bet storage curBet = bets[betId];
        curBet.state = betState.Closed;
        balances[msg.sender] += curBet.originatorBet;
        balances[curBet.counterparty] += curBet.counterpartyBet;
        updatedBalance();
        updatedBet(betId);
    }
    
    function cancelBet(uint betId) public betExists(betId) {
        bet storage curBet = bets[betId];
        if (curBet.state == betState.Closed
            || (msg.sender != curBet.originator && msg.sender != curBet.counterparty))
            revert();
        if (isShutdown) {
            closeBetByCanceling(betId);
        } else {
            if (curBet.originator == msg.sender) {
                if (curBet.state == betState.Created) {
                    curBet.state = betState.Closed;
                    balances[msg.sender] += curBet.originatorBet;
                    updatedBalance();
                    updatedBet(betId);
                } else if (curBet.state == betState.CounterpartyAccepted) {
                    curBet.state = betState.OriginatorCanceled;
                    updatedBet(betId);
                } else if (curBet.state == betState.CounterpartyCanceled) {
                    closeBetByCanceling(betId);
                }
            } 
            if (curBet.counterparty == msg.sender) {
                if (curBet.state == betState.CounterpartyAccepted) {
                    curBet.state = betState.CounterpartyCanceled;
                    updatedBet(betId);
                } else if (curBet.state == betState.OriginatorCanceled) {
                    closeBetByCanceling(betId);
                }
            }
        }
    }
    
    function withdraw() public {
        var balance = balances[msg.sender];
        balances[msg.sender] = 0;
        updatedBalance();
        msg.sender.transfer(balance);
    }
    
    function resolveBet(uint betId) public betExists(betId) isNotShutdown {
        bet storage curBet = bets[betId];
        if (curBet.state == betState.Created 
            || curBet.state == betState.Closed
            || curBet.targetTimestamp > lastPriceUpdateTimestamp 
            || (msg.sender != curBet.originator && msg.sender != curBet.counterparty))
            revert();
        var totalBet = curBet.originatorBet + curBet.counterpartyBet;
        curBet.state = betState.Closed;
        curBet.resolvedPrice = ETHUSD;
        if (curBet.bettingHigher) {
            if (ETHUSD >= curBet.targetPrice) {
                balances[curBet.originator] += totalBet;
            } else {
                balances[curBet.counterparty] += totalBet;
            }
        } else {
            if (ETHUSD <= curBet.targetPrice) {
                balances[curBet.originator] += totalBet;
            } else {
                balances[curBet.counterparty] += totalBet;
            }
        }
        updatedBalance();
        updatedBet(betId);
    }
    
    function() public {
        revert();
    }
}