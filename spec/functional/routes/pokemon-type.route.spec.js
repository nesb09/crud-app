require('../../../index')
const superagent = require('superagent')
const db = require('../../helpers/db')
const PokemonTypeModel = require('../../../src/db/models/pokemon-type.model')

describe('Pokemon Route functional test', () => {
    beforeAll(async () => {
        this.baseUrl = `http://localhost:${process.env.SERVER_PORT}`
        this.normal = 'normal'
        this.fire = 'fire'
        this.type = {
            type: this.normal
        }

        await db.destroyModels([PokemonTypeModel])
    })

    afterEach(async () => {
        await db.destroyModels([PokemonTypeModel])
    })

    it('should return type from database', async () => {
        // setup data in db
        const dbType = await db.insert(PokemonTypeModel, this.type)

        const response = await superagent.get(`${this.baseUrl}/types`)

        expect(response.body).toEqual([{
            id: dbType.id,
            type: dbType.type
        }])
    })

    it('should create a type in database', async () => {
        const response = await superagent.post(`${this.baseUrl}/types`, this.type)

        const createdType = await db.selectById(PokemonTypeModel, response.body.id)
        expect(createdType.type).toEqual(this.type.type)
    })

    it('should update a type', async () => {
        // inserting data
        const dbType = await db.insert(PokemonTypeModel, this.type)

        await superagent.put(`${this.baseUrl}/types/${dbType.id}`, {
            type: 'snow'
        })

        const updatedType = await db.selectById(PokemonTypeModel, dbType.id)

        expect(updatedType.type).toEqual('snow')
    })

    it('should delete a type', async () => {
        // inserting data
        const dbType = await db.insert(PokemonTypeModel, this.type)

        const response = await superagent.delete(`${this.baseUrl}/types/${dbType.id}`)

        expect(response.body.message).toEqual('type deleted')
    })
})
