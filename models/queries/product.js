
const productModule = require('../index').productModel;
const {Op , Sequelize} = require('sequelize')

module.exports = {

    /**function to create the product details */
    async createProduct(productDetails){
        return await productModule.create(productDetails);
    },

    /**function to update the product details */
    async updateProduct(productDetails, productId){
        return await productModule.update(
            productDetails,
            {
                where:{id : productId}
            })
    },

     /**function to soft delete the product  */
    async deleteProduct(productId){
        return await productModule.update(
            {isDisable : true},
            {
                where:{id :productId}
            }
        )
    },
    
     /**function to get product list using searchkeyword */
    async searchProduct(searchKeyword , limit , skip){
        return await productModule.findAll({
            limit : limit,
            offset : skip,

            attributes : ['id', 'title', 'imageUrl','description' ,'amount','categoryId',
                [Sequelize.literal(`(Select name from capermint_db.categories where id = product.categoryId and isDisable = false)`), 'catergoryName']
            ],

            where:{
                title: {
                    [Op.substring]: `%${searchKeyword}%`,
                  },
                  isDisable : false
            }
          });
    }

}