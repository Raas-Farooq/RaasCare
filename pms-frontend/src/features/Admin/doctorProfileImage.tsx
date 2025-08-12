import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useState, type ChangeEvent } from "react";

interface ImageUploadProps{
    imageUpload :
        (
            imagePayload:{
                imageUrl:string,
                public_id:string
            },
            imageUploading:boolean
        ) => void
}
const UploadProfileImage :React.FC<ImageUploadProps> = ({imageUpload}) => {
    const [choosenImage, setChoosenImage] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    async function handleImageInsertion(e: ChangeEvent<HTMLInputElement>) {
        setImageUploading(true);
        imageUpload({imageUrl:'', public_id:""}, true);
        const toastId = toast.loading('Uploading on Cloudinary')
        if (e.target.files) {
            try {
                const image = e.target.files[0];
                const url = URL.createObjectURL(image);
                setChoosenImage(url);
                const formData = new FormData();
                formData.append('image', image);
                const cloudinaryResult = await axios.post(`http://localhost:2500/pms/uploadOnCloudinary`, formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )
                const response = cloudinaryResult.data;
                if (cloudinaryResult.data.success) {
                    localStorage.setItem("doctorProfileImage", response.url);
                    localStorage.setItem("doctorProfilePublic_id", response.public_id);
                    imageUpload({imageUrl:response.url, public_id:response.public_id}, false);
                    toast.dismiss(toastId);
                    toast.success("Success!")
                }
            }
            catch (err) {
                console.log("Got error while uploading on cloudinary ", err);
                toast.dismiss(toastId);
                imageUpload({imageUrl:'', public_id:''}, false)
                toast.error("Something went wrong")
            }
            finally{
                setImageUploading(false);
            }
        }
    }

    return (
        <div className="max-w-xs">
            <p className="text-gray-500 mb-2 block">
                Select Profile Image
            </p>

            {/* Hidden file input */}
            <input
                type="file"
                id="docProfileImg"
                accept="image/*"
                onChange={handleImageInsertion}
                className="hidden"
            />

            {/* Custom clickable area */}
            <label
                htmlFor="docProfileImg"
                className="cursor-pointer inline-flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-colors"
            >
                {choosenImage ? (
                    <img
                        src={choosenImage}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <FaUserCircle size={64} className="text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                    {choosenImage ? "Change Image" : "Click to upload image"}
                </span>
            </label>
        </div>
    )
}

export default UploadProfileImage