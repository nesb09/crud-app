async function destroyModel (model) {
    return await model.destroy({ where: {}, truncate: true })
}

async function destroyModels (models = []) {
    models.forEach(async model => {
        await destroyModel(model)
    })
}

async function insert (model, data) {
    const record = await model.create(data)

    return record
}

async function selectById (model, id,) {
    const record = await model.findOne({
        where: {
            id
        }
    })

    return record
}

module.exports = {
    destroyModel,
    destroyModels,
    insert,
    selectById
}
