require('dotenv').config()
const express = require('express')
const database = require('./src/db/database')
const {
    pokemonRoute,
    pokemonTypeRoute
} = require('./src/routes')

const port = process.env.SERVER_PORT

const server = express()

server.use(express.json())

//routes
server.use(pokemonRoute)
server.use(pokemonTypeRoute)

database.sync().then(() => {
    console.log('db ok')
    server.listen(port, () => console.log(`server running on ${port}`))
})
