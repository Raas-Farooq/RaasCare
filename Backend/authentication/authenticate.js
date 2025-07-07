import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const authenticateToken = (req,res,next) => {

    const tokenAccessed = req.cookies.accessToken;
    if(!tokenAccessed){
        return res.status(401).json({message:'No token is provided'})
    }

    try{
        const decoded = jwt.verify(tokenAccessed, process.env.JWT_SECRET);
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