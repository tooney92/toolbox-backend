const jwt = require("jsonwebtoken")
const _ = require("lodash")

module.exports.verifyAdmin = async(req, res, next)=>{
    const token = req.header('Authorization')
    if(token === undefined){
        return res.status(401).json({error: 'Access Denied'});
    }else{
        try{
            let {data} = jwt.verify(token, process.env.token_secret)
            if(data.isOga != true){
                return res.status(401).json({error: 'Access Denied.'})
            }
            data = _.omit(data, ["password", "isOga"])
            req.user = data
            next()
        }catch(err){
            console.log(err);
            res.status(401).send({error: 'invalid token'})
        }
    }
}