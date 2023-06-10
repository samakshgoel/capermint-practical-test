const {DataTypes} = require('sequelize');

module.exports = (db_config) => {

    const category = db_config.define(
        'category',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            parentId :{
                type: DataTypes.INTEGER,
                allowNull : false
            },
            isDisable  : {
                type : DataTypes.BOOLEAN,
                defaultValue : false
            }
            
        }
    )
    return category;

}