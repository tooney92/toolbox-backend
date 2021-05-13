const jwt = require("jsonwebtoken")
const _ = require("lodash")

module.exports.verifyAdmin = async(req, res, next)=>{
    const token = req.header('Authorization')
    if(token === undefined){
        return res.status(401).json({error: 'Access Denied'});
    }else{
        try{
            let {data} = jwt.verify(token, process.env.token_secret)
            if(data.isOga != true ){
                return res.status(401).json({error: 'Access Denied.'})
            }
            data = _.omit(data, ["password", "isOga"])
            req.user = data
            next()
        }catch(err){
            console.log(err);
            res.status(401).send({error: 'Access Denied.'})
        }
    }
}

module.exports.verifyUserAdmin = async(req, res, next)=>{
    const token = req.header('Authorization')
    if(token === undefined){
        return res.status(401).json({error: 'Access Denied'});
    }else{
        try{
            let {data} = jwt.verify(token, process.env.token_secret)
            if(data.isUser == true || data.isOga == true){
                data = _.omit(data, ["password", "isOga", "isUser" ])
                req.user = data
                next()
            }else{
                return res.status(401).json({error: 'Access Denied.'})
            }
        }catch(err){
            console.log(err);
            res.status(401).send({error: 'Access Denied.'})
        }
    }
}

module.exports.verifyUser = async(req, res, next)=>{
    const token = req.header('Authorization')
    if(token === undefined){
        return res.status(401).json({error: 'Access Denied'});
    }else{
        try{
            let {data} = jwt.verify(token, process.env.token_secret)
            if(data.isUser == true){
                data = _.omit(data, ["password",  "isUser" ])
                req.user = data
                next()
            }else{
                return res.status(401).json({error: 'Access Denied.'})
            }
        }catch(err){
            console.log(err);
            res.status(401).send({error: 'Access Denied.'})
        }
    }
}

module.exports.verifyHandyManAdmin = async(req, res, next)=>{
    const token = req.header('Authorization')
    if(token === undefined){
        return res.status(401).json({error: 'Access Denied'});
    }else{
        try{
            let {data} = jwt.verify(token, process.env.token_secret)
            if(data.isOga == true || data.isHandyMan == true){
                data = _.omit(data, ["password", "isHandyMan", "created_by" ])
                req.user = data
                next()
            }else{
                return res.status(401).json({error: 'Access Denied.'})
            }
        }catch(err){
            console.log(err);
            res.status(401).send({error: 'Access Denied.'})
        }
    }
}

module.exports.verifyUserHandyManAdmin = async(req, res, next)=>{
    const token = req.header('Authorization')
    if(token === undefined){
        return res.status(401).json({error: 'Access Denied'});
    }else{
        try{
            let {data} = jwt.verify(token, process.env.token_secret)
            if(data.isUser == true || data.isHandyMan == true || data.isOga == true){
                data = _.omit(data, ["password", "isHandyMan", "created_by" ])
                req.user = data
                next()
            }else{
                return res.status(401).json({error: 'Access Denied.'})
            }
        }catch(err){
            console.log(err);
            res.status(401).send({error: 'Access Denied.'})
        }
    }
}


module.exports.verifyHandyMan = async(req, res, next)=>{
    const token = req.header('Authorization')
    if(token === undefined){
        return res.status(401).json({error: 'Access Denied'});
    }else{
        try{
            let {data} = jwt.verify(token, process.env.token_secret)
            if(data.isHandyMan == true){
                data = _.omit(data, ["password", "isOga", "isUser", "isHandyMan", "created_by" ])
                req.user = data
                next()
            }else{
                return res.status(401).json({error: 'Access Denied.'})
            }
        }catch(err){
            console.log(err);
            res.status(401).send({error: 'Access Denied.'})
        }
    }
}