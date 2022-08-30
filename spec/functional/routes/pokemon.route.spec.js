require('../../../index')
const superagent = require('superagent')
const db = require('../../helpers/db')
const PokemonModel = require('../../../src/db/models/pokemon.model')
const PokemonTypeModel = require('../../../src/db/models/pokemon-type.model')

describe('Pokemon Route functional test', () => {
    beforeAll(async () => {
        this.baseUrl = `http://localhost:${process.env.SERVER_PORT}`
        this.pokemonTypes = new Map()
        this.normal = 'normal'
        this.fire = 'fire'
        const fireType = await db.insert(PokemonTypeModel, {
            type: this.fire
        })
        const normalType = await db.insert(PokemonTypeModel, {
            type: this.normal
        })
        this.pokemonTypes.set(normalType.id, this.normal)
        this.pokemonTypes.set(fireType.id, this.fire)
        this.pokemon = {
            name: 'snorlax',
            pokemonTypeId: normalType.id
        }
        await db.destroyModels([PokemonModel])
    })

    afterEach(async () => {
        await db.destroyModels([PokemonModel])
    })

    it('should return pokemon from database', async () => {
        // setup data in db
        const dbPokemon = await db.insert(PokemonModel, this.pokemon)

        const response = await superagent.get(`${this.baseUrl}/pokemon`)

        expect(response.body).toEqual([{
            name: dbPokemon.name,
            type: this.pokemonTypes.get(dbPokemon.pokemonTypeId)
        }])
    })

    it('should create a pokemon in database', async () => {
        const response = await superagent.post(`${this.baseUrl}/pokemon`, this.pokemon)

        const createdPokemon = await db.selectById(PokemonModel, response.body.id)
        expect(createdPokemon.name).toEqual(this.pokemon.name)
        expect(createdPokemon.pokemonTypeId).toEqual(this.pokemon.pokemonTypeId)
    })

    it('should update a pokemon', async () => {
        // inserting data
        const dbPokemon = await db.insert(PokemonModel, this.pokemon)

        await superagent.put(`${this.baseUrl}/pokemon/${dbPokemon.id}`, {
            name: 'taurus'
        })

        const updatedPokemon = await db.selectById(PokemonModel, dbPokemon.id)

        expect(updatedPokemon.name).toEqual('taurus')
    })

    it('should delete a pokemon', async () => {
        // inserting data
        const dbPokemon = await db.insert(PokemonModel, this.pokemon)

        const response = await superagent.delete(`${this.baseUrl}/pokemon/${dbPokemon.id}`)

        expect(response.body.message).toEqual('pokemon deleted')
    })
})
