const Block = require('./Block.js')

class Blockchain {
    constructor () {
        this.blockchain = [];
    }

    create_genesis_block() {
        const block = new Block(0, Date.now(), {}, 0)
    }
}