class PokemonTypeController {
    constructor({
        pokemonTypeModel
    }) {
        if(!pokemonTypeModel){
            throw new Error('pokemon model not provided')
        }
        this.pokemonTypeModel = pokemonTypeModel
    }

    async getType(request, response) {
        const typeList = await this.pokemonTypeModel.findAll()

        return response.json(typeList)
    }

    async createType(request, response) {
        const {
            type,
        } = request.body

        const createdType = await this.pokemonTypeModel.create({
            type
        })

        return response.json(createdType)
    }

    async updateType(request, response) {
        const {
            type
        } = request.body

        const typeId = request.params.typeId

        const typeName = await this.pokemonTypeModel.findOne({
            where: {
                id: typeId
            }
        })

        if (!typeName) {
            return response.status(404).json({
                message: 'type not found'
            })
        }

        typeName.update({
            type
        })

        await typeName.save()

        return response.json(typeName)
    }

    async deleteType(request, response) {
        const typeId = request.params.typeId

        const type = await this.pokemonTypeModel.findOne({
            where: {
                id: typeId
            }
        })

        if (!type) {
            return response.status(404).json({
                message: 'type not found'
            })
        }

        await type.destroy()

        return response.json({
            message: 'type deleted'
        })
    }
}

module.exports = PokemonTypeController
