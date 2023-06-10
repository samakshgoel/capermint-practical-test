const userModule = require('../index').userModel;
const { Op } = require('sequelize');

module.exports = {

    /**function to create user details */
    async createUserDetails(data){
        return await userModule.create(data);
    },

     /**function to get user details using email and userId */
    async getUserByEmail(email){
        return await userModule.findOne({ 
            attributes : ['id','email','password','role'],
            where: { email: email } 
        })
    },

    async getUserById(userId){
        return await userModule.findOne({
            attributes : {exclude: ['password']},
            where: { id: userId } 
        });
    },

     /**function to update user details using userId*/
    async updateUserDetails(userData , userId){
        return await userModule.update(userData , {
            where : {id : userId}
        })
    },

    /**function to check that user exists or not*/
    async userExists(email , phoneNumber){
        return await userModule.findOne({
            where : {
                [Op.or]:[
                    {email : email},
                    {phoneNumber , phoneNumber}
                ]
            }
        })
    }
}

