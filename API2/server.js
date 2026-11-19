const express = require('express')
const api = express()
const {MongoClient, ObjectId} = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()

const url = process.env.DATABASE_URL
const client = new MongoClient(url)
let collection

api.set('view engine', 'ejs')
api.use(express.urlencoded({ extended: true }))

api.get('/ler', (req, res) => {
    res.send("Olá mundo")
})

// formulário de cadastro
api.get('/index', (req, res) => {
    res.render('index.ejs')
})

// criar
api.post('/show', async (req, res) => {
    await collection.insertOne({
        name: req.body.name,
        surname: req.body.surname,
        dataNascimento: req.body.dataNascimento
    })
    res.redirect('/show')
})

// listar
api.get('/show', async (req, res) => {
    const crud = await collection.find().toArray()
    res.render('shows.ejs', {crud})
})

// visualizar o editar
api.get('/edit/:id', async (req, res) => {
    const crud = await collection.find({_id: new ObjectId(req.params.id)}).toArray()
    res.render('edit.ejs', {crud})
})

// editar
api.post('/edit/:id', async (req, res) => {
    await collection.updateOne(
        {_id: new ObjectId(req.params.id)},
        {
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                dataNascimento: req.body.dataNascimento
            }
        }
    )
    res.redirect('/show')
})

// deletar
api.get('/delete/:id', async (req, res) => {
    await collection.deleteOne({_id: new ObjectId(req.params.id)})
    res.redirect('/show')
})

async function iniciar() {
    await client.connect()
    const db = client.db('crud')
    collection = db.collection('crud')
    console.log("conectou com o nosso banco")

    api.listen(3000, function () {
        console.log("O nosso servidor está na porta 3000")
    })
}

iniciar().catch(function (erro) {
    console.error("Erro ao iniciar", erro)
})
