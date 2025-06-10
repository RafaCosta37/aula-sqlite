const express = require("express");
const app = express()


const Database = require('./src/controller/sqlite/index')
app.use(express.json())
/** * INSERT */

app.post("/cadastrar", async (req, res) => {                                                        //não conseguimos aplicar o toLawerCase
    try {
        const { user, password } = req.body
        const usuarioMinusculo = user.toLowerCase()
        if (!user || !password) return res.status(422).json({ mens: "Password e user precisam ser informados" })
        const cadastro = await Database.usuario.insert(
            usuarioMinusculo,
            password
        )
        return res.status(200).json({
            mens: "Usuário Cadastrado ",
            "Dados": {
                "user": user,
                "password": password,
            }
        })
    } catch (e) {
        return res.status(409).json({ mens: "Usuário ja existe" })
    }

})


app.post("/login", async (req, res) => {
    try {
        const { user, password } = req.body

        if (!user || !password) res.status(422).json({ mens: "Nome e senha precisam ser informados" })

        const retorno = await Database.usuario.login({
            user,
            password
        })

        return res.status(200).json({
            mens: "Usuário Logado "
        })
    } catch (e) {
        console.log(e)
        if (e.status == 400) return res.status(401).json({ mens: "Usuário ou senha inválidos" })
        return res.status(500).json({ mens: "Erro do servidor" })
    }
})


app.delete("/delete", async (req, res) => {                                                              //usuario é deletado , mais cai diretamente no erro
    try {
        const { user } = req.body

        if (!user) return res.status(422).json({ mens: "Usuário precisa ser informado" })


        const retorno = await Database.usuario.delete({
            user
        })

    } catch (e) {
        return res.status(400).json({ mens: "Usuario não existe" })
    }
    return res.status(200).json({
        mens: "Usuário Deletado "
    })
})

app.put("/update", async (req, res) => {
    try {
        const { user, password } = req.body

        if (!user || !password) return res.status(422).json({ mens: "Id , user e password precisam ser informados" })

        const retorno = await Database.usuario.update({
            user,
            password
        })
        if (!retorno.updated) return res.status(400).json({ mens: "Usuario não existe" })
    } catch (e) {                                                                                       
        return res.status(500).json({ mens: "Erro Geral" })
    }
    return res.status(200).json({
        mens: "Usuário Atualizado"
    })
})


app.get("/buscarTodos", async (req, res) => {
    const usuarios = await Database.usuario.selectAll()
    const listaUsuarios = usuarios.map((item) => {
        return ({
            "Id": item.id,
            "User": item.user,
            "Password": item.password
        })
    })

    return res.status(200).json({ "Lista de Usuarios": listaUsuarios })
})

app.get("/buscarUm", async (req, res) => {
    try {
        //   throw new Error("qualquer")                                                                                             //como trazer os outros dados
        const { user } = req.body

        if (!user) return res.status(422).json({ mens: "User precisa ser informado" })

        const usuario = await Database.usuario.selectUser(
            user,
        )

        return res.status(200).json({
            mens: "Usuário Escolhido ",
            "Dados": {
                "User": usuario,

            }
        })
    } catch (e) {
        if (e.status == 400) return res.status(400).json({ mens: "Usuário não existe" })

        return res.status(500).json({ mens: "Erro Geral" })
    }

})




//Database.usuario.insert({ user: 'zacarias', password: '546465165165156' })
//   .then(response => { console.log({ response }) })
//   .catch(error => { console.error(error) })

/** * SELECT ALL */
//Database.usuario.selectAll()
//    .then(response => { console.log({ response }) })
//    .catch(error => { console.error(error) })


/** * LOGIN */
//Database.usuario.login({ user: 'rodrigo', password: '123456' })
//    .then(response => { console.log({ response }) })
//    .catch(error => { console.error(error) })


/** * DELETE */
//Database.usuario.delete({ id: 9 })
//    .then(response => { console.log({ response }) })
//    .catch(error => { console.error(error) })


app.listen(8000, () => {
    console.log("backend rodando")
})