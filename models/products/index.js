const {DataTypes} = require('sequelize');

module.exports = (db_config) => {

    const product = db_config.define(
        'product',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false
            },
            categoryId :{
                type: DataTypes.INTEGER,
                allowNull : false
            },
            description :{
                type : DataTypes.TEXT,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull : false
            },
            isDisable  : {
                type : DataTypes.BOOLEAN,
                defaultValue : false
            }
            
        }
    )
    return product;

}