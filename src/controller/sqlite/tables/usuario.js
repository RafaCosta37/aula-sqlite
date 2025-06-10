'use strict'

const sqlite3 = require('sqlite3').verbose()
const { error } = require('console')
const path = require('path')

class Table {
    constructor() {
        this.schema = `mydbsql`                                                                                     
        this.pathdatabase = path.join(__dirname, '../', this.schema)                                                 //ver essa questão na aula
        this.table = 'usuario'                                                                                       
    }                                                                                                                //questão do erro no reject a melhor forma de se trabalhar é esta?
                                                                                                                     //se ele usaria promise para fazer essa interface
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

    insert(user, password) {
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

    login( {user, password} ) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.get(`SELECT * FROM ${this.table} WHERE user = ? AND password = ?`, [user, password], (err, rows) => {
                    db.close()
                    if (err) reject(err)

                    else if (!rows) {
                        //                throw new Error("qualquer")
                        console.error("Deu erro")
                        reject({ status: 400 })
                        //                          resolve({error: "deu erro"})
                    }
                    else resolve(rows)
                })
            })
        })
    }

    update( {user, password} ) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.get(`SELECT * FROM ${this.table} WHERE user = ? `, [user, password], (err, rows) => {
                    //db.close()
                    if (!rows) resolve({ updated: false })
                })
                db.run(`UPDATE ${this.table} SET password = ? WHERE user = ?`, [password, user], (err) => {
                    db.close()
                    if (err) reject(err)
                    else resolve({ table: this.table, user, message: `Atualizado com sucesso`, updated: true })
                })
            }).catch(error => reject(error))
        })
    }

    delete( {user} ) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.run(`DELETE FROM ${this.table} WHERE user = ?`, [user], (err, rows) => {
                    this.close
                    if (err) reject(err)
                        else if (!rows) {
                            reject({ status: 400 })
                        }
                    else resolve({ table: this.table, user, message: `Removido com sucesso` })
                })
            })
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

    selectUser( user ) {
        return new Promise((resolve, reject) => {
            this.Db().then(db => {
                db.get(`SELECT  id, user FROM ${this.table} WHERE user = ?`, [user], (err, rows) => {
                    this.close
                    if (err) reject(err)
                        else if (!rows) {
                            reject({ status: 400 })
                        }
                    else resolve( rows )

                })
            }).catch(error => reject(error))
        })
    }

}

module.exports = new Table