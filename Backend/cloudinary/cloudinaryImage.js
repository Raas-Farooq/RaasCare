import {v2 as cloudinary} from 'cloudinary';
import { configDotenv } from 'dotenv';
// import dotenv from 'dotenv';

// dotenv.config()

configDotenv()
const UploadOnCloudinary = async(req,res) => {
    
    if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("req.file buffer ", req.file)
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,     
            api_secret:process.env.CLOUDINARY_API_SECRET
        })
    try{
        const uploadImage= await cloudinary.uploader.upload_stream( 
            {folder:'MediCare-doctors'},
            (err, result) => {
                if(err){
                    console.log('error while uploading on Cloudinary: ', err)
                }

                return res.status(200).json({
                    success:true,
                    message:'Successfully uploaded image on cloudinary',
                    public_id:result.public_id,
                    url: result.secure_url
                })
            }
        );
        uploadImage.end(req.file.buffer)
        
    }
    catch(err)
    {
        return res.status(500).json(
            {
                success:false,
                message:"Server Error",
                error:err.message
            }
        )
    }
}

export default UploadOnCloudinary

