class Database {
    constructor() {
        this.usuario = require('./tables/usuario')
    }
}

module.exports = new Database