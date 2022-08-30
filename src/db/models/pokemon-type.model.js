const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database')

class PokemonTypeModel extends Model {
    static associations (models) {
        this.hasMany(models.pokemon)
    }
}

PokemonTypeModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'pokemonType',
    timestamps: false
})

module.exports = PokemonTypeModel
