const route = require('express').Router()
const PokemonTypeController = require('../controllers/pokemon-type.controller')
const PokemonTypeModel = require('../db/models/pokemon-type.model')

const controller = new PokemonTypeController({
    pokemonTypeModel: PokemonTypeModel
})

route.get('/types', controller.getType.bind(controller))
route.post('/types', controller.createType.bind(controller))
route.put('/types/:typeId', controller.updateType.bind(controller))
route.delete('/types/:typeId', controller.deleteType.bind(controller))

module.exports = route
