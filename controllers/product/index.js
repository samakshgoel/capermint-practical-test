
const path = require('path');
const productQueries = require('../../models/queries/product');

module.exports = {

    async createProduct(req,res){
        let title = req.body.title ;
        let categoryId = req.body.categoryId ;
        let description = req.body.description ;
        let amount = req.body.amount ;
        let imageData = req.file ;

        if(!title || !categoryId || !description || !amount || !imageData) return res.status(422).send({code :422 , status :"failed", msg : "Data is required."});

        try{
            /**assign image location to imageUrl */
            let imageUrl ;
            if(imageData.path) imageUrl = path.join(__dirname , '../../', imageData.path);

            let productDetails = {
                imageUrl : imageUrl, 
                title : title , 
                description : description, 
                categoryId : categoryId,
                amount : amount
            }

            await productQueries.createProduct(productDetails);
            return res.status(201).send({code : 201 , status : 'success', msg : "Product created successfully."});
        }catch(err){
            console.log(err);
            return res.status(422).send({code :422 , status:'failed', msg : err.message});
        }
    },

    async updateProduct(req,res){

        let title = req.body.title ;
        let description = req.body.description ;
        let amount = req.body.amount ;
        let productId = req.body.productId;
        let imageData = req.file ;

        if((!title && !description && !amount && !imageData) || !productId) return res.status(422).send({code : 422 , status :'failed', msg :"Data is required."})
        try{
            let imageUrl ;
            if(imageData.path) imageUrl = path.join(__dirname , '../../', imageData.path);

            let productDetails = {
                title,
                description,
                amount,
                imageUrl
            }

            await productQueries.updateProduct(productDetails, productId);
            return res.status(200).send({code : 200 , status :"success", msg :'Product update successfully.'})
        }catch(err){
            console.log(err);
            return res.status(422).send({code : 422 , status : 'failed' , msg : err.message});
        }
    },

    async deleteProduct(req,res){
        let productId = req.query.productId ;
        if(!productId) return res.status(422).send({code : 422 , status :'failed', msg :"Data is required."});
        try{
            await productQueries.deleteProduct(productId);
            return res.status(200).send({code : 200 , status :"success", msg : "Product delete successfully."});
        }catch(err){
            console.log(err);
            return res.status(422).send({code : 422 , status :'failed' , msg : err.message})
        }
    },

    async searchProduct(req,res){
        let searchKeyword = req.query.searchKeyword ;
        let limit = parseInt(req.query.limit) || 10;
        let skip = parseInt(req.query.skip) || 0;

        if(!searchKeyword) return res.status(422).send({code : 422 , status :'failed', msg :"Data is required."});

        try{
            let productList = await productQueries.searchProduct(searchKeyword, limit , skip);
            return res.status(200).send({code : 200 , status : 'success', productList});
        }catch(err){
            console.log(err);
            return res.status(422).send({code : 422 , status :'failed', msg : err.message});
        }
    }
}