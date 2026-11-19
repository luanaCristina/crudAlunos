const express = require('express')
const app = express()
const {MongoClient, ObjectId} = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()

const url = process.env.DATABASE_URL

const client = new MongoClient(url)
let collection

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

// formulário de cadastro
app.get('/index', (req, res) => {
    res.render('index2.ejs')
})

// criar
app.post('/show', async (req, res) => {
    await collection.insertOne({
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        telefone: req.body.telefone,
        dataNascimento: req.body.dataNascimento
    })
    res.redirect('/show')
})

// listar
app.get('/show', async (req, res) => {
    const crud = await collection.find().toArray()
    res.render('show2.ejs', {crud})
})

// visualizar o editar
app.get('/edit/:id', async (req, res) => {
    const crud = await collection.find({_id: new ObjectId(req.params.id)}).toArray()
    res.render('edit2.ejs', {crud})
})

// editar
app.post('/edit/:id', async (req, res) => {
    await collection.updateOne(
        {_id: new ObjectId(req.params.id)},
        {
            $set: {
                nome: req.body.nome,
                cpf: req.body.cpf,
                email: req.body.email,
                telefone: req.body.telefone,
                dataNascimento: req.body.dataNascimento
            }
        }
    )
    res.redirect('/show')
})

// deletar
app.get('/delete/:id', async (req, res) => {
    await collection.deleteOne({_id: new ObjectId(req.params.id)})
    res.redirect('/show')
})

// conectar com o mongodb e iniciar o servidor
async function iniciar() {
    await client.connect()
    const db = client.db('confiamais')
    collection = db.collection('crud')
    console.log("conectou com o nosso banco")

    app.listen(3001, function () {
        console.log("o nosso servidor está girando na porta 3001")
    })
}

iniciar().catch(function (erro) {
    console.error("Erro ao iniciar", erro)
})
