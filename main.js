const SHA256 = require('crypto-js/sha256')
const fs = require('fs')

// List of Voters and Candidates
const registered_voters = ["VOTER101", "VOTER102", "VOTER103", "VOTER104", "VOTER105"]
const candidates = ["Alice", "Bob", "Charlie"]


// Block Class
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
        // Setting Difficulty to 3
        const difficulty = 3

        // Flag -> Accomodates if hash starts with 3 (difficulty) zeros
        let result = 0

        while(!result) {

            // Turning off the flag
            result = 1;

            // Checking if we got the desired hash
            for ( let i = 0; i < difficulty; i++) {

                // If we didn't get the desired hash
                if (this.hash[i] !== '0') {

                    // Turning the flag on again
                    result = 0;

                    // Increasing the nonce
                    this.nonce++;

                    // Recalculating the hash
                    this.hash = this.calcHash()
                    
                    break;
                }
            }
        }
    }
}



// Blockchain Class
class Blockchain {

    constructor () {
        this.blockchain = [this.create_genesis_block()];
    }

    // Function to create genesis block
    create_genesis_block() {
        const block = new Block(0, Date.now(), {}, 0)
        return block
    }


    // Smart Contract
    validate_vote(voter_id, candidate) {
        // Checking if voter is present in the voting list
        const voter = registered_voters.filter(vID => vID === voter_id);
        if (!voter[0]) throw new Error("Voter is not registered in the voting list");

        // Checking if candidate is present in the candidate list
        const candi = candidates.filter(c => c === candidate);
        if (!candi[0]) throw new Error("Candidate is not present in the candidate list");

        // Checking if voter hasn't already cast a vote
        for ( let i = 1; i < this.blockchain.length; i++) {
            // Re-iterating the entire blockchain
            if (this.blockchain[i].voteData.voter_id === voter_id) throw new Error(`${voter_id} has already cast the vote`);
        }
    }


    // Function to add vote
    add_vote(voter_id, candidate) {

        // Checking if vote is valid
        this.validate_vote(voter_id, candidate);

        // Voting Data Object
        const voteDate = {
            'voter_id' : voter_id,
            'candidate' : candidate
        }

        // Getting the information of the last node in the blockchain
        const prevBlock = this.blockchain[this.blockchain.length -1];

        // Creating a new node
        const block = new Block(prevBlock.index + 1, Date.now(), voteDate, prevBlock.hash);

        // Mining the node
        block.mine();

        // Adding the node to the blockchain
        this.blockchain.push(block);
    }


    // Function to check if blockchain is valid or not
    is_valid() {

        // Initializing the list that remembers the casted votes
        let vote = {};
        for ( let i = 0; i < registered_voters.length; i++ ) {
            vote[registered_voters[i]] = 0;
        }

        /* Validity operations starts */

        for ( let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i-1];

            // Checking if block's hash is correct [This also ensures block data is not changed otherwise its hash will not match]
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
        // Ensuring the blockchain is valid
        if (!this.is_valid()) throw new Error("Error in voting system");

        // Initializing Candidates list
        const candi = {};
        candidates.forEach(person => candi[person] = 0);

        // Reading blockchain data
        for ( let i = 1; i < this.blockchain.length; i++ ) {
            candi[this.blockchain[i].voteData.candidate]++;
        }

        // Displaying the data
        for (const votes in candi) {
            console.log(`${votes} : ${candi[votes]} votes`);
        }

        return candi
    }

    // Election Result declaration
    declare_winner() {
        // Getting the counted votes
        const votes = this.count_votes();

        // Initializing the highest vote count
        let higest_votes = 0;

        // Getting the highest vote count
        for (const candi in votes) {
            if (higest_votes < votes[candi]) higest_votes = votes[candi] ;
        }

        // Intializing a array of candidates with higest votes
        const winner = [];

        // Pushing the name of candidate with highest votes in the array
        for (const candi in votes) {
            if (higest_votes === votes[candi]) winner.push(candi)
        }

        // Checking if there is a tie or not
        if (winner.length === 1) console.log(`\nElection Winner : ${winner[0]} with ${higest_votes} votes`);
        else console.log("\nThe election is tied");
    }


    save_chain() {
        // Converting it into JSON string
        const jsonChain = JSON.stringify(this.blockchain);
        // Saving file using fs module
        fs.writeFileSync('data.json', jsonChain);

        console.log("File Saved")
    }

    load_chain() {
        // Checking if the file exist for loading the data
        if ( !fs.existsSync('data.json') ) throw new Error("File does not exist");


        const data = fs.readFileSync('data.json');
        const jsonChain = JSON.parse(data);
        this.blockchain = jsonChain

        console.log("File Loaded")
    }

}


const blockchain = new Blockchain;

// Adding the votes
blockchain.add_vote("VOTER101", "Alice");
blockchain.add_vote("VOTER102", "Bob")
blockchain.add_vote("VOTER103", "Charlie")
blockchain.add_vote("VOTER104", "Bob")
blockchain.add_vote("VOTER105", "Charlie")

//blockchain.declare_winner()
blockchain.load_chain()

//console.log(JSON.stringify(blockchain.blockchain, null, 4))