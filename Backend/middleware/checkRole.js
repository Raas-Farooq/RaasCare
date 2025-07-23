import { validationResult } from "express-validator"

const checkRole = (allowedRoles) => (req,res,next) => {

    if(!req.user) return res.status(401).send("Unauthorized");
    if(!allowedRoles.includes(req.user.userRole)){
        return res.status(401).json({
            success:false,
            message:`only ${allowedRoles[0]} can access this`
        })
    }

    next();
    
}

export default checkRole

// where does the req.user come from
// const checkRole = (allowedRoles) = (req,res,next) => {

//     if(!req.user) return res.status(401).send("Unauthorized");