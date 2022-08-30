const Sequelize = require('sequelize')

let sequelize

if(process.env.NODE_ENV !== 'test') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        host: './db.sqlite'
    })
} else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        host: './db-test.sqlite'
    })
}

module.exports = sequelize
