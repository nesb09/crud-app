class PokemonController {
    constructor({
        pokemonModel,
        pokemonTypeModel
    }) {
        if(!pokemonModel){
            throw new Error('pokemon model not provided')
        }
        if(!pokemonTypeModel) {
            throw new Error('pokemon type model not provided')
        }
        this.pokemonModel = pokemonModel
        this.pokemonTypeModel = pokemonTypeModel
    }

    async getPokemon(request, response) {
        const pokemonList = await this.pokemonModel.findAll({
            attributes: ['name', 'pokemonType.type'],
            include: [{ model: this.pokemonTypeModel, attributes: [] }],
            raw: true
        })

        return response.json(pokemonList)
    }

    async createPokemon(request, response) {
        const {
            name,
            pokemonTypeId
        } = request.body

        const createdPokemon = await this.pokemonModel.create({
            name,
            pokemonTypeId
        })

        return response.json(createdPokemon)
    }

    async updatePokemon(request, response) {
        const {
            name,
            pokemonTypeId
        } = request.body

        const pokemonId = request.params.pokemonId

        const pokemon = await this.pokemonModel.findOne({
            where: {
                id: pokemonId
            }
        })

        if (!pokemon) {
            return response.status(404).json({
                message: 'pokemon not found'
            })
        }

        pokemon.update({
            name,
            pokemonTypeId
        })

        await pokemon.save()

        return response.json(pokemon)
    }

    async deletePokemon(request, response) {
        const pokemonId = request.params.pokemonId

        const pokemon = await this.pokemonModel.findOne({
            where: {
                id: pokemonId
            }
        })

        if (!pokemon) {
            return response.status(404).json({
                message: 'pokemon not found'
            })
        }

        await pokemon.destroy()

        return response.json({
            message: 'pokemon deleted'
        })
    }
}

module.exports = PokemonController
