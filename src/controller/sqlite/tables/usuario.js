'use strict'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

class Table {
    constructor() {
        this.schema = `.mydbsql`
        this.pathdatabase = path.join(__dirname, '../', this.schema)
        this.table = 'usuario'
    }

    Db() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.pathdatabase)

            const createTable = ` CREATE TABLE IF NOT EXISTS ${this.table} (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                user TEXT UNIQUE,
                                password TEXT
                            )`
            db.run(createTable, err => resolve(db))
        })
    }

    insert({ user, password }) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.run(`INSERT INTO ${this.table}(user, password) VALUES(?,?)`, [user, password], (err) => {
                    db.close()
                    if (err) reject(err)
                    else resolve({ table: this.table, user, message: `Inserido com sucesso` })
                })
            }).catch(error => reject(error))
        })
    }

    login({ user, password }) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.get(`SELECT * FROM ${this.table} WHERE user = ? AND password = ?`, [user, password], (err, rows) => {
                    db.close()
                    if (err) reject(err)
                    else resolve(rows)
                })
            }).catch(error => reject(error))
        })
    }

    update({ id, user, password }) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.run(`UPDATE ${this.table} SET user = ?, password = ? WHERE id = ?`, [user, password, id], (err) => {
                    db.close()
                    if (err) reject(err)
                    else resolve({ table: this.table, id, message: `Atualizado com sucesso` })
                })
            }).catch(error => reject(error))
        })
    }

    delete({ id }) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.run(`DELETE FROM ${this.table} WHERE id = ?`, [id], (err) => {
                    this.close
                    if (err) reject(err)
                    else resolve({ table: this.table, id, message: `Removido com sucesso` })
                })
            }).catch(error => reject(error))
        })
    }

    selectAll() {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.all(`SELECT * FROM ${this.table} ORDER BY id;`, [], (error, rows) => {
                    if (error) { console.error(error) }
                    resolve(rows)
                })
            }).catch(error => reject(error))
        })
    }

    selectWhere({ user, password }) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.all(`SELECT * FROM ${this.table} WHERE user=? AND password=? ORDER BY id;`, [user, password], (error, rows) => {
                    if (error) { console.error(error) }
                    resolve(rows)
                })
            })
        })
    }

}

module.exports = new Table