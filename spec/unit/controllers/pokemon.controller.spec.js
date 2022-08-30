const PokemonController = require('../../../src/controllers/pokemon.controller')

describe('Pokemon Controller Unit tests', () => {
    beforeEach(() => {
        const dbOperations = [
            'findAll',
            'findOne',
            'destroy',
            'update',
            'save',
            'create'
        ]
        this.pokemonModel = jasmine.createSpyObj('pokemonModel', dbOperations)
        this.pokemonTypeModel = jasmine.createSpyObj('pokemonTypeModel', dbOperations)
    })
    it('should be a function', () => {
        expect(typeof PokemonController).toBe('function')
    })

    it('should throw an error if dependencies are not provided', () => {
        expect(() => new PokemonController({})).toThrowError('pokemon model not provided')
        expect(() => new PokemonController({
            pokemonModel: this.pokemonModel
        })).toThrowError('pokemon type model not provided')
    })

    it('should create an instance correctly', () => {
        this.controller = new PokemonController({
            pokemonModel: this.pokemonModel,
            pokemonTypeModel: this.pokemonTypeModel
        })

        expect(this.controller).toBeInstanceOf(PokemonController)
        expect(this.controller.pokemonModel).toBe(this.pokemonModel)
        expect(this.controller.pokemonTypeModel).toBe(this.pokemonTypeModel)
    })

    describe('instance', () => {
        beforeEach(() => {
            this.controller = new PokemonController({
                pokemonModel: this.pokemonModel,
                pokemonTypeModel: this.pokemonTypeModel
            })
            this.request = {
                body: {},
                params: {}
            }
            const methods = [
                'json',
                'status'
            ]
            this.response = {}
            methods.forEach(method => {
                this.response[method] = jasmine.createSpy(`response.${method}`, () => {
                    return this.response
                }).and.callThrough()
            })
            this.charmander = {
                name: 'charmander',
                pokemonTypeId: 1
            }
            this.bulbasaur = {
                name: 'bulbasaur',
                pokemonTypeId: 2
            }
            this.pokemonList = [
                this.charmander,
                this.bulbasaur
            ]
        })

        describe('getPokemon', () => {
            beforeEach(() => {
                this.pokemonModel.findAll.and.resolveTo(this.pokemonList)
                this.response.json.and.resolveTo({ body: this.pokemonList })
            })

            it('should call `PokemonModel.findAll`', async () => {
                await this.controller.getPokemon(this.request, this.response)

                expect(this.pokemonModel.findAll).toHaveBeenCalledTimes(1)
                expect(this.pokemonModel.findAll).toHaveBeenCalledWith({
                    attributes: ['name', 'pokemonType.type'],
                    include: [{ model: jasmine.any(Object), attributes: [] }],
                    raw: true
                })
            })

            it('should call `response.json`', async () => {
                await this.controller.getPokemon(this.request, this.response)

                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith(this.pokemonList)
            })

            it('should return a list of pokemon', async () => {
                const response = await this.controller.getPokemon(this.request, this.response)

                expect(response).toBeDefined()
                expect(response.body).toEqual(this.pokemonList)
            })
        })

        describe('createPokemon', () => {
            beforeEach(() => {
                this.request.body = this.bulbasaur
                this.createdBulbasaur = {
                    id: 1,
                    name: this.bulbasaur.name,
                    pokemonType: this.bulbasaur.type
                }
                this.pokemonModel.create.and.resolveTo(this.createdBulbasaur)
                this.response.json.and.resolveTo({ body: this.createdBulbasaur })
            })

            it('should call `PokemonModel.create`', async () => {
                await this.controller.createPokemon(this.request, this.response)

                expect(this.pokemonModel.create).toHaveBeenCalledTimes(1)
                expect(this.pokemonModel.create).toHaveBeenCalledWith(this.bulbasaur)
            })

            it('should call `response.json`', async () => {
                await this.controller.createPokemon(this.request, this.response)

                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith(this.createdBulbasaur)
            })

            it('should return the created pokemon', async () => {
                const response =  await this.controller.createPokemon(this.request, this.response)

                expect(response).toBeDefined()
                expect(response.body).toEqual(this.createdBulbasaur)
            })
        })

        describe('updatePokemon', () => {
            beforeEach(() => {
                this.pokemonId = 1,
                this.newPokemonValues = {
                    name: 'squirtle',
                    pokemonTypeId: 3
                }
                this.updatedPokemon = {
                    id: this.pokemonId,
                    name: this.newPokemonValues.name,
                    pokemonTypeId: this.newPokemonValues.pokemonTypeId
                }
                this.request.body = this.newPokemonValues
                this.request.params.pokemonId = this.pokemonId
                this.pokemonModel.findOne.and.resolveTo({ ...this.bulbasaur, ...this.pokemonModel})
                this.response.json.and.resolveTo({ body: this.updatedPokemon })
            })

            it('should call `PokemonModel.findOne`', async () => {
                await this.controller.updatePokemon(this.request, this.response)

                expect(this.pokemonModel.findOne).toHaveBeenCalledTimes(1)
                expect(this.pokemonModel.findOne).toHaveBeenCalledWith({
                    where: {
                        id: this.pokemonId
                    }
                })
            })

            it('should return `not found` if the pokemon does not exist', async () => {
                this.pokemonModel.findOne.and.resolveTo(null)

                await this.controller.updatePokemon(this.request, this.response)

                expect(this.response.status).toHaveBeenCalledTimes(1)
                expect(this.response.status).toHaveBeenCalledWith(404)
                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith({
                    message: 'pokemon not found'
                })
            })

            it('should update the pokemon with the new values', async () => {
                await this.controller.updatePokemon(this.request, this.response)

                expect(this.pokemonModel.update).toHaveBeenCalledTimes(1)
                expect(this.pokemonModel.update).toHaveBeenCalledWith(this.newPokemonValues)
            })

            it('should call `PokemonModel.save`', async () => {
                await this.controller.updatePokemon(this.request, this.response)

                expect(this.pokemonModel.save).toHaveBeenCalledTimes(1)
            })

            it('should return the updated pokemon', async () => {
                const response = await this.controller.updatePokemon(this.request, this.response)

                expect(response).toBeDefined()
                expect(response.body).toEqual(this.updatedPokemon)
            })
        })

        describe('deletePokemon', () => {
            beforeEach(() => {
                this.pokemonId = 1,
                this.request.params.pokemonId = this.pokemonId
                this.pokemonModel.findOne.and.resolveTo({ ...this.bulbasaur, ...this.pokemonModel})
                this.response.json.and.resolveTo({ body: {
                    message: 'pokemon deleted'
                } })
            })

            it('should call `PokemonModel.findOne`', async () => {
                await this.controller.deletePokemon(this.request, this.response)

                expect(this.pokemonModel.findOne).toHaveBeenCalledTimes(1)
                expect(this.pokemonModel.findOne).toHaveBeenCalledWith({
                    where: {
                        id: this.pokemonId
                    }
                })
            })

            it('should return `not found` if the pokemon does not exist', async () => {
                this.pokemonModel.findOne.and.resolveTo(null)

                await this.controller.deletePokemon(this.request, this.response)

                expect(this.response.status).toHaveBeenCalledTimes(1)
                expect(this.response.status).toHaveBeenCalledWith(404)
                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith({
                    message: 'pokemon not found'
                })
            })

            it('should call `PokemonModel.destroy`', async () => {
                await this.controller.deletePokemon(this.request, this.response)

                expect(this.pokemonModel.destroy).toHaveBeenCalledTimes(1)
            })

            it('should call `response.json`', async () => {
                await this.controller.deletePokemon(this.request, this.response)

                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith({
                    message: 'pokemon deleted'
                })
            })
        })
    })
})
