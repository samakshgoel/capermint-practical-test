const {DataTypes} = require('sequelize');

module.exports = (db_config) => {

    const user = db_config.define(
        'user',
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
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Email address already in use!',
                },

            },
            phoneNumber: {
                type: DataTypes.BIGINT,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Mobile number already in use!',
                }
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role:{
                type : DataTypes.ENUM('user', 'admin'),
                defaultValue : 'user'
            }
            
        }
    )
    return user;

}