const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../../services/roles');
const userQueries = require('../../models/queries/user');

module.exports = {

    async registerUser(req, res){
        let name = req.body.name ;
        let email = req.body.email ;
        let phone = req.body.phone ;
        let password = req.body.password ;
        let role = req.body.role ;

        if(!name || !email || !phone || !password) return res.status(422).send({code : 422 , status :"failed" , msg : "Data is required."});
        if(password.length < 6) return res.status(422).send({code : 422 , status :"failed" , msg : 'Password must be at least 6 characters long'})
        
        try{
            /** checking user exists or not */
            let userExist = await userQueries.userExists(email , phone);
            if(userExist) return res.status(422).send({code : 422 , status :"failed" , msg : "User already exists."});

            /** encrypting the password */
            password = await bcrypt.hash(password, 10);

            let userDetails = {
                name : name ,
                email : email ,
                phoneNumber : phone,
                password : password,
                role : role
            }

            /**creating user details into db */
            await userQueries.createUserDetails(userDetails);
            return res.status(201).send({code : 201 , status:'success', msg :'User register successfully.'})
        }catch(err){
            console.log(err);
            return res.status(422).send({code:422 , status : 'failed' , msg :err.message});
        }
    },

    async userLogin(req,res){
        let email = req.body.email ;
        let password = req.body.password ;

        if(!email || !password ) return res.status(422).send({code: 422 , status :'failed', msg : "Data is required."});
        try{
            let userDetail = await userQueries.getUserByEmail(email);
            userDetail = JSON.parse(JSON.stringify(userDetail));

            if(!userDetail) return res.status(401).send({code : 401 , status :'failed', msg : 'Wrong credentials' });

            /**comparing the encrypted password */
            let ispasswordCorrect = await bcrypt.compare(password ,userDetail.password );
            if(!ispasswordCorrect) return res.status(401).send({code : 401 , status :'failed', msg : 'Wrong credentials' });
            
            let token = await createToken(userDetail.id, userDetail.role);
            
            return res.status(200).send({code : 200 , status : "success", msg :"Login successfully", token})
        }catch(err){
            console.log(err);
            return res.status(422).send({code : 422 , status : 'failed', msg : err.message});
        }

    },

    async getUserProfile(req, res){
        /**
         * We can add more data related to user but for now all user credentials is accessed by middleware 
         * so that we don't want to fetch user details every time. 
         */
        return res.status(200).send({code : 200 , status :"success", userDetails : req.user})
    },

    async updateProfile(req,res){
        let name = req.body.name ;
        let email = req.body.email ;
        let phoneNumber = req.body.phone ;
        let password = req.body.password ;
        let userId = req.user.id;

        if(!name && !email && !password && !phoneNumber ) return res.status(422).send({code : 422 , status :"failed" , msg : "Data is required." })
        if(password && password.length < 6) return res.status(422).send({code : 422 , status :"failed" , msg : 'Password must be at least 6 characters long'})

        try{
            let userNewDetails = {name , email , phoneNumber , password};
            if(userNewDetails.password) userNewDetails.password = await bcrypt.hash(password, 10);
            
            /**update user details in db*/
            await userQueries.updateUserDetails(userNewDetails , userId);

            return res.status(200).send({code : 200 , status : "success", msg : "Update user details successfully"});

        }catch(err){
            console.log(err);
            return res.status(422).send({code : 422 , status : "failed", msg : err.message});
        }
    }
}


/** function  creating JWT */
async function createToken(userId , role){
    /** payload for JWT */
    let payload = {
        id: userId,
        roles: role
    }
    return jwt.sign(payload, process.env.JWT_Key, { expiresIn: "48h" });
}
