const PokemonTypeController = require('../../../src/controllers/pokemon-type.controller')

describe('Pokemon Type Controller Unit tests', () => {
    beforeEach(() => {
        this.pokemonTypeModel = jasmine.createSpyObj('pokemonTypeModel', [
            'findAll',
            'findOne',
            'destroy',
            'update',
            'save',
            'create'
        ])
    })
    it('should be a function', () => {
        expect(typeof PokemonTypeController).toBe('function')
    })

    it('should throw an error if dependencies are not provided', () => {
        expect(() => new PokemonTypeController({})).toThrowError('pokemon model not provided')
    })

    it('should create an instance correctly', () => {
        this.controller = new PokemonTypeController({
            pokemonTypeModel: this.pokemonTypeModel
        })

        expect(this.controller).toBeInstanceOf(PokemonTypeController)
        expect(this.controller.pokemonTypeModel).toBe(this.pokemonTypeModel)
    })

    describe('instance', () => {
        beforeEach(() => {
            this.controller = new PokemonTypeController({
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
            this.fire = {
                type: 'fire'
            }
            this.water = {
                type: 'water'
            }
            this.typeList = [
                this.fire,
                this.water
            ]
        })

        describe('getTypes', () => {
            beforeEach(() => {
                this.pokemonTypeModel.findAll.and.resolveTo(this.typeList)
                this.response.json.and.resolveTo({ body: this.typeList })
            })

            it('should call `PokemonTypeModel.findAll`', async () => {
                await this.controller.getType(this.request, this.response)

                expect(this.pokemonTypeModel.findAll).toHaveBeenCalledTimes(1)
            })

            it('should call `response.json`', async () => {
                await this.controller.getType(this.request, this.response)

                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith(this.typeList)
            })

            it('should return a list of pokemon', async () => {
                const response = await this.controller.getType(this.request, this.response)

                expect(response).toBeDefined()
                expect(response.body).toEqual(this.typeList)
            })
        })

        describe('createType', () => {
            beforeEach(() => {
                this.request.body = { type: 'fire' }
                this.createdType = {
                    id: 1,
                    type: 'fire'
                }
                this.pokemonTypeModel.create.and.resolveTo(this.createdType)
                this.response.json.and.resolveTo({ body: this.createdType })
            })

            it('should call `pokemonTypeModel.create`', async () => {
                await this.controller.createType(this.request, this.response)

                expect(this.pokemonTypeModel.create).toHaveBeenCalledTimes(1)
                expect(this.pokemonTypeModel.create).toHaveBeenCalledWith(this.request.body)
            })

            it('should call `response.json`', async () => {
                await this.controller.createType(this.request, this.response)

                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith(this.createdType)
            })

            it('should return the created pokemon', async () => {
                const response =  await this.controller.createType(this.request, this.response)

                expect(response).toBeDefined()
                expect(response.body).toEqual(this.createdType)
            })
        })

        describe('updateType', () => {
            beforeEach(() => {
                this.typeId = 1,
                this.dbType = { id: this.typeId, type: 'plant' }
                this.newTypeValues = {
                    type: 'snow'
                }
                this.updatedType = {
                    id: this.typeId,
                    name: this.newTypeValues.type
                }
                this.request.body = this.newTypeValues
                this.request.params.typeId = this.typeId
                this.pokemonTypeModel.findOne.and.resolveTo({ ...this.dbType, ...this.pokemonTypeModel })
                this.response.json.and.resolveTo({ body: this.updatedType })
            })

            it('should call `pokemonTypeModel.findOne`', async () => {
                await this.controller.updateType(this.request, this.response)

                expect(this.pokemonTypeModel.findOne).toHaveBeenCalledTimes(1)
                expect(this.pokemonTypeModel.findOne).toHaveBeenCalledWith({
                    where: {
                        id: this.typeId
                    }
                })
            })

            it('should return `not found` if the pokemon does not exist', async () => {
                this.pokemonTypeModel.findOne.and.resolveTo(null)

                await this.controller.updateType(this.request, this.response)

                expect(this.response.status).toHaveBeenCalledTimes(1)
                expect(this.response.status).toHaveBeenCalledWith(404)
                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith({
                    message: 'type not found'
                })
            })

            it('should update the pokemon with the new values', async () => {
                await this.controller.updateType(this.request, this.response)

                expect(this.pokemonTypeModel.update).toHaveBeenCalledTimes(1)
                expect(this.pokemonTypeModel.update).toHaveBeenCalledWith(this.newTypeValues)
            })

            it('should call `pokemonTypeModel.save`', async () => {
                await this.controller.updateType(this.request, this.response)

                expect(this.pokemonTypeModel.save).toHaveBeenCalledTimes(1)
            })

            it('should return the updated pokemon', async () => {
                const response = await this.controller.updateType(this.request, this.response)

                expect(response).toBeDefined()
                expect(response.body).toEqual(this.updatedType)
            })
        })

        describe('deleteType', () => {
            beforeEach(() => {
                this.typeId = 1,
                this.request.params.typeId = this.typeId
                this.dbType = { id: this.typeId, type: 'plant' }
                this.pokemonTypeModel.findOne.and.resolveTo({ ...this.dbType, ...this.pokemonTypeModel})
                this.response.json.and.resolveTo({ body: {
                    message: 'pokemon deleted'
                } })
            })

            it('should call `pokemonTypeModel.findOne`', async () => {
                await this.controller.deleteType(this.request, this.response)

                expect(this.pokemonTypeModel.findOne).toHaveBeenCalledTimes(1)
                expect(this.pokemonTypeModel.findOne).toHaveBeenCalledWith({
                    where: {
                        id: this.typeId
                    }
                })
            })

            it('should return `not found` if the pokemon does not exist', async () => {
                this.pokemonTypeModel.findOne.and.resolveTo(null)

                await this.controller.deleteType(this.request, this.response)

                expect(this.response.status).toHaveBeenCalledTimes(1)
                expect(this.response.status).toHaveBeenCalledWith(404)
                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith({
                    message: 'type not found'
                })
            })

            it('should call `pokemonTypeModel.destroy`', async () => {
                await this.controller.deleteType(this.request, this.response)

                expect(this.pokemonTypeModel.destroy).toHaveBeenCalledTimes(1)
            })

            it('should call `response.json`', async () => {
                await this.controller.deleteType(this.request, this.response)

                expect(this.response.json).toHaveBeenCalledTimes(1)
                expect(this.response.json).toHaveBeenCalledWith({
                    message: 'type deleted'
                })
            })
        })
    })
})
