const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database')
const PokemonTypeModel = require('./pokemon-type.model')

class PokemonModel extends Model {}

PokemonModel.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'pokemon',
    timestamps: false
})

PokemonModel.pokemonType = PokemonModel.belongsTo(PokemonTypeModel)

module.exports = PokemonModel
