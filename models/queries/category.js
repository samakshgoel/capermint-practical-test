const categoryModule = require('../index').categoryModel;
const categoryHeirarchyModule = require('../index').categoryHierarchyModel;
const { Op } = require('sequelize');

module.exports = {

    /**function to create category details */
    async createCategory(categoryDetails){
        return await categoryModule.create(categoryDetails);
    },

    /**function to get the category heirarchy */
    async getCategoryHeirarchy(parentCategoryId, categoryId ){
        return await categoryHeirarchyModule.findAll({
            attributes : [ 'ancestorId', 'depth', 'categoryId'],
            where : {categoryId : parentCategoryId , isDisable : false},
        })
        .then(async categoryHeirarchy=>{
            categoryHeirarchy = JSON.parse(JSON.stringify(categoryHeirarchy));

            return await Promise.all(categoryHeirarchy.map(heirarchy=>{
                heirarchy.categoryId = categoryId
                heirarchy.depth = heirarchy.depth + 1
                return heirarchy
            }));
        })
    },

    /**function to create the category heirarchy of ancestors*/
    async createCategoryHeirarchy(categoryHeirarchy){
        console.log(categoryHeirarchy)
        return await categoryHeirarchyModule.bulkCreate(categoryHeirarchy);
    },

    /**function to check the category is exist or not */
    async categoryExist(categoryName , parentId){
        return await categoryModule.findOne({
            attributes : ['id','name','parentId', 'isDisable'],
            where:{ name : categoryName , parentId : parentId}
        })
    },

    /**function to update the category status (delete or not) */
    async updateCategoryStatus(categoryId, status){
        return await categoryModule.update(
            { isDisable : status},
            { 
                where:{id : categoryId}
            })
            .then(async response=>{
                return await categoryHeirarchyModule.update(
                    {isDisable : status},
                    {
                        where:{categoryId : categoryId}
                    })
            })
    },

    /**function to update the category details */
    async updateCategory(categoryId ,categoryDetails){
        return await categoryModule.update(categoryDetails,
            {
                where:{id : categoryId}
            })
    }
}