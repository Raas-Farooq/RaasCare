import { validationResult } from "express-validator"

const checkRole = (allowedRoles) => (req,res,next) => {

    if(!req.user) return res.status(401).send("Unauthorized");
    const userRole = req.user.role || req.user.userRole;
    if(!userRole || !allowedRoles.includes(req.user.role)){
        return res.status(401).json({
            success:false,
            message:`only ${allowedRoles.join(', ')} can access this`
        })
    }

    next();
    
}

export default checkRole
