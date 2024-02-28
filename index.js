const Database = require('./src/controller/sqlite/index')

/** * INSERT */
// Database.usuario.insert({ user: 'zacarias', password: '546465165165156' })
//     .then(response => { console.log({ response }) })
//     .catch(error => { console.error(error) })

/** * SELECT ALL */
Database.usuario.selectAll()
    .then(response => { console.log({ response }) })
    .catch(error => { console.error(error) })


/** * LOGIN */
// Database.usuario.login({ user: 'rodrigo', password: '123456' })
//     .then(response => { console.log({ response }) })
//     .catch(error => { console.error(error) })


/** * DELETE */
// Database.usuario.delete({ id: 2 })
//     .then(response => { console.log({ response }) })
//     .catch(error => { console.error(error) })