import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const Authenticate = (req,res,next) => {
    const cookieToken = req.cookies?.token;
    const headersToken = eq.headers.authorization?.split(' ')[1]
    const token = cookieToken || headersToken;
    
    if(!token){
        return res.status(401).json({message:'No token is provided'})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"got error while verifying the jwt Token", err
        })
    }
}

export default Authenticate