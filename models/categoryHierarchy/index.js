const {DataTypes} = require('sequelize');

module.exports = (db_config) => {

    const categoryHierarchy = db_config.define(
        'categoryHierarchy',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            ancestorId :{
                type: DataTypes.INTEGER,
                allowNull : false
            },
            isDisable  : {
                type : DataTypes.BOOLEAN,
                defaultValue : false
            },
            depth : {
                type : DataTypes.INTEGER,
                allowNull : false
            }
            
        }
    )
    return categoryHierarchy;

}