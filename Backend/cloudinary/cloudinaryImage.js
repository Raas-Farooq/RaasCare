import {v2 as cloudinary} from 'cloudinary';


const UploadOnCloudinary = async(req,res) => {
    const image= req.file.path;
    cloudinary.config({
        cloud_name: 'dk9guj9vd',
        api_key: '679969866855214',     
        api_secret:'KLFSinQdB0uj7hJJeEEl1NIoRyg'
    })
    try{
        const uploadResult = await cloudinary.uploader.upload(image, {
        folder:'MediCare'
        }).catch(err => console.log('error while uploading on Cloudinary: ', err))
        return res.status(200).json({
            success:true,
            message:'Successfully uploaded image on cloudinary',
            public_id:uploadResult.public_id,
            url: upload.secure_url
        })
    }
    catch(err)
    {
        return res.status(500).json(
            {
                success:false,
                message:"Server responded with Error during cloudinary upload",
                error:err.message
            }
        )
    }
}

export default UploadOnCloudinary

