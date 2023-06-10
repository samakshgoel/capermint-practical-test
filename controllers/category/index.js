
const categoryQueries = require('../../models/queries/category')

module.exports = {


    async createCategory(req,res){
        let categoryName = req.body.name ; 
        let parentId = req.body.parentId ;
        if(!categoryName) return res.status(422).send({code : 422 , status :"failed", msg : "Data is required."});
        try{

            /**checking the category exist or not */
            let categoryExist = await categoryQueries.categoryExist(categoryName , parentId);
            categoryExist = JSON.parse(JSON.stringify(categoryExist)); 

            if(categoryExist){
                if(!categoryExist.isDisable) return res.status(422).send({code : 422 , status :"failed", msg : "Category already exists."});
                
                /**enabiling deleted category rather than creating new one */
                await categoryQueries.updateCategoryStatus(categoryExist.id , false);
                return res.status(200).send({code : 200 , status : 'success' , msg :  "Create category successfully."});
            }

            let categoryDetails = {
                name : categoryName,
                parentId : parentId
            }

            let category = await categoryQueries.createCategory(categoryDetails);
            category = JSON.parse(JSON.stringify(category));

            /** create heirarchy only if this is child category */
            if(parentId){
                /**get category to parent hierarchy */
                let categoryHeirarchy = await categoryQueries.getCategoryHeirarchy(parentId , category.id);
                
                let parentHeirarchy = {
                    categoryId : category.id,
                    ancestorId : parentId,
                    depth : 1
                }
                categoryHeirarchy.push(parentHeirarchy);
                /** creating category ancestor heirarchy */   
                await categoryQueries.createCategoryHeirarchy(categoryHeirarchy);
            }

            return res.status(201).send({code : 201 , status : 'success' , msg :  "Create category successfully."});

        }catch(err){
            console.log(err);
            return res.status(422).send({code : 422 , status : 'failed' , msg : err.message })
        }
    },

    async updateCategory(req,res){
        let categoryName = req.body.categoryName ;
        let categoryId = req.body.categoryId ;
        if(!categoryId || !categoryName) return res.status(422).send({code : 422 , status : "failed", msg : "Data is required."});
        try{
            /**Category data that needs to be updated */
            let categoryDetails = {
                name : categoryName
            }
            await categoryQueries.updateCategory(categoryId ,categoryDetails);
            return res.status(200).send({code : 200 , status : 'success' , msg : 'Category updated successfully'});
        }catch(err){
            console.log(err);
            return res.status(422).send({code : 422 , status : 'failed' , msg : err.message});
        }
    }
    
}