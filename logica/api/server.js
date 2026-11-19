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

app.get('/ler', (req, res) => {
    res.send('Olá, mundo')
})

// formulário de cadastro
app.get('/index', (req, res) => {
    res.render('index.ejs')
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
    res.render('show.ejs', {crud})
})

// visualizar o editar
app.get('/edit/:id', async (req, res) => {
    const crud = await collection.find({_id: new ObjectId(req.params.id)}).toArray()
    res.render('edit.ejs', {crud})
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

async function iniciar() {
    await client.connect()
    const db = client.db('miqueias')
    collection = db.collection('crud')
    console.log('conectou com o nosso banco')

    app.listen(3000, function () {
        console.log('O nosso servidor está na porta 3000')
    })
}

iniciar().catch(function (erro) {
    console.error('Erro ao iniciar', erro)
})
