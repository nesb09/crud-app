const route = require('express').Router()
const PokemonController = require('../controllers/pokemon.controller')
const PokemonModel = require('../db/models/pokemon.model')
const PokemonTypeModel = require('../db/models/pokemon-type.model')

const controller = new PokemonController({
    pokemonModel: PokemonModel,
    pokemonTypeModel: PokemonTypeModel
})

route.get('/pokemon', controller.getPokemon.bind(controller))
route.post('/pokemon', controller.createPokemon.bind(controller))
route.put('/pokemon/:pokemonId', controller.updatePokemon.bind(controller))
route.delete('/pokemon/:pokemonId', controller.deletePokemon.bind(controller))

module.exports = route
