const SHA256 = require('crypto-js/sha256')

const registered_voters = ["VOTER101", "VOTER102", "VOTER103", "VOTER104", "VOTER105"]
const candidates = ["Alice", "Bob", "Charlie"]

class Block {
    constructor (index, timestamp, voteData, prevHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.voteData = voteData;
        this.prevHash = prevHash
        this.nonce = 0
        this.hash = this.calcHash()
    }

    // Hash Constructor
    calcHash() {
        return SHA256(this.index + this.timestamps + JSON.stringify(this.voteData) + this.prevHash + this.nonce).toString()
    }

    // Proof of Time
    mine() {
        const result = 0
        while(!result) {
            result = 1;
            for ( let i = 0; i < 4; i++) {
                if (this.hash[i] !== '0') {
                    result = 0;
                    this.nonce++;
                    this.hash = this.calcHash();
                    break;
                }
            }
        }
    }
}


class Blockchain {
    constructor () {
        this.blockchain = [this.create_genesis_block()];
    }

    create_genesis_block() {
        const block = new Block(0, Date.now(), {}, 0)
        return block
    }

    add_vote(voter_id, candidate) {
        const voter = registered_voters.filter(vID => vID === voter_id);
        const candi = candidates.filter(c => c === candidate);

        if (!voter) throw new Error("Voter is not registered in the voting list");
        if (!candi) throw new Error("Candidate is not present in the candidate list");

        for ( let i = 1; i < this.blockchain.length; i++) {
            if (this.blockchain[i].voteData.voter_id === voter_id) throw new Error(`${voter_id} has already cast the vote`);
        }

        const voteDate = {
            'voter_id' : voter_id,
            'candidate' : candidate
        }

        const prevBlock = this.blockchain[this.blockchain.length -1];
        const block = new Block(prevBlock.index + 1, Date.now(), voteDate, prevBlock.hash);
        block.hash = block.mine();

        this.blockchain.push(block);
    }
}