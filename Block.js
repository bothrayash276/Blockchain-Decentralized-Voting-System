const SHA256 = require('crypto-js/sha256')

class Block {
    constructor (index, timestamp, voteData, prevHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.voteData = voteData;
        this.prevHash = prevHash
        this.nonce = 0
        this.hash = calcHash()
    }

    // Hash Constructor
    calcHash() {
        return SHA256(this.index + this.timestamps + JSON.stringify(this.voteData) + this.prevHash + this.nonce).toString()
    }

    // Proof of Time
    mine(difficulty) {
        const result = 0
        while(!result) {
            result = 1;
            for ( let i = 0; i < difficulty; i++) {
                if (this.hash[i] !== '0') {
                    result = 0;
                    this.nonce++;
                    this.hash = calcHash();
                    break;
                }
            }
        }
    }
}

module.exports.Block = Block;