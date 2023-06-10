const { expressjwt: jwt } =  require('express-jwt')
const secret= process.env.JWT_Key;
const {getUserById} = require('../models/queries/user');

module.exports = authorize;

function authorize(roles = []) {

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        /* authenticate JWT token and attach user to request object (req.auth) */
        jwt({ secret:secret, algorithms: ['HS256'] }),

        /* authorize based on user role */
        (req, res, next) => { 
            if (roles.length && !roles.includes(req.auth.roles)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }
            switch (req.auth.roles) {
            case 'user':
                getUserById(req.auth.id).then(
                    user => {
                        if (user) {
                            req.user = user
                            req.userType = 'User'
                            next()
                        } else {
                        return res.status(404).json({ message: 'User Not Found' })
                        }
                    }
                )
            break

            case 'admin':
                getUserById(req.auth.id).then(
                    user => {
                        if (user) {
                            req.user = user
                            req.userType = 'User'
                            next()
                        } else {
                        return res.status(404).json({ message: 'User Not Found' })
                        }
                    }
                )
            break

            default:
                return res.status(404).json({ message: 'Unauthorized' })

            }
        }
    ]
}