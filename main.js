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
        this.hash = 0
    }

    // Hash Constructor
    calcHash() {
        return SHA256(this.index + this.timestamps + JSON.stringify(this.voteData) + this.prevHash + this.nonce).toString()
    }

    // Proof of Time
    mine() {
        const difficulty = 3
        let result = 0
        while(!result) {
            result = 1;
            for ( let i = 0; i < difficulty; i++) {
                if (this.hash[i] !== '0') {
                    result = 0;
                    this.nonce++;
                    this.hash = this.calcHash()
                    
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

        if (!voter[0]) throw new Error("Voter is not registered in the voting list");
        if (!candi[0]) throw new Error("Candidate is not present in the candidate list");

        for ( let i = 1; i < this.blockchain.length; i++) {
            if (this.blockchain[i].voteData.voter_id === voter_id) throw new Error(`${voter_id} has already cast the vote`);
        }

        const voteDate = {
            'voter_id' : voter_id,
            'candidate' : candidate
        }

        const prevBlock = this.blockchain[this.blockchain.length -1];
        const block = new Block(prevBlock.index + 1, Date.now(), voteDate, prevBlock.hash);
        block.mine();
        this.blockchain.push(block);
    }


    is_valid() {

        // Initialized voters list
        let vote = {};
        for ( let i = 0; i < registered_voters.length; i++ ) {
            vote[registered_voters[i]] = 0;
        }

        for ( let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i-1];

            // Checking if block's hash is correct [This also ensures block data is not changed]
            if (currentBlock.hash !== currentBlock.calcHash()) return false;

            // Previous Hash matches with hash of previous block
            if (currentBlock.prevHash !== previousBlock.hash) return false;

            // Incrementing Number of votes
            vote[currentBlock.voteData.voter_id]++;
        }

        // Checking number of votes is less have 2
        for (const voter in vote) {
            if(vote[voter] >= 2) return false;
        }

        return true;
    }


    count_votes() {
        if (!this.is_valid()) throw new Error("Error in voting system");

        // Initializing Candidates list
        const candi = {};
        candidates.forEach(person => cand[person] = 0);

        this.blockchain.forEach( vote => {
            candi[vote.voteData.candidate]++;
        })

        for (const votes in candi) {
            console.log(`${votes} : ${candi[votes]} votes\n`);
        }

        return candi
    }

}


const blockchain = new Blockchain;

blockchain.add_vote("VOTER101", "Alice");
blockchain.add_vote("VOTER102", "Bob")
blockchain.add_vote("VOTER103", "Charlie")
blockchain.add_vote("VOTER104", "Bob")
blockchain.add_vote("VOTER105", "Bob")

blockchain.count_votes()

//console.log(JSON.stringify(blockchain.blockchain, null, 4))